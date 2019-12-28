import styled from 'styled-components';

export const Wrapper = styled.div`
    width: 100%;

    .title {
        font-size: 12px;
        color: rgba( 0, 0, 0, 0.54 );
        font-weight: 600;
        letter-spacing: 0.00938em;
    }
`;

export const LineWrapper = styled.div`
    width: 100%;
    display: flex;
    align-items: flex-end;

    .input, .select {
        flex: 1;
        margin: 0 6px;
    }

    .select-placeholder {
        color: rgba( 0, 0, 0, 0.34 );
        font-size: 16px;
        letter-spacing: normal;
    }
`;
