import React, { Component } from "react";
import PropTypes from "prop-types";
import { Card, Icon, Grid } from "semantic-ui-react";

export default props => {
  const { header, body, footer } = props;

  return (
    <Grid columns={1} style={{ marginTop: "0" }}>
      <Grid.Row verticalAlign="center" columns={1}>
        <Grid.Column style={{ textAlign: "right", lineHeight: "1.2" }}>
          <Grid.Row>
            <div style={{ fontSize: "1rem", fontWeight: "300" }}>{header}</div>
          </Grid.Row>
          <Grid.Row>
            <div
              style={{ width: "100%", fontWeight: "600", fontSize: "1.3rem" }}>
              {body}
            </div>
          </Grid.Row>
          <Grid.Row>
            <div
              style={{
                fontSize: ".9rem",
                fontWeight: "200",
                color: "#ababab"
              }}>
              {footer}
            </div>
          </Grid.Row>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};
