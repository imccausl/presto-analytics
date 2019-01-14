import 'semantic-ui-css/semantic.min.css';
import 'nprogress/nprogress.css';

import React from 'react';
import App, { Container } from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import { ThemeProvider } from 'styled-components';

import HeaderBar from '../components/styled/HeaderBar';
import Meta from '../components/Meta';

Router.onRouteChangeStart = () => {
  NProgress.start();
};

Router.onRouteChangeComplete = () => {
  NProgress.done();
};
Router.onRouteChangeError = () => {
  NProgress.done();
};

const theme = {};
export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Meta />
        <ThemeProvider theme={theme}>
          <Container>
            <HeaderBar />
            <Component {...pageProps} />
          </Container>
        </ThemeProvider>
      </>
    );
  }
}
