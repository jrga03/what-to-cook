import styled from 'styled-components';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';

export const StyledCard = styled( Card )`
&& {
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
