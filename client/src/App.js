/* eslint-disable import/no-unresolved */
import React, { lazy, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';

const Loading = (
    <div
        style={{
            height: '100vh',
            fontSize: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}
    >
        Loading...
    </div>
);
const App = lazy(() => import( 'containers/App' ));

/**
 * Root
 */
function Root() {
    return (
        <Suspense fallback={ Loading }>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Suspense>
    );
}

export default Root;
