import renderMd from "../../RenderMd";

async function handleRequest(
    request: any,
    env?: any,
    context?: any,
): Promise<any[]> {
    return [
        renderMd(`
# Hello, Coffli!
> Success! The server is up and running properly.

Please refer to our [API Documentation](/help) for detailed information and usage guidelines.
`),
        { status: 200, headers: { "Content-Type": "text/html" } },
    ];
}

export default { handleRequest };
