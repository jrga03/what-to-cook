import React, { useState } from 'react';
import { Switch, Link, Route } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Categories from '../Categories';
import ComingSoon from '../ComingSoon';

import Wrapper from './styles';

/**
 * Dashboard
 */
function Dashboard() {
    const [ activeTab, setActiveTab ] = useState( 0 );

    /**
     * Handler for tab change
     * @param {*} event - onChange event
     * @param {number} newValue - Index of the tab
     */
    function onChange( event, newValue ) {
        setActiveTab( newValue );
    }

    return (
        <Wrapper>
            <Paper square elevation={ 2 }>
                <Tabs
                    value={ activeTab }
                    onChange={ onChange }
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                >
                    <Tab
                        label="Categories"
                        component={ Link }
                        to="/categories"
                        replace
                    />
                    <Tab
                        label="Ingredients"
                        component={ Link }
                        to="/ingredients"
                        replace
                    />
                </Tabs>
            </Paper>
            <Switch>
                <Route path="/categories" component={ Categories } />
                <Route path="/ingredients" component={ ComingSoon } />
            </Switch>
        </Wrapper>
    );
}

export default Dashboard;
