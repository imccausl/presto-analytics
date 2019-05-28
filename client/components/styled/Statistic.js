import PropTypes from 'prop-types';
import { Card, Icon, Grid } from 'semantic-ui-react';

export default props => {
  const {
    label, value, extra, iconName, iconColor, isFontAwesome,
  } = props;

  return (
    <Card
      style={{
        border: 'none',
        boxShadow: '0 2px 2px hsla(38,16%,76%,.5)',
        borderRadius: '6px',
        flex: '1',
        minWidth: '258px',
      }}
    >
      <Card.Content style={{ paddingLeft: '20px', paddingRight: '20px' }}>
        <Card.Description>
          <Grid columns={2} verticalAlign="middle">
            <Grid.Row>
              <Grid.Column>
                {isFontAwesome ? (
                  <i style={{ color: iconColor }} className={iconName} />
                ) : (
                  <Icon className={iconName} size="huge" color={iconColor} />
                )}
              </Grid.Column>
              <Grid.Column style={{ textAlign: 'right', lineHeight: '1.2' }}>
                <Grid.Row>
                  <div style={{ fontSize: '1.2rem', fontWeight: '300' }}>{label}</div>
                </Grid.Row>
                <Grid.Row>
                  <div style={{ fontWeight: '600', fontSize: '2.5rem' }}>{value}</div>
                </Grid.Row>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Card.Description>
      </Card.Content>
      <Card.Content extra style={{ margin: '0 15px', paddingLeft: '0' }}>
        {extra}
      </Card.Content>
    </Card>
  );
};
