import React from 'react';
import { useHistory } from 'react-router-dom';
import Fade from '@material-ui/core/Fade';

import ItemCardList from '../../components/ItemCardList';

import Wrapper from './styles';
import CATEGORIES from './constants';

/**
 * Categories
 */
function Categories() {
    const history = useHistory();
    const navigate = ( key ) => history.push( `/categories/${key}` );

    return (
        <Wrapper>
            <Fade in>
                <ItemCardList
                    cols={ 2 }
                    cellHeight="auto"
                    spacing={ 4 }
                    data={ CATEGORIES }
                    onClickItem={ navigate }
                />
            </Fade>
        </Wrapper>
    );
}

export default Categories;
