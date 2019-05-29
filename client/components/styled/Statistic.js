import PropTypes from 'prop-types';
import { Card, Icon, Grid } from 'semantic-ui-react';

export default props => {
  const {
    label, value, extra, iconName, iconColor, isFontAwesome,
  } = props;

  return (
    <Card
      style={{
        flex: '1',
        minWidth: '230px',
        maxWidth: '250px',
      }}
    >
      <Card.Content style={{ paddingLeft: '20px', paddingRight: '20px' }}>
        <Card.Description>
          <Grid columns={1} verticalAlign="middle">
            <Grid.Row verticalAlign="center" columns={2}>
              <Grid.Column style={{ alignItems: 'flex-end' }}>
                {isFontAwesome ? (
                  <i style={{ color: iconColor }} className={iconName} />
                ) : (
                  <Icon className={iconName} size="huge" color={iconColor} />
                )}
              </Grid.Column>
              <Grid.Column style={{ textAlign: 'right', lineHeight: '1.2' }}>
                <Grid.Row>
                  <div style={{ fontSize: '1rem', fontWeight: '300' }}>{label}</div>
                </Grid.Row>
                <Grid.Row>
                  <div style={{ fontWeight: '600', fontSize: '2rem' }}>{value}</div>
                </Grid.Row>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Card.Description>
      </Card.Content>
      <Card.Content extra style={{ margin: '0 15px', paddingLeft: '0', fontWeight: '200' }}>
        {extra}
      </Card.Content>
    </Card>
  );
};
