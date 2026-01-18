import React, { useEffect, useState } from 'react';
import { Trans } from '@lingui/react/macro';
import rehypeStringify from 'rehype-stringify';
import remarkDirective from 'remark-directive';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import rehypeExternalLinks from 'rehype-external-links';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'csdm/ui/dialogs/dialog';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { CloseButton } from 'csdm/ui/components/buttons/close-button';
import { ExternalLink } from 'csdm/ui/components/external-link';
import { Donate } from 'csdm/ui/components/donate';
import { Status } from 'csdm/common/types/status';
import { Spinner } from 'csdm/ui/components/spinner';
function directiveStylingPlugin() {
    return function (tree) {
        visit(tree, function (node) {
            if (node.type === 'containerDirective') {
                const data = node.data ?? (node.data = {});
                data.hName = 'div';
                switch (node.name) {
                    case 'warning':
                        data.hProperties = { className: 'directive warning' };
                        break;
                    case 'info':
                        data.hProperties = { className: 'directive info' };
                        break;
                    case 'danger':
                        data.hProperties = { className: 'directive danger' };
                        break;
                }
            }
        });
    };
}
export function ChangelogDialog() {
    const { hideDialog } = useDialog();
    const [status, setStatus] = useState(Status.Loading);
    const [html, setHtml] = useState('');
    useEffect(() => {
        (async () => {
            try {
                const response = await fetch('https://raw.githubusercontent.com/akiver/cs-demo-manager.com/refs/heads/main/src/pages/changelog.mdx', {
                    headers: {
                        'User-Agent': 'CS:DM',
                    },
                });
                const text = await response.text();
                const versions = text.split('## v').filter((version) => {
                    const trimmedVersion = version.trim();
                    return trimmedVersion !== '' && trimmedVersion.startsWith('3');
                });
                if (versions.length === 0) {
                    throw new Error('No versions found in the changelog');
                }
                let [markdown] = versions;
                // remove the version number
                markdown = markdown.replace(/\d+\.\d+\.\d+/g, '');
                // remove the OSS info directive
                markdown = markdown.replace(/:::[\w-]+\n([\s\S]*?):::/g, '');
                // prepend https://cs-demo-manager.com to links
                markdown = markdown.replace(/]\((\/[^)]+)\)/g, `](https://cs-demo-manager.com$1)`);
                const processor = unified()
                    .use(remarkParse)
                    .use(remarkDirective)
                    .use(directiveStylingPlugin)
                    .use(remarkRehype, { allowDangerousHtml: true })
                    .use(rehypeExternalLinks, { rel: ['noopener', 'noreferrer'], target: '_blank' })
                    .use(rehypeStringify);
                const file = await processor.process(markdown);
                setHtml(String(file));
                setStatus(Status.Success);
            }
            catch (error) {
                logger.log('Failed to fetch changelog');
                logger.error(error);
                setStatus(Status.Error);
            }
        })();
    }, []);
    const renderChangelog = () => {
        if (status === Status.Loading) {
            return (React.createElement("div", { className: "flex h-[120px] items-center justify-center self-center" },
                React.createElement(Spinner, { size: 48 })));
        }
        if (status === Status.Error) {
            return (React.createElement("p", { className: "text-body-strong" },
                React.createElement(Trans, null, "Failed to load changelog.")));
        }
        return React.createElement("div", { className: "changelog", dangerouslySetInnerHTML: { __html: html } });
    };
    return (React.createElement(Dialog, null,
        React.createElement(DialogHeader, null,
            React.createElement(DialogTitle, null,
                React.createElement(Trans, null,
                    "Changelog version ",
                    APP_VERSION))),
        React.createElement(DialogContent, null,
            React.createElement("div", { className: "flex max-w-[700px] flex-col gap-y-16 **:select-text" },
                renderChangelog(),
                React.createElement(Donate, null))),
        React.createElement(DialogFooter, null,
            React.createElement(ExternalLink, { href: "https://cs-demo-manager.com" },
                React.createElement(Trans, null, "Visit website")),
            React.createElement(CloseButton, { onClick: hideDialog }))));
}
//# sourceMappingURL=changelog-dialog.js.map