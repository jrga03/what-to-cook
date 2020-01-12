import React from 'react';
import Typography from '@material-ui/core/Typography';

import { LoaderWrapper } from 'containers/App'; // eslint-disable-line

/**
 * Not Found Page
 */
export default function NotFoundPage() {
    return (
        <LoaderWrapper>
            <Typography variant="h4">
                Page Not Found
            </Typography>
        </LoaderWrapper>
    );
}