import PropTypes from 'prop-types';
import { Card, Icon, Grid } from 'semantic-ui-react';

export default props => {
  const {
    label, value, extra, iconName, iconColor,
  } = props;

  return (
    <Card raised style={{ maxWidth: '260px' }}>
      <Card.Content>
        <Card.Description>
          <Grid columns={2} verticalAlign="middle">
            <Grid.Row>
              <Grid.Column>
                <Icon name={iconName} size="big" circular inverted color={iconColor} />
              </Grid.Column>
              <Grid.Column style={{ textAlign: 'right', lineHeight: '1.2' }}>
                <Grid.Row>
                  <div style={{ fontSize: '1.3rem' }}>{label}</div>
                </Grid.Row>
                <Grid.Row>
                  <div style={{ fontWeight: '500', fontSize: '2.5rem' }}>{value}</div>
                </Grid.Row>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Card.Description>
      </Card.Content>
      <Card.Content extra style={{ margin: '0 15px' }}>
        {extra}
      </Card.Content>
    </Card>
  );
};
