import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import startCase from 'lodash/startCase';
import Favorite from '@material-ui/icons/Favorite';

import { toHSL } from '../../utils/stringToColor';
import { LIKE_FILL_COLOR } from '../../constants';

import {
    StyledCardWrapper,
    StyledCard,
    StyledCardMedia,
    StyledCardContent,
    TextWrapper,
    TagsWrapper
} from './styles';

function RecipeCard({ style, id, name, photo, description, tags, liked }) {
    const { pathname, search } = useLocation();

    return (
        <Link
            to={{
                pathname: `/recipe/${id}`,
                state: {
                    from: `${pathname}${search}`
                }
            }}
            className="link"
        >
            <StyledCardWrapper style={ style }>
                <StyledCard>
                    <StyledCardMedia
                        image={ photo }
                        title={ name }
                    >
                        { liked && <Favorite style={{ fill: LIKE_FILL_COLOR }} /> }
                    </StyledCardMedia>
                    <StyledCardContent>
                        <TextWrapper>
                            <Typography className="recipe-name" component="h6" variant="h6" gutterBottom color="textPrimary">
                                { name }
                            </Typography>

                            <Typography className="recipe-description" component="p" variant="caption" color="textSecondary">
                                { description }
                            </Typography>
                        </TextWrapper>

                        <TagsWrapper>
                            { tags.map(( tag ) => (
                                <Chip
                                    key={ tag.id }
                                    style={{ backgroundColor: toHSL( tag.id ) }}
                                    size="small"
                                    label={ startCase( tag.name ) }
                                />
                            )) }
                        </TagsWrapper>
                    </StyledCardContent>
                </StyledCard>
            </StyledCardWrapper>
        </Link>
    );
}

RecipeCard.propTypes = {
    style: PropTypes.object,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    photo: PropTypes.string.isRequired,
    description: PropTypes.string,
    liked: PropTypes.bool
}

RecipeCard.defaultProps = {
    style: {},
    description: '',
    liked: false
}

export default RecipeCard;
