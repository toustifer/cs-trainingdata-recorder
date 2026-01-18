export function hostagePositionRowToHostagePosition(row) {
    return {
        id: row.id,
        frame: row.frame,
        matchChecksum: row.match_checksum,
        roundNumber: row.round_number,
        state: row.state,
        tick: row.tick,
        x: row.x,
        y: row.y,
        z: row.z,
    };
}
//# sourceMappingURL=hostage-position-row-to-hostage-position.js.map