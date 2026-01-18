import { useMapForm } from 'csdm/ui/settings/maps/map-dialog/use-map-form';
export function useMapFormField(name) {
    const form = useMapForm();
    return {
        ...form.fields[name],
        validate: form.validateField.bind(form, name),
        setField: (value, error) => form.setField(name, value, error),
    };
}
//# sourceMappingURL=use-map-form-field.js.map