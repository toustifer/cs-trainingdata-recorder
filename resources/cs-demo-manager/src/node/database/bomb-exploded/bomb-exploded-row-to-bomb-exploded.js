export function bombExplodedRowToBombExploded(row) {
    return {
        id: row.id,
        matchChecksum: row.match_checksum,
        tick: row.tick,
        frame: row.frame,
        roundNumber: row.round_number,
        isPlanterControllingBot: row.is_planter_controlling_bot,
        planterName: row.planter_name,
        planterSteamId: row.planter_steam_id,
        site: row.site,
        x: row.x,
        y: row.y,
        z: row.z,
    };
}
//# sourceMappingURL=bomb-exploded-row-to-bomb-exploded.js.map