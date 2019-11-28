import React, { useCallback } from 'react';
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
    onClickItem
}) {
    const cardWidth = 85 / cols;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const handleOnClickItem = ( id, index ) => useCallback(() => {
        onClickItem( id, index );
    }, [ id, index ]);

    return (
        <StyledGridList cols={ cols } cellHeight={ cellHeight } spacing={ spacing }>
            { data.map(({ id, label, image, imageTitle, selected }, index ) => (
                <GridListTile key={ id }>
                    <ItemCard
                        label={ label }
                        image={ image }
                        imageTitle={ imageTitle }
                        onClick={ handleOnClickItem( id, index ) }
                        width={ cardWidth }
                        selected={ Boolean( selected ) }
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
    onClickItem: PropTypes.func
}

ItemCardList.defaultProps = {
    cellHeight: 'auto',
    spacing: 4,
    onClickItem: () => { }
}

export default ItemCardList;
