import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import startCase from 'lodash/startCase';

import { toHSL } from '../../utils/stringToColor';

import {
    StyledCardWrapper,
    StyledCard,
    StyledCardMedia,
    StyledCardContent,
    TextWrapper,
    TagsWrapper
} from './styles';

function RecipeCard({ style, id, name, photo, description, tags }) {
    return (
        <StyledCardWrapper style={ style }>
            <Link
                to={ `/recipe/${id}` }
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
            </Link>
        </StyledCardWrapper>
    );
}

RecipeCard.propTypes = {
    style: PropTypes.object,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    photo: PropTypes.string.isRequired,
    description: PropTypes.string
}

RecipeCard.defaultProps = {
    style: {},
    description: ''
}

export default RecipeCard;
