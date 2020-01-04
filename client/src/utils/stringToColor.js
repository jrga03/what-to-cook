/**
 * Generates HSL color from string
 * @param {string} string
 * @returns {string} HSL color
 */
export function toHSL( string = '' ) {
    let hash = 0;
    if ( string.length === 0 ) return hash;
    let h, l;

    const options = {
        hue: [ 0, 360 ],
        lightness: [ 75, 90 ]
    };

    const range = ( hash, min, max ) => {
        const diff = max - min;
        const x = (( hash % diff ) + diff ) % diff;
        return x + min;
    }

    for ( const letter of string ) {
        hash = letter.charCodeAt() + ((hash << 5) - hash);
        hash = hash & hash;
    }

    h = range( hash, ...options.hue );
    l = range( hash, ...options.lightness );

    return `hsl(${h}, 100%, ${l}%)`;
}
