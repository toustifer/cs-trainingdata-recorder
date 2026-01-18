export async function getRegistryStringKey({ path, name }) {
    try {
        const { HKEY, enumerateValues } = await import('registry-js');
        const entry = enumerateValues(HKEY.HKEY_CURRENT_USER, path).find((value) => {
            return value.name === name;
        });
        if (typeof entry?.data !== 'string') {
            return undefined;
        }
        return entry.data;
    }
    catch (error) {
        logger.error(error);
        return undefined;
    }
}
export async function writeRegistryStringKey({ path, name, data }) {
    const { HKEY, RegistryValueType, setValue } = await import('registry-js');
    setValue(HKEY.HKEY_CURRENT_USER, path, name, RegistryValueType.REG_SZ, data);
}
//# sourceMappingURL=windows-registry.js.map