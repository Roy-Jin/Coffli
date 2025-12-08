import renderMd from "../../RenderMd";
import mdContent from "./interface.md";

async function handleRequest(
    request: any,
    env?: any,
    context?: any,
): Promise<any[]> {
    try {
        return [
            renderMd(
                mdContent.replaceAll("%BASEURL%", new URL(request.url).origin),
            ),
            { status: 200, headers: { "Content-Type": "text/html" } },
        ];
    } catch (error: any) {
        return [
            { error: "Document loading failed", details: error.message },
            { status: 500 },
        ];
    }
}

export default { handleRequest };
