import { useMatchChecksums } from 'csdm/ui/cache/use-match-checksums';
export function useIsDemoInDatabase() {
    const matchChecksums = useMatchChecksums();
    return (demoChecksum) => {
        return matchChecksums.includes(demoChecksum);
    };
}
//# sourceMappingURL=use-is-demo-in-database.js.map