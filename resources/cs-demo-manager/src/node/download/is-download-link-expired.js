export async function isDownloadLinkExpired(demoUrl) {
    if (!demoUrl) {
        return true;
    }
    try {
        const response = await fetch(demoUrl, {
            method: 'HEAD',
        });
        return response.status !== 200;
    }
    catch (error) {
        return true;
    }
}
//# sourceMappingURL=is-download-link-expired.js.map