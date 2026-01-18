export function renownAccountRowToRenownAccount(row) {
    return {
        id: row.steam_id,
        nickname: row.nickname,
        avatarUrl: row.avatar_url,
        isCurrent: row.is_current,
    };
}
//# sourceMappingURL=renown-account-row-to-renown-account.js.map