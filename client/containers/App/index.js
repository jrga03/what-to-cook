import React, { PureComponent } from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router';

import NotFoundPage from '../NotFoundPage';
import Dashboard from '../Dashboard';

/* eslint-disable-next-line react/prefer-stateless-function */
export default class App extends PureComponent {
    render() {
        return (
            <div>
                <Helmet>
                    <title>What To Cook?</title>
                    <meta name="description" content="helps decide on what to cook" />
                </Helmet>
                <Switch>
                    <Route exact path="/" component={ Dashboard } />
                    <Route component={ NotFoundPage } />
                </Switch>
            </div>
        );
    }
}