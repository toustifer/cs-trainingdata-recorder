import React from 'react';
import { DemoWithValveMatch } from './demo-with-valve-match';
import { DemoWithoutValveMatch } from './demo-without-valve-match';
import { useCurrentDemo } from './use-current-demo';
export function Demo() {
    const demo = useCurrentDemo();
    if (demo.valveMatch !== undefined) {
        return React.createElement(DemoWithValveMatch, { demo: demo });
    }
    return React.createElement(DemoWithoutValveMatch, null);
}
//# sourceMappingURL=demo.js.map