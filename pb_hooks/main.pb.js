const DISPATCH_URL = 'https://api.github.com/repos/Sustainable-Action-Foundation/sustainable-action-foundation/actions/workflows/deploy.yml/dispatches';
const DEPLOY_BRANCH = 'master';
const DISPATCH_COOLDOWN_MS = 2 * 60 * 1000;
let lastDispatchAt = 0;

function triggerDeploy() {
    const token = process.env.GITHUB_ACCESS_KEY;
    if (!token) {
        console.log('Skipping deploy dispatch: GITHUB_ACCESS_KEY is missing.');
        return;
    }

    const now = Date.now();
    if (now - lastDispatchAt < DISPATCH_COOLDOWN_MS) {
        console.log('Skipping deploy dispatch: cooldown active.');
        return;
    }

    lastDispatchAt = now;

    try {
        $http.send({
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
    } catch (err) {
        console.log('Failed to dispatch deploy workflow:', err);
    }
}

// Only content changes used by the public site should trigger deploy.
onRecordAfterCreateSuccess(triggerDeploy, 'news', 'people', 'programs', 'projects');
onRecordAfterUpdateSuccess(triggerDeploy, 'news', 'people', 'programs', 'projects');
onRecordAfterDeleteSuccess(triggerDeploy, 'news', 'people', 'programs', 'projects');