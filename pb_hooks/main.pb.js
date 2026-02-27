onRecordAfterCreateRequest(() => {
    $http.send({
        method: 'POST',
        url: 'https://api.github.com/repos/Sustainable-Action-Foundation/sustainable-action-foundation/actions/workflows/deploy.yml/dispatches',
        headers: {
            'Authorization': `Bearer ${process.env.GITHUB_ACCESS_KEY}`,
            'Accept': 'application/vnd.github.v3+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            ref: 'master' 
        }),    
    })
})

onRecordAfterUpdateRequest(() => {
    $http.send({
        method: 'POST',
        url: 'https://api.github.com/repos/Sustainable-Action-Foundation/sustainable-action-foundation/actions/workflows/deploy.yml/dispatches',
        headers: {
            'Authorization': `Bearer ${process.env.GITHUB_ACCESS_KEY}`,
            'Accept': 'application/vnd.github.v3+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            ref: 'master' 
        }),    
    })})

onRecordAfterDeleteRequest(() => {
    $http.send({
        method: 'POST',
        url: 'https://api.github.com/repos/Sustainable-Action-Foundation/sustainable-action-foundation/actions/workflows/deploy.yml/dispatches',
        headers: {
            'Authorization': `Bearer ${process.env.GITHUB_ACCESS_KEY}`,
            'Accept': 'application/vnd.github.v3+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            ref: 'master' 
        }),    
    })
})