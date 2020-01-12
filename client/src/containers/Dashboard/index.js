import React, { useState, useEffect } from 'react';
import { Switch, Link, Route, useLocation } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Categories from '../Categories';
import Ingredients from '../Ingredients';

import Wrapper from './styles';

/**
 * Dashboard
 */
function Dashboard() {
    const { pathname } = useLocation();
    const [ activeTab, setActiveTab ] = useState( Number( pathname === '/ingredients' ));

    useEffect(() => {
        setActiveTab( Number( pathname === '/ingredients' ));
    }, [pathname])

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
            <div className="content">
                <Switch>
                    <Route path="/categories" component={ Categories } />
                    <Route path="/ingredients" component={ Ingredients } />
                </Switch>
            </div>
        </Wrapper>
    );
}

export default Dashboard;
