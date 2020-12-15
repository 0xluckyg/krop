// _document is only rendered on the server side and not on the client side
// Dom handlers and event handlers like document or onClick can't be added to this file

// ./pages/_document.js

import React from 'react';
import Document, { Head, Html, Main, NextScript } from 'next/document';

import { ServerStyleSheets } from '@material-ui/styles';

const noAuth = [
    '/',    
    '/settings/privacy-policy',
    '/settings/terms-of-service'
]

class UnderdogDocument extends Document {    
    
    renderHead() {
        return (
            //link files to load when user is on the landing page before signup
            <Head>
            	<meta charSet="UTF-8"/>
            	<meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
                <script src="https://kit.fontawesome.com/3b07425bbb.js"></script>
                <meta charSet="utf-8" />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap"
                />              
            	<link rel="icon" type="image/svg" sizes="32x32" href="../static/app/logo-small.svg"/>
            	<link rel="icon" type="image/svg" sizes="16x16" href="../static/app/logo-small.svg"/>

            	<meta name="msapplication-TileColor" content="#13a89e"/>
            	<meta name="theme-color" content="#13a89e"/>
            
            </Head>
        )
    }

    render() {
        return (
            <Html lang="en" dir="ltr">
                {this.renderHead()}
                <body style={{margin: 0}}>    
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

UnderdogDocument.getInitialProps = async ctx => {
    // Resolution order
    //
    // On the server:
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. document.getInitialProps
    // 4. app.render
    // 5. page.render
    // 6. document.render
    //
    // On the server with error:
    // 1. document.getInitialProps
    // 2. app.render
    // 3. page.render
    // 4. document.render
    //
    // On the client
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. app.render
    // 4. page.render

    // Render app and page and get the context of the page with collected side effects.
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: App => props => sheets.collect(<App {...props} />),
        });

    const initialProps = await Document.getInitialProps(ctx);

    return {
        ...initialProps,
        // Styles fragment is rendered after the app and page rendering finish.
        styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
    };
};

export default UnderdogDocument;