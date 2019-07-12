/* eslint-disable import/no-unresolved */
import React, { lazy, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';

const client = new ApolloClient({
    uri: "/graphql"
});

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
                <ApolloProvider client={ client }>
                    <ApolloHooksProvider client={ client }>
                        <App />
                    </ApolloHooksProvider>
                </ApolloProvider>
            </BrowserRouter>
        </Suspense>
    );
}

export default Root;
