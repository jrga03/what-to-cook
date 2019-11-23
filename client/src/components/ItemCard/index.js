import React from 'react';
import PropTypes from 'prop-types';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Zoom from '@material-ui/core/Zoom';

import { StyledCard, StyledCardMedia, StyledCheckCircle } from './styles';

/**
 * ItemCard component
 */
function ItemCard({ image, imageTitle, label, onClick, selected }) {
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
            <Zoom in={ selected }>
                <StyledCheckCircle color="action" />
            </Zoom>
        </StyledCard>
    );
}

ItemCard.propTypes = {
    image: PropTypes.string.isRequired,
    imageTitle: PropTypes.string,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    selected: PropTypes.bool
}

ItemCard.defaultProps = {
    imageTitle: '',
    selected: false
}

export default ItemCard;
