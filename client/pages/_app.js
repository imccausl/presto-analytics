import '../static/custom-semantic-ui/semantic.min.css';
// import '../static/fontawesome-free-5.8.2-web/css/all.css';
// import 'nprogress/nprogress.css';

import React from 'react';
import App, { Container } from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';

import Page from '../components/Page';

NProgress.configure({ showSpinner: false });

Router.onRouteChangeStart = () => {
  NProgress.start();
};

Router.onRouteChangeComplete = () => {
  NProgress.done();
};
Router.onRouteChangeError = () => {
  NProgress.done();
};

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
      <Container>
        <Component {...pageProps} />
      </Container>
    );
  }
}
