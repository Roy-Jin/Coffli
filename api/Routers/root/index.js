async function handleRequest(request, env) {
    return [
        `
<h1>Welcome to Coffli API</h1>
Please visit the <a href="/help">API Documentation</a> for more information.
`,
        { status: 200, headers: { 'Content-Type': 'text/html' } }
    ]
}

export default { handleRequest };