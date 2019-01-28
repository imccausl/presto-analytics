import Dashboard from '../components/Dashboard';
import Page, { UserContext } from '../components/Page';

export default props => (
  <Page loginRequired>
    <UserContext.Consumer>{data => <Dashboard props={data} />}</UserContext.Consumer>
  </Page>
);
