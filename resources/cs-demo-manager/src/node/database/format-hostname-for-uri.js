import { isIPv6 } from 'node:net';
export function formatHostnameForUri(hostname) {
    if (isIPv6(hostname) && !hostname.startsWith('[')) {
        return `[${hostname}]`;
    }
    return hostname;
}
//# sourceMappingURL=format-hostname-for-uri.js.map