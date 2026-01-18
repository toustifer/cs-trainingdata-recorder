import React, { useState, createContext } from 'react';
import { useLingui } from '@lingui/react/macro';
import { Game } from 'csdm/common/types/counter-strike';
export const MapFormContext = createContext({
    game: Game.CS2,
    fields: {},
    validate: () => {
        throw new Error('validate not implemented');
    },
    setField: () => {
        throw new Error('setField not implemented');
    },
    validateField: () => {
        throw new Error('validateField not implemented');
    },
});
export function MapFormProvider({ children, id, game, initialValues }) {
    const { t } = useLingui();
    const [fields, setFields] = useState({
        name: {
            value: initialValues?.name ?? '',
            error: undefined,
            validate: (value) => {
                if (value === '') {
                    return t `Name is required.`;
                }
            },
        },
        posX: {
            value: initialValues?.posX ?? '0',
            error: undefined,
            validate: (value) => {
                if (value === '') {
                    return t `Coordinate X is required.`;
                }
            },
        },
        posY: {
            value: initialValues?.posY ?? '0',
            error: undefined,
            validate: (value) => {
                if (value === '') {
                    return t `Coordinate Y is required.`;
                }
            },
        },
        thresholdZ: {
            value: initialValues?.thresholdZ ?? '0',
            error: undefined,
            validate: (value) => {
                if (value === '') {
                    return t `Threshold Z is required.`;
                }
            },
        },
        scale: {
            value: initialValues?.scale ?? '0',
            error: undefined,
            validate: (value) => {
                if (value === '') {
                    return t `Scale is required.`;
                }
            },
        },
        radarBase64: {
            value: initialValues?.radarBase64 ?? '',
            error: undefined,
            validate: () => {
                return undefined;
            },
        },
        lowerRadarBase64: {
            value: initialValues?.lowerRadarBase64 ?? '',
            error: undefined,
            validate: () => {
                return undefined;
            },
        },
        thumbnailBase64: {
            value: initialValues?.thumbnailBase64 ?? '',
            error: undefined,
            validate: () => {
                return undefined;
            },
        },
    });
    const setField = (name, value, error) => {
        setFields({
            ...fields,
            [name]: {
                ...fields[name],
                ...{ value, error },
            },
        });
    };
    const validateField = (field) => {
        const error = fields[field].validate(fields[field].value);
        setFields({ ...fields, [field]: { ...fields[field], error } });
    };
    const validate = () => {
        for (const field of Object.values(fields)) {
            const hasError = field.validate(field.value) !== undefined;
            if (hasError) {
                return false;
            }
        }
        return true;
    };
    return (React.createElement(MapFormContext.Provider, { value: {
            id,
            game,
            fields,
            validate,
            setField,
            validateField,
        } }, children));
}
//# sourceMappingURL=map-form-provider.js.map