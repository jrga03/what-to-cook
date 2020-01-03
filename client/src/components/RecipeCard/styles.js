import styled from 'styled-components';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';

export const StyledCardWrapper = styled.div`
    .link {
        text-decoration: none;
    }
`;

export const StyledCard = styled( Card )`
    display: flex;
    height: 100%;
`;

export const StyledCardMedia = styled( CardMedia )`
    width: 35%;
`;

export const StyledCardContent = styled( CardContent )`
    width: 65%;

    .recipe-name {
        line-height: 1;
        font-size: 1rem;
    }
`;