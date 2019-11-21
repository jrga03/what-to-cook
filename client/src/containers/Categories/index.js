import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

import ItemCard from 'components/ItemCard'; // eslint-disable-line import/no-unresolved
import burger from 'images/burgers.jpg'; // eslint-disable-line import/no-unresolved

import Wrapper from './styles';
import CATEGORIES from './constants';

/**
 * Categories
 */
function Categories() {
    const history = useHistory();
    const navigate = ( key ) => useCallback(() => { // eslint-disable-line react-hooks/rules-of-hooks
        history.push( `/recipes/${key}` );
    }, [key]);

    return (
        <Wrapper>
            <GridList cols={ 2 } cellHeight="auto" spacing={ 4 }>
                { CATEGORIES.map(({ key, label }) => (
                    <GridListTile key={ key }>
                        <ItemCard
                            label={ label }
                            image={ burger } // TODO:
                            imageTitle="Burger" // TODO:
                            onClick={ navigate( key ) }
                        />
                    </GridListTile>
                )) }
            </GridList>
        </Wrapper>
    );
}

export default Categories;
