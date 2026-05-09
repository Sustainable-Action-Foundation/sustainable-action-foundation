const DISPATCH_URL = 'https://api.github.com/repos/Sustainable-Action-Foundation/sustainable-action-foundation/actions/workflows/deploy.yml/dispatches';
const DEPLOY_BRANCH = 'master';
const DISPATCH_COOLDOWN_MS = 2 * 60 * 1000;
let nextDispatchAt = 0;
let consecutiveFailures = 0;

function triggerDeploy() {
    const token = process.env.GITHUB_ACCESS_KEY;
    if (!token) {
        console.log('Skipping deploy dispatch: GITHUB_ACCESS_KEY is missing.');
        return;
    }

    const now = Date.now();
    if (now < nextDispatchAt) {
        console.log('Skipping deploy dispatch: next allowed at', new Date(nextDispatchAt).toISOString());
        return;
    }

    try {
        const res = $http.send({
            method: 'POST',
            url: DISPATCH_URL,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github.v3+json',
                'X-GitHub-Api-Version': '2026-03-10',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ref: DEPLOY_BRANCH }),
        });

        // determine status and headers in a defensive way
        const status = res && (res.status || res.statusCode || res.status_code || 0);
        const headers = res && (res.headers || res.responseHeaders || {});

        if (status >= 200 && status < 300) {
            console.log('Deploy dispatch succeeded with status', status);
            consecutiveFailures = 0;
            nextDispatchAt = Date.now() + DISPATCH_COOLDOWN_MS;
            return;
        }

        // Handle rate limiting / server busy
        if (status === 429 || status === 503) {
            consecutiveFailures += 1;
            const ra = headers['retry-after'] || headers['Retry-After'] || headers['retry-after-seconds'];
            const retrySec = ra ? parseInt(ra, 10) || 0 : 0;
            const backoffMs = retrySec > 0 ? retrySec * 1000 : Math.min(5 * 60 * 1000, DISPATCH_COOLDOWN_MS * Math.pow(2, consecutiveFailures));
            nextDispatchAt = Date.now() + backoffMs;
            console.log('Deploy dispatch throttled', status, 'setting nextDispatchAt', new Date(nextDispatchAt).toISOString(), 'consecutiveFailures', consecutiveFailures);
            return;
        }

        // For 4xx/5xx errors, back off progressively but log the response
        consecutiveFailures += 1;
        const backoffMs = Math.min(60 * 60 * 1000, DISPATCH_COOLDOWN_MS * Math.pow(2, consecutiveFailures));
        nextDispatchAt = Date.now() + backoffMs;
        console.log('Deploy dispatch failed', status, 'response:', res && res.body ? res.body : res, 'nextDispatchAt', new Date(nextDispatchAt).toISOString());
    } catch (err) {
        consecutiveFailures += 1;
        const backoffMs = Math.min(60 * 60 * 1000, DISPATCH_COOLDOWN_MS * Math.pow(2, consecutiveFailures));
        nextDispatchAt = Date.now() + backoffMs;
        console.log('Failed to dispatch deploy workflow (exception):', err, 'nextDispatchAt', new Date(nextDispatchAt).toISOString());
    }
}

// Only content changes used by the public site should trigger deploy.
onRecordAfterCreateSuccess(triggerDeploy, 'news', 'people', 'programs', 'projects');
onRecordAfterUpdateSuccess(triggerDeploy, 'news', 'people', 'programs', 'projects');
onRecordAfterDeleteSuccess(triggerDeploy, 'news', 'people', 'programs', 'projects');