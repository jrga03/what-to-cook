import { useState, useEffect } from 'react';

/**
 * Hook for getting window size
 * @returns {object} Window width and height
 */
export function useWindowSize() {
    const isClient = typeof window === 'object';

    function getSize() {
        return {
            width: isClient ? window.outerWidth : undefined,
            height: isClient ? window.outerHeight : undefined
        };
    }

    const [ windowSize, setWindowSize ] = useState( getSize );

    useEffect(() => {
        if ( !isClient ) {
            return false;
        }
        
        function handleResize() {
            setWindowSize( getSize());
        }

        window.addEventListener( 'resize', handleResize );
        return () => window.removeEventListener( 'resize', handleResize );
    }, []); // eslint-disable-line

    return windowSize;
}

/**
 * Hook for getting header height based on window size
 * @returns {number} Header height
 */
export function useHeaderHeight() {
    const { width } = useWindowSize();
    return width < 600 ? 56 : 64;
}

/**
 * Hook for debouncing fast-changing value
 * @param {*} value
 * @param {number} [delay = 500] - Delay before returning value
 * @returns {*}
 */
export function useDebounce( value, delay = 500 ) {
    const [ debouncedValue, setDebouncedValue ] = useState( value );

    useEffect(
        () => {
            const handler = setTimeout(() => {
                setDebouncedValue( value );
            }, delay );

            return () => {
                clearTimeout( handler );
            };
        },
        [ value, delay ]
    );

    return debouncedValue;
}
