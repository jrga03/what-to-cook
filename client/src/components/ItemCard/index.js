import React from 'react';
import PropTypes from 'prop-types';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Zoom from '@material-ui/core/Zoom';

import {
    StyledCard,
    StyledCheckCircle
} from './styles';

/**
 * Typography types for label
 */
const labelTypes = {
    component: {
        1: 'h4',
        2: 'h5',
        3: 'span'
    },
    variant: {
        1: 'h4',
        2: 'h5',
        3: 'caption'
    }
};

/**
 * ItemCard component
 */
function ItemCard({ gridColumns, width, image, imageTitle, label, onClick, selected }) {
    return (
        <StyledCard square width={ width }>
            <CardMedia
                image={ image }
                title={ imageTitle }
                style={{
                    backgroundImage: `
                        linear-gradient(
                            to bottom,
                            rgba(0, 0, 0, 0),
                            rgba(0, 0, 0, 0.3)
                        ),
                        url(${image})
                    `
                }}
            >
                <CardActionArea onClick={ onClick }>
                    <CardContent>
                        <Typography component={ labelTypes.component[ gridColumns ] } variant={ labelTypes.variant[ gridColumns ] }>
                            { label }
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </CardMedia>
            <Zoom in={ selected }>
                <StyledCheckCircle color="action" />
            </Zoom>
        </StyledCard>
    );
}

ItemCard.propTypes = {
    gridColumns: PropTypes.number,
    width: PropTypes.number,
    image: PropTypes.string.isRequired,
    imageTitle: PropTypes.string,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    selected: PropTypes.bool
}

ItemCard.defaultProps = {
    gridColumns: 1,
    width: 0,
    imageTitle: '',
    selected: false
}

export default ItemCard;
