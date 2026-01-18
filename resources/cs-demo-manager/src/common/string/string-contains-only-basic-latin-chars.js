export function stringContainsOnlyBasicLatinChars(str) {
    // eslint-disable-next-line no-control-regex
    return /^[\x00-\x7F]*$/.test(str);
}
//# sourceMappingURL=string-contains-only-basic-latin-chars.js.map