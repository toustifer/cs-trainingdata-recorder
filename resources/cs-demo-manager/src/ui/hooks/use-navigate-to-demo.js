import { useNavigate } from 'react-router';
import { buildDemoPath } from 'csdm/ui/routes-paths';
export function useNavigateToDemo() {
    const navigate = useNavigate();
    return (demoFilePath, options) => {
        const demoPath = buildDemoPath(demoFilePath);
        navigate(demoPath, options);
    };
}
//# sourceMappingURL=use-navigate-to-demo.js.map