import { useCameraForm } from './use-camera-form';
export function useCameraFormField(name) {
    const form = useCameraForm();
    return {
        ...form.fields[name],
        validate: form.validateField.bind(form, name),
        setField: (value, error) => form.setField(name, value, error),
    };
}
//# sourceMappingURL=use-camera-form-field.js.map