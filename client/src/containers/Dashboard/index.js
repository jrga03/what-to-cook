import React, { useState } from 'react';
// import { useHistory } from 'react-router-dom';
import SwipeableViews from 'react-swipeable-views';
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
    // const history = useHistory();
    const [ activeTab, setActiveTab ] = useState( 0 );

    /**
     * Handler for tab change
     * @param {*} event - onChange event
     * @param {number} newValue - Index of the tab
     */
    function onChange( event, newValue ) {
        setActiveTab( newValue );
    }

    /**
     * Handler for swipe
     * @param {number} index - Index of the tab
     */
    function onChangeIndex( index ) {
        setActiveTab( index );
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
                    <Tab label="Categories" />
                    <Tab label="Ingredients" />
                </Tabs>
            </Paper>
            <SwipeableViews index={ activeTab } onChangeIndex={ onChangeIndex }>
                <Categories />
                <ComingSoon />
            </SwipeableViews>
        </Wrapper>
    );
}

export default Dashboard;
