import React from 'react';
import { Trans } from '@lingui/react/macro';
import { QuestionIcon } from 'csdm/ui/icons/question-icon';
import { Tooltip } from 'csdm/ui/components/tooltip';
export function DocumentationLink({ url }) {
    return (React.createElement(Tooltip, { placement: "left", content: React.createElement("p", null,
            React.createElement(Trans, { context: "Link" }, "Documentation")) },
        React.createElement("a", { href: url, target: "_blank", rel: "noreferrer" },
            React.createElement(QuestionIcon, { className: "size-16" }))));
}
//# sourceMappingURL=documentation-link.js.map