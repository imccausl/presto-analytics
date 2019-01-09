import 'semantic-ui-css/semantic.min.css';

import React from 'react';
import App, { Container } from 'next/app';

import HeaderBar from '../components/styled/HeaderBar';

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
        <HeaderBar />
        <Component {...pageProps} />
      </Container>
    );
  }
}
