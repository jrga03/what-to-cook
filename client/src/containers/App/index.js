import React from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router';
import styled from 'styled-components';

import NotFoundPage from 'containers/NotFoundPage';
import Header from 'containers/Header';
import Dashboard from 'containers/Dashboard';

const Container = styled.div`
    display: flex;
    justify-content: center;

    @media screen and (min-width: 600px) {
        padding-top: 64px;
    }

    padding-top: 56px;;
`;

/**
 * App componnent
 */
function App () {
    return (
        <Container>
            <Helmet>
                <title>What To Cook?</title>
                <meta name="description" content="helps decide on what to cook" />
            </Helmet>
            <Header />
            <Switch>
                <Route exact path="/" component={ Dashboard } />
                <Route component={ NotFoundPage } />
            </Switch>
        </Container>
    );
}

export default App;
