export function getTeamScoreClassName(score, oppositeScore) {
    if (score === oppositeScore) {
        return 'text-blue-400';
    }
    return score > oppositeScore ? 'text-green-400' : 'text-red-400';
}
//# sourceMappingURL=get-team-score-class-name.js.map