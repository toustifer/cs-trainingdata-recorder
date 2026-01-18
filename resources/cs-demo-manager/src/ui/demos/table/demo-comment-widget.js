import React from 'react';
import { TableCommentWidget } from 'csdm/ui/components/table/comment-widget';
import { useUpdateComment } from 'csdm/ui/comment/use-update-comment';
export function DemoCommentWidget({ onClose, demos }) {
    const updateComment = useUpdateComment();
    if (demos.length === 0) {
        return null;
    }
    const [selectedDemo] = demos;
    const onBlur = (comment) => {
        if (comment === selectedDemo.comment) {
            return;
        }
        updateComment({
            checksum: selectedDemo.checksum,
            comment,
        });
    };
    return (React.createElement(TableCommentWidget, { key: `comment-${selectedDemo.checksum}`, comment: selectedDemo.comment, onClose: onClose, onBlur: onBlur }));
}
//# sourceMappingURL=demo-comment-widget.js.map