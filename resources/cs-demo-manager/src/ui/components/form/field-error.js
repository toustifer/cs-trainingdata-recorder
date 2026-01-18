import React, {} from 'react';
export function FieldError({ error }) {
    if (!error) {
        return null;
    }
    return React.createElement("p", { className: "text-red-600" }, error);
}
//# sourceMappingURL=field-error.js.map