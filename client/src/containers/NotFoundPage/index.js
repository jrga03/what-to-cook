import React from 'react';
import Typography from '@material-ui/core/Typography';

import { Wrapper } from 'containers/App'; // eslint-disable-line

/**
 * Not Found Page
 */
export default function NotFoundPage() {
    return (
        <Wrapper>
            <Typography variant="h4">
                Page Not Found
            </Typography>
        </Wrapper>
    );
}