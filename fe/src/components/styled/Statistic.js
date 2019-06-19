import React, { Component } from "react";
import PropTypes from "prop-types";
import { Card, Icon, Grid } from "semantic-ui-react";

export default props => {
  const {
    label,
    value,
    extra,
    extraIcon,
    iconName,
    iconColor,
    isCustomIcon
  } = props;

  return (
    <Card
      style={{
        flex: "1",
        minWidth: "230px",
        maxWidth: "250px",
        //border: "none",
        borderRadius: "6px",
        zIndex: "0"
        //boxShadow: "0 2px 2px hsla(38,16%,76%,.5)"
      }}>
      <Card.Content style={{ paddingLeft: "20px", paddingRight: "20px" }}>
        <Card.Description>
          <Grid columns={1} verticalAlign="middle">
            <Grid.Row verticalAlign="center" columns={2}>
              <Grid.Column
                style={{
                  textAlign: "left",
                  paddingLeft: "1rem",
                  paddingRight: "0"
                }}>
                {isCustomIcon ? (
                  <i
                    style={{
                      color: iconColor,
                      fontSize: "4rem",
                      minHeight: "64px"
                    }}
                    className={iconName}
                  />
                ) : (
                  <Icon className={iconName} size="huge" color={iconColor} />
                )}
              </Grid.Column>
              <Grid.Column
                style={{
                  textAlign: "right",
                  lineHeight: "1.2",
                  paddingRight: "1rem",
                  paddingLeft: "0"
                }}>
                <Grid.Row>
                  <div style={{ fontSize: "1rem", fontWeight: "300" }}>
                    {label}
                  </div>
                </Grid.Row>
                <Grid.Row>
                  <div style={{ fontWeight: "600", fontSize: "2rem" }}>
                    {value}
                  </div>
                </Grid.Row>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Card.Description>
      </Card.Content>
      <Card.Content
        extra
        style={{
          margin: "0 15px",
          paddingLeft: "0",
          fontWeight: "200",
          fontSize: "0.8rem"
        }}>
        <i className={extraIcon} /> {extra}
      </Card.Content>
    </Card>
  );
};
