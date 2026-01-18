import { useContext } from 'react';
import { ArgumentsContext } from './arguments-provider';
export function useArgument(argumentName) {
    const context = useContext(ArgumentsContext);
    return context.arguments.find((arg) => arg.name === argumentName)?.value;
}
//# sourceMappingURL=use-argument.js.map