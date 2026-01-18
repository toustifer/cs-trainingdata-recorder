export function isValidJson(data) {
    try {
        JSON.parse(data);
        return true;
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=json.js.map