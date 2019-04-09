import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';

import App from './containers/App';

const theme = createMuiTheme({
    palette: {
        primary: blue
    },
    typography: {
        useNextVariants: true
    }
});

/* eslint-disable-next-line react/prefer-stateless-function */
class Root extends PureComponent {
    render() {
        return (
            <BrowserRouter>
                <MuiThemeProvider theme={ theme }>
                    <App />
                </MuiThemeProvider>
            </BrowserRouter>
        );
    }
}

ReactDOM.render( <Root />, document.getElementById( 'app' ));

module.hot.accept();