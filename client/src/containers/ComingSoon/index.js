import React from 'react';
import Typography from '@material-ui/core/Typography';

import { Wrapper } from 'containers/App'; // eslint-disable-line

/**
 * Coming Soon page
 */
export default function ComingSoonPage() {
    return (
        <Wrapper>
            <Typography variant="h4">
                Coming soon!
            </Typography>
        </Wrapper>
    );
}