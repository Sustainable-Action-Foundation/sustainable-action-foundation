const DISPATCH_URL = 'https://api.github.com/repos/Sustainable-Action-Foundation/sustainable-action-foundation/actions/workflows/deploy.yml/dispatches';
const DEPLOY_BRANCH = 'master';
const DISPATCH_COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes
let nextDispatchAt = 0;
let consecutiveFailures = 0;
let scheduledDispatchTimer = null;
const BASE_DEBOUNCE_MS = 20 * 1000; // 20s
const JITTER_MS = 10 * 1000; // up to 10s random jitter

function triggerDeploy() {
    const token = process.env.GITHUB_ACCESS_KEY;
    if (!token) {
        console.log('Skipping deploy dispatch: GITHUB_ACCESS_KEY is missing.');
        return;
    }
    // Debounce multiple near-simultaneous triggerDeploy calls into a single dispatch.
    if (scheduledDispatchTimer) {
        console.log('Dispatch already scheduled; coalescing trigger.');
        return;
    }

    const delay = BASE_DEBOUNCE_MS + Math.floor(Math.random() * JITTER_MS);
    scheduledDispatchTimer = setTimeout(() => {
        scheduledDispatchTimer = null;
        // If nextDispatchAt is in the future, reschedule to that time + small jitter
        const now = Date.now();
        if (now < nextDispatchAt) {
            const rescheduleDelay = (nextDispatchAt - now) + Math.floor(Math.random() * 5000);
            console.log('Rescheduling dispatch to honor nextDispatchAt', new Date(nextDispatchAt).toISOString());
            scheduledDispatchTimer = setTimeout(() => {
                scheduledDispatchTimer = null;
                _performDispatch(token);
            }, rescheduleDelay);
            return;
        }

        _performDispatch(token);
    }, delay);
    console.log('Scheduled deploy dispatch in', Math.round(delay / 1000), 's');
}

function _performDispatch(token) {
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

        const status = res && (res.status || res.statusCode || res.status_code || 0);
        const headers = res && (res.headers || res.responseHeaders || {});

        if (status >= 200 && status < 300) {
            console.log('Deploy dispatch succeeded with status', status);
            consecutiveFailures = 0;
            nextDispatchAt = Date.now() + DISPATCH_COOLDOWN_MS;
            return;
        }

        if (status === 429 || status === 503) {
            consecutiveFailures += 1;
            const ra = headers['retry-after'] || headers['Retry-After'] || headers['retry-after-seconds'];
            const retrySec = ra ? parseInt(ra, 10) || 0 : 0;
            const backoffMs = retrySec > 0 ? retrySec * 1000 : Math.min(5 * 60 * 1000, DISPATCH_COOLDOWN_MS * Math.pow(2, consecutiveFailures));
            nextDispatchAt = Date.now() + backoffMs;
            console.log('Deploy dispatch throttled', status, 'setting nextDispatchAt', new Date(nextDispatchAt).toISOString(), 'consecutiveFailures', consecutiveFailures);
            return;
        }

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