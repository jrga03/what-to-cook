import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

import {
    StyledCardWrapper,
    StyledCard,
    StyledCardMedia,
    StyledCardContent
} from './styles';

function RecipeCard({ style, name, photo, description }) {
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
                        <Typography className="recipe-name" component="h6" variant="h6" gutterBottom>
                            { name }
                        </Typography>

                        <Typography component="span" variant="caption" color="textSecondary">
                            { description }
                        </Typography>

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
