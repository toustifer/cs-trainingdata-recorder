export function getArgumentValueFromArray(values, argumentName) {
    const argument = values.find((value) => value.startsWith(`--${argumentName}=`));
    if (argument === undefined) {
        return undefined;
    }
    const value = argument.slice(argument.indexOf('=') + 1);
    return value;
}
//# sourceMappingURL=get-argument-value-from-array.js.map