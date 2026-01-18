export function faceitAccountRowToFaceitAccount(row) {
    return {
        id: row.id,
        nickname: row.nickname,
        avatarUrl: row.avatar_url,
        isCurrent: row.is_current,
    };
}
//# sourceMappingURL=faceit-account-row-to-faceit-account.js.map