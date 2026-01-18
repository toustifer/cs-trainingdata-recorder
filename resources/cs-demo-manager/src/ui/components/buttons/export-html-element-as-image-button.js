import React from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { Button, ButtonVariant } from 'csdm/ui/components/buttons/button';
import { useShowToast } from 'csdm/ui/components/toasts/use-show-toast';
export function ExportHtmlElementAsImageButton({ getElement, getFileName }) {
    const showToast = useShowToast();
    const { t } = useLingui();
    const onClick = async () => {
        const element = getElement();
        if (!element) {
            return;
        }
        try {
            const filePath = await window.csdm.elementToImage({
                element,
                fileName: getFileName(),
                title: t({
                    context: 'OS save dialog title',
                    message: 'Export as PNG',
                }),
            });
            if (filePath) {
                window.csdm.browseToFile(filePath);
            }
        }
        catch (error) {
            logger.error(error);
            showToast({
                content: t `An error occurred`,
                type: 'error',
            });
        }
    };
    return (React.createElement(Button, { onClick: onClick, variant: ButtonVariant.Primary },
        React.createElement(Trans, { context: "Button" }, "Export as PNG")));
}
//# sourceMappingURL=export-html-element-as-image-button.js.map