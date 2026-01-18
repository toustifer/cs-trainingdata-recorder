import { useEffect, useRef } from 'react';
export function useOutsideClick(callback) {
    const ref = useRef(null);
    useEffect(() => {
        const onClick = (event) => {
            if (ref.current && event.target instanceof Node && !ref.current.contains(event.target)) {
                callback(event);
            }
        };
        window.addEventListener('click', onClick, true);
        return () => {
            window.removeEventListener('click', onClick, true);
        };
    }, [ref, callback]);
    return ref;
}
//# sourceMappingURL=use-outside-click.js.map