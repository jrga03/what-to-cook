import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';

import { toHSL } from '../../utils/stringToColor';

import {
    StyledCardWrapper,
    StyledCard,
    StyledCardMedia,
    StyledCardContent,
    TextWrapper,
    TagsWrapper
} from './styles';

function RecipeCard({ style, name, photo, description, tags }) {
    return (
        <StyledCardWrapper style={ style }>
            <Link
                to="/recipes" // TODO:
                className="link"
            >
                <StyledCard>
                    <StyledCardMedia
                        image={ photo }
                        title={ name }
                    />
                    <StyledCardContent>
                        <TextWrapper>
                            <Typography className="recipe-name" component="h6" variant="h6" gutterBottom color="textPrimary">
                                { name }
                            </Typography>

                            <Typography className="recipe-description" component="p" variant="caption" color="textSecondary">
                                { description || 'A quick brown fox jumps over the lazy dog. A quick brown fox jumps over the lazy shit.' }
                            </Typography>
                        </TextWrapper>

                        <TagsWrapper>
                            { tags.map(( tag ) => (
                                <Chip
                                    key={ tag.id }
                                    style={{ backgroundColor: toHSL( tag.id ) }}
                                    size="small"
                                    label={ tag.name }
                                />
                            )) }
                        </TagsWrapper>
                    </StyledCardContent>
                </StyledCard>
            </Link>
        </StyledCardWrapper>
    );
}

RecipeCard.propTypes = {
    style: PropTypes.object,
    name: PropTypes.string.isRequired,
    photo: PropTypes.string.isRequired,
    description: PropTypes.string
}

RecipeCard.defaultProps = {
    style: {},
    description: ''
}

export default RecipeCard;
