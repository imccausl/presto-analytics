import { Input, Button } from 'semantic-ui-react';
import Fetch from 'react-fetch-component';

export default () => (
  <div>
    <div>
      <Input label="Email" placeholder="Email address" />
    </div>
    <div>
      <Input label="Password" type="password" placeholder="Password" />
    </div>
    <Button content="Login" primary />
    <Fetch
      url="http://localhost:3333/api/v1"
      options={{
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'gee@test.com', password: 'dfefd' }),
      }}
      as="json"
    >
      {({ loading, data, error }) => <div />}
    </Fetch>
  </div>
);
