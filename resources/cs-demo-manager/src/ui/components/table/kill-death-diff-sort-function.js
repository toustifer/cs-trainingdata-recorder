export function killDeathDiffSortFunction(sortDirection) {
    return (rowA, rowB) => {
        const diffA = rowA.killCount - rowA.deathCount;
        const diffB = rowB.killCount - rowB.deathCount;
        return sortDirection === 'asc' ? diffA - diffB : diffB - diffA;
    };
}
//# sourceMappingURL=kill-death-diff-sort-function.js.map