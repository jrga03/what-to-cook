import React from 'react';
import Typography from '@material-ui/core/Typography';

import { LoaderWrapper } from 'containers/App'; // eslint-disable-line

/**
 * Coming Soon page
 */
export default function ComingSoonPage() {
    return (
        <LoaderWrapper>
            <Typography variant="h4">
                Coming soon!
            </Typography>
        </LoaderWrapper>
    );
}