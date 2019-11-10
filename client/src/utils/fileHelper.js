import axios from 'axios';
import imageCompression from 'browser-image-compression';
import sha1 from 'crypto-js/sha1';

const {
    REACT_APP_CLOUDINARY_UPLOAD_URL,
    REACT_APP_CLOUDINARY_API_KEY,
    REACT_APP_CLOUDINARY_API_SECRET
} = process.env;

const DEFAULT_UPLOAD_OPTIONS = {
    format: 'png',
    transformation: 'q_auto'
};

/**
 * Uploads a file using Cloudinary API
 *
 * @param {Object} file - File to be uploaded
 * @param {Object} [options] - Additional options for the upload
 */
export function upload( file, options = {}) {
    const timestamp = Date.now().toString().substring( 0, 10 );
    const optionsWithTimestamp = Object.assign(
        {},
        DEFAULT_UPLOAD_OPTIONS,
        {
            ...options,
            timestamp
        }
    );
    const signature = generateSignature( optionsWithTimestamp );

    const data = new FormData();
    data.append( 'file', file );
    data.append( 'signature', signature );
    data.append( 'api_key', REACT_APP_CLOUDINARY_API_KEY );

    for ( const key of Object.keys( optionsWithTimestamp )) {
        data.append( key, optionsWithTimestamp[ key ]);
    }

    return axios( REACT_APP_CLOUDINARY_UPLOAD_URL, {
        method: 'POST',
        data
    });
}

/**
 * Generates signature from options
 *
 * @param {Object} options
 * @returns {String} Signature
 */
function generateSignature( options ) {
    const sortedKeys = Object.keys( options ).sort();
    const keyValuePairString = sortedKeys.map(( key ) => `${key}=${options[ key ]}` ).join( '&' );
    const digest = sha1( `${keyValuePairString}${REACT_APP_CLOUDINARY_API_SECRET}` )

    return digest;
}

/**
 * Compresses an image to desired size
 * if `image` is less than desired size, it returns the original image
 *
 * @param {File} image
 * @param {number} size - Size in bytes
 * @returns {File}
 */
export async function compressImage( image, size = 2097152 ) {
    // Image less than given size
    if ( image.size < size ) return image;

    const options = {
        maxSizeMB: 2
    }
    const compressed = await imageCompression( image, options );
    return compressed;
}
