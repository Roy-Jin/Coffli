import { marked } from "marked";

export default function renderMd(md: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Interface documentation</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.8.1/github-markdown.min.css">
    <link href="https://cdn.jsdelivr.net/npm/prism-themes@1.9.0/themes/prism-one-dark.min.css" rel="stylesheet" />
    <style>
        html { background-color: #0d1117; }
        body { max-width: 50rem; margin: 0px auto !important; padding: 2rem; }
    </style>
</head>
<body class="markdown-body">
    ${marked.parse(md)}
</body>
<script src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/components/prism-core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/plugins/autoloader/prism-autoloader.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/plugins/normalize-whitespace/prism-normalize-whitespace.min.js"></script>
</html>
`;
}
