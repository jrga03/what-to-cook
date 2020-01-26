import React from 'react';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import startCase from 'lodash/startCase';

import { toHSL } from '../../../utils/stringToColor';

import { Wrapper, ChipsWrapper } from './styles';

/**
 * ChipList component
 */
function ChipList({ type, items, selectedTags, onClickTag }) {
    const ingredientsType = type === 'ingredients';
    const tagsType = type === 'tags';

    function handleOnClick( item ) {
        if ( tagsType ) {
            return onClickTag( item )
        }
    }

    return (
        <Wrapper>
            { ingredientsType && (
                <>
                    <Divider light />
                    <Typography
                        gutterBottom
                        variant="caption"
                    >
                        Searched Ingredients
                    </Typography>
                </>
            ) }
            <ChipsWrapper>
                { items.map(( item ) => (
                    <Chip
                        key={ item.id }
                        style={{
                            backgroundColor: ( ingredientsType || selectedTags.has( item.id ))
                                ? toHSL( item.id )
                                : '#d2d2d2'
                        }}
                        label={ startCase( item.name ) }
                        clickable={ tagsType }
                        onClick={ handleOnClick( item ) }
                    />
                )) }
            </ChipsWrapper>
        </Wrapper>
    );
}

ChipList.propTypes = {
    type: PropTypes.oneOf([ 'tags', 'ingredients' ]),
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string
        })
    ).isRequired,
    selectedTags: PropTypes.any, // `Set` (not yet available in prop-types)
    onClickTag: PropTypes.func
};

ChipList.defaultProps = {
    type: 'tags',
    selectedTags: new Set([]),
    onClickTag() {}
};

export default ChipList;
