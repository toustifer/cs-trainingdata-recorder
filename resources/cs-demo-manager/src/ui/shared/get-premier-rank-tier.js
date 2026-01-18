export function getPremierRankTier(rank) {
    const remappedRating = Math.floor(rank / 1000.0 / 5);
    const clampedRating = Math.max(0, Math.min(remappedRating, 6));
    return clampedRating;
}
//# sourceMappingURL=get-premier-rank-tier.js.map