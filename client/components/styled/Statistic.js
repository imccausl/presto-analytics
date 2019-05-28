import PropTypes from 'prop-types';
import { Card, Icon, Grid } from 'semantic-ui-react';

export default props => {
  const {
    label, value, extra, iconName, iconColor,
  } = props;

  return (
    <Card
      style={{
        maxWidth: '260px',
        border: 'none',
        boxShadow: '0 2px 2px hsla(38,16%,76%,.5)',
        borderRadius: '6px',
      }}
    >
      <Card.Content style={{ paddingLeft: '20px', paddingRight: '20px' }}>
        <Card.Description>
          <Grid columns={2} verticalAlign="middle">
            <Grid.Row>
              <Grid.Column>
                <Icon name={iconName} size="huge" color={iconColor} />
              </Grid.Column>
              <Grid.Column style={{ textAlign: 'right', lineHeight: '1.2' }}>
                <Grid.Row>
                  <div style={{ fontSize: '1.2rem', fontWeight: '200' }}>{label}</div>
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
