import React, { Component } from 'react';
import Router from 'next/router';
import PropTypes from 'prop-types';

let globalUser = null;

function withAuth(BaseComponent, { loginRequired = true, logoutRequired = false } = {}) {
  class App extends Component {
    static propTypes = {
      user: PropTypes.shape({
        id: PropTypes.number,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        email: PropTypes.string,
        cardNumber: PropTypes.string,
        balance: PropTypes.string,
        permisson: PropTypes.array,
      }),
    };

    static defaultProps = {
      user: null,
    };

    componentDidMount() {
      const { user, isFromServer } = this.props;

      if (isFromServer) {
        globalUser = user;
      }

      if (loginRequired && !logoutRequired && !user) {
        Router.push('/login');
      }
    }

    static async getInitialProps(ctx) {
      const isFromServer = !!ctx.req;
      const user = ctx.req ? ctx.req.user && ctx.req.user.toObject() : globalUser;
      const props = { user, isFromServer };

      console.log(ctx);

      if (BaseComponent.getInitialProps) {
        Object.assign(props, (await BaseComponent.getInitialProps(ctx)) || {});
      }

      return props;
    }

    render() {
      const { user } = this.props;
      console.log(this.props);
      if (loginRequired && !logoutRequired && !user) {
        return null;
      }

      return <BaseComponent {...this.props} />;
    }
  }

  return App;
}

export default withAuth;
