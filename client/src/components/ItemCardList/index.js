import React from 'react';
import PropTypes from 'prop-types';
import GridListTile from '@material-ui/core/GridListTile';

import StyledGridList from './styles';

import ItemCard from '../ItemCard';

/**
 * ItemCardList
 */
function ItemCardList({
    cols,
    cellHeight,
    spacing,
    data,
    onClickItem,
    selectedIngredients
}) {
    const cardWidth = 85 / cols;

    function handleOnClickItem( id ) {
        return function() {
            onClickItem( id );
        }
    }

    return (
        <StyledGridList cols={ cols } cellHeight={ cellHeight } spacing={ spacing }>
            { data.map(({ id, label, image, imageTitle }) => (
                <GridListTile key={ id }>
                    <ItemCard
                        gridColumns={ cols }
                        label={ label }
                        image={ image }
                        imageTitle={ imageTitle }
                        onClick={ handleOnClickItem( id ) }
                        width={ cardWidth }
                        selected={ selectedIngredients.has( id ) }
                    />
                </GridListTile>
            )) }
        </StyledGridList>
    );
}

ItemCardList.propTypes = {
    cols: PropTypes.number.isRequired,
    cellHeight: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.oneOf(['auto'])
    ]),
    spacing: PropTypes.number,
    data: PropTypes.arrayOf( PropTypes.shape({
        id: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.symbol
        ]).isRequired,
        label: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        imageTitle: PropTypes.string,
        selected: PropTypes.bool
    })),
    onClickItem: PropTypes.func,
    selectedIngredients: PropTypes.any // `Set` (not yet available in prop-types)
}

ItemCardList.defaultProps = {
    cellHeight: 'auto',
    spacing: 4,
    onClickItem: () => { },
    selectedIngredients: new Set([])
}

export default ItemCardList;
