const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const workflow = fs.readFileSync(path.join(__dirname, '../.github/workflows/recover-pages.yml'), 'utf8');
const script = workflow.split('          script: |\n')[1].split('\n')
  .map(line => line.startsWith('            ') ? line.slice(12) : line).join('\n');
const execute = new (Object.getPrototypeOf(async function () {}).constructor)(
  'github', 'core', 'context', 'setTimeout', script);

async function scenario({cancelStatus, cancelMessage = 'cancel failed', deploymentStatus = 'succeed', runs, failedJobs = [{name: 'deploy', conclusion: 'failure'}]}) {
  const calls = [];
  let index = 0;
  const github = {
    request: async (route, params) => {
      calls.push({route, params});
      if (route.startsWith('GET ')) return {data: {status: deploymentStatus}};
      if (cancelStatus) throw Object.assign(new Error(cancelMessage), {status: cancelStatus});
    },
    rest: {actions: {
      listWorkflowRunsForRepo: async params => {
        calls.push({list: params});
        return {data: {workflow_runs: runs[Math.min(index++, runs.length - 1)]}};
      },
      listJobsForWorkflowRun: async () => ({data: {jobs: failedJobs}}),
      reRunWorkflowFailedJobs: async params => calls.push({retry: params})
    }}
  };
  const summary = {addHeading: () => summary, addLink: () => summary, write: async () => {}};
  const core = {info() {}, warning() {}, summary};
  await execute(github, core, {
    repo: {owner: 'Viktor-gym', repo: 'gym-pwa'}, sha: 'current',
    payload: {inputs: {blocked_sha: 'a67ae99147b7b0a7461f01f7387eba3b51a5b54f'}}
  }, fn => fn());
  return calls;
}

const run = conclusion => ({id: 42, name: 'pages build and deployment', status: 'completed', conclusion, html_url: 'https://github.com/example/run'});

test('Pages recovery is manual only, without push or chained workflow triggers', () => {
  assert.match(workflow, /workflow_dispatch:/);
  assert.doesNotMatch(workflow, /^  (push|workflow_run|schedule):/m);
  assert.match(workflow, /permissions: \{\}/);
  assert.doesNotMatch(workflow, /contents: write/);
});

test('Pages recovery cancels only the known stale SHA and does not retry success', async () => {
  const calls = await scenario({runs: [[run('success')]]});
  assert.equal(calls[0].params.pages_deployment_id, 'a67ae99147b7b0a7461f01f7387eba3b51a5b54f');
  assert.equal(calls.filter(call => call.retry).length, 0);
  assert.equal(calls.find(call => call.list).list.head_sha, 'current');
});

test('Pages recovery retries a failed deploy only once', async () => {
  const calls = await scenario({runs: [[run('failure')], [run('success')]]});
  assert.equal(calls.filter(call => call.retry).length, 1);
  await assert.rejects(scenario({runs: [[run('failure')]]}), /still failed/);
});

test('Pages recovery tolerates an absent stale deployment but not denied access', async () => {
  await scenario({cancelStatus: 404, runs: [[run('success')]]});
  await assert.rejects(scenario({cancelStatus: 403, runs: [[run('success')]]}), /cancel failed/);
});

test('Pages recovery verifies the terminal state when cancellation reports already finished', async () => {
  const options = {cancelStatus: 400, cancelMessage: "Unable to cancel deployment as it's finished.", runs: [[run('success')]]};
  await scenario(options);
  await assert.rejects(scenario({...options, deploymentStatus: 'deployment_queued'}), /Unable to cancel/);
  await assert.rejects(scenario({...options, cancelMessage: 'Unexpected server error'}), /Unexpected/);
});

test('Pages recovery never retries a failed build or an unrelated workflow', async () => {
  await assert.rejects(scenario({runs: [[run('failure')]], failedJobs: [{name: 'build', conclusion: 'failure'}]}), /non-deployment failure/);
  await assert.rejects(scenario({runs: [[{...run('success'), name: 'Other workflow'}]]}), /did not finish/);
});
