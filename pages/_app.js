require('./global-style.css')
import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import { Provider } from 'react-redux';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';

import store from '../redux/store';
import * as keys from '../config/keys';
import Layout from '../components/main/layout'

// Create a theme instance for material ui
export const theme = createMuiTheme({
    palette: {
        primary: {
            main: keys.APP_COLOR,
        },
        secondary: {
            main: keys.APP_COLOR_LIGHT,
        },
        error: {
            main: red.A400,
        },
        background: {
            default: keys.APP_COLOR_GRAY_LIGHT,
        }
    },
    typography: {
        htmlFontSize: 15,
    },
     shadows: ["none"]
});


const noAuth = [    
    '/',    
    '/settings/privacy-policy',
    '/settings/terms-of-service',
    '/authentication/validate-email',
    '/authentication/pw-recovery',
    '/authentication/change-pw'
]

//_app file overrides Next.js App file.
// Next.js uses an App component to pass down classes to the other files in your app. This saves us from having to add imports to each file
function Krop(props) {
    const { Component, pageProps, router } = props;
    
    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);
    
    // const { Component, pageProps, router } = this.props;        
    return (
        // React.Fragment lets you add extra children without adding a node to the DOM
        <React.Fragment>
            <Head>
                <title>{keys.APP_NAME}</title>  
            </Head>
            {/* Wrapping the app with Redux Provider lets components further down the tree access the Redux */}                    
            <Provider store={store}>                                            
                <MuiThemeProvider theme={theme}>
                    {(noAuth.includes(router.route)) ? (
                        <Component {...pageProps} />
                    ) : (
                        //topbar and navigation rendered on every page inside the app except for the landing page
                        <Layout 
                            route={router.route}
                            Component={() => { return (<Component {...pageProps}/>) }}
                        />
                    )}
                </MuiThemeProvider>
            </Provider>                
        </React.Fragment>            
    );
}

export default Krop;