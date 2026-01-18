import React, { useState, createContext, useEffect } from 'react';
import { Status } from 'csdm/common/types/status';
import { Loading } from './loading';
export const ArgumentsContext = createContext({
    arguments: [],
    clearArguments: () => {
        throw new Error('clearArguments not implemented');
    },
});
export function ArgumentsProvider({ children }) {
    const [status, setStatus] = useState(Status.Loading);
    const [args, setArgs] = useState([]);
    useEffect(() => {
        const getStartupArguments = async () => {
            const args = await window.csdm.getStartupArguments();
            setArgs(args);
            setStatus(Status.Success);
        };
        getStartupArguments();
    }, []);
    const clearArguments = () => {
        window.csdm.clearStartupArguments();
        setArgs([]);
    };
    if (status === Status.Loading) {
        return React.createElement(Loading, null);
    }
    return (React.createElement(ArgumentsContext.Provider, { value: {
            arguments: args,
            clearArguments,
        } }, children));
}
//# sourceMappingURL=arguments-provider.js.map