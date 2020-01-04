import { useState, useEffect } from 'react';

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
 * @returns {number} Header height
 */
export function useHeaderHeight() {
    const { width } = useWindowSize();
    return width < 600 ? 56 : 64;
}