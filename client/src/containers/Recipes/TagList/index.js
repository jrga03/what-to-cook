import React from 'react';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';
import startCase from 'lodash/startCase';

import { toHSL } from '../../../utils/stringToColor';

import TagsWrapper from './styles';

/**
 * TagList component
 */
function TagList({ tags, selectedTags, onClickTag }) {
    return (
        <TagsWrapper>
            { tags.map(( tag ) => (
                <Chip
                    key={ tag.id }
                    style={{
                        backgroundColor: selectedTags.has( tag.id )
                            ? toHSL( tag.id )
                            : '#d2d2d2'
                    }}
                    label={ startCase( tag.name ) }
                    clickable
                    onClick={ onClickTag( tag ) }
                />
            )) }
        </TagsWrapper>
    );
}

TagList.propTypes = {
    tags: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string
        })
    ).isRequired,
    selectedTags: PropTypes.any.isRequired, // `Set` (not yet available in prop-types)
    onClickTag: PropTypes.func.isRequired
}

export default TagList;