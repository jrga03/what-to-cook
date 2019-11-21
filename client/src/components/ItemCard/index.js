import React from 'react';
import PropTypes from 'prop-types';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import { StyledCard, StyledCardMedia } from './styles';

/**
 * ItemCard component
 */
function ItemCard({ image, imageTitle, label, onClick }) {
    return (
        <StyledCard square>
            <CardActionArea onClick={ onClick }>
                <CardContent>
                    <StyledCardMedia
                        image={ image }
                        title={ imageTitle }
                    />
                    <Typography component="h6" variant="caption">
                        { label }
                    </Typography>
                </CardContent>
            </CardActionArea>
        </StyledCard>
    );
}

ItemCard.propTypes = {
    image: PropTypes.string.isRequired,
    imageTitle: PropTypes.string,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
}

ItemCard.defaultProps = {
    imageTitle: ''
}

export default ItemCard;
