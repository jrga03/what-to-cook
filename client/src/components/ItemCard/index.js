import React from 'react';
import PropTypes from 'prop-types';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Zoom from '@material-ui/core/Zoom';

import {
    StyledCard,
    CardMediaWrapper,
    StyledCheckCircle
} from './styles';

/**
 * ItemCard component
 */
function ItemCard({ width, image, imageTitle, label, onClick, selected }) {
    return (
        <StyledCard square width={ width }>
            <CardActionArea onClick={ onClick }>
                <CardContent>
                    <CardMediaWrapper>
                        <CardMedia
                            image={ image }
                            title={ imageTitle }
                        />
                    </CardMediaWrapper>
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
    width: PropTypes.number,
    image: PropTypes.string.isRequired,
    imageTitle: PropTypes.string,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    selected: PropTypes.bool
}

ItemCard.defaultProps = {
    width: 0,
    imageTitle: '',
    selected: false
}

export default ItemCard;
