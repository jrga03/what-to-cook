import styled from 'styled-components';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CheckCircle from '@material-ui/icons/CheckCircle';

export const StyledCard = styled( Card )`
&& {
    position: relative;

    .MuiCardContent-root {
        padding: 8px 16px;
    }
}
`;

export const StyledCardMedia = styled( CardMedia )`
&& {
    height: calc( 50vw - 60px );
}
`;

export const StyledCheckCircle = styled( CheckCircle )`
    position: absolute;
    top: 4px;
    right: 4px;
    fill: #ffffff;
`;
