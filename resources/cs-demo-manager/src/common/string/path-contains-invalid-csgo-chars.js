/**
 * If a path contains unsupported CSGO chars, the playback will not start and the game will be stuck on the home screen.
 * CS2 is not affected by this issue.
 */
export function pathContainsInvalidCsgoChars(path) {
    return /[&;@^]/g.test(path);
}
//# sourceMappingURL=path-contains-invalid-csgo-chars.js.map