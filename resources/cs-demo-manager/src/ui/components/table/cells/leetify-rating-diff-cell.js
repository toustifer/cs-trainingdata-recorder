import React from 'react';
export function LeetifyRatingDiffCell({ data }) {
    const diff = data.leetifyRating;
    if (diff === null) {
        return null;
    }
    const text = diff > 0 ? `+${diff}` : diff.toString();
    const getColor = () => {
        if (diff > 5) {
            return '#7bdbbc'; // great
        }
        if (diff > 2) {
            return '#addb85'; // good
        }
        if (diff > -2) {
            return '#bebebe'; // average
        }
        if (diff > -5) {
            return '#fdd97c'; // subpar
        }
        return '#fd947c'; // poor
    };
    return (React.createElement("span", { className: "selectable", style: {
            color: getColor(),
        } }, text));
}
//# sourceMappingURL=leetify-rating-diff-cell.js.map