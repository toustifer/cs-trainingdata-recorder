import React from 'react';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeRaw from 'rehype-raw';
import { unified } from 'unified';
export function Markdown({ markdown }) {
    const file = unified()
        .use(remarkParse)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeStringify)
        .processSync(markdown);
    return React.createElement("div", { dangerouslySetInnerHTML: { __html: String(file) } });
}
//# sourceMappingURL=markdown.js.map