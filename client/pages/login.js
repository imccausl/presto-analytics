import Login from '../components/Login';
import Page from '../components/Page';

export default () => (
  <Page loginRequired={false}>
    <Login />
  </Page>
);
