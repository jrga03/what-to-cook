import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import App from 'containers/App';

/**
 * Root
 */
function Root() {
    return (
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
}

export default Root;
