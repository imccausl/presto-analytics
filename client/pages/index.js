import Router from 'next/router';

import Page from '../components/Page';

const Index = (props) => {
  console.log(props);
  return <Page loginRequired={false} />;
};

export default Index;
