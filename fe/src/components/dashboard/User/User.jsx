import React from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { Header, Menu, Icon } from "semantic-ui-react";

import AccountSettings from "../../AccountSettings";
import requestApi from "../../../lib/requestApi";
import SmallStatistic from "../../styled/SmallStatistic";
import UpdatePresto from "../../dashboard/UpdatePresto";

const propTypes = {};
const defaultProps = {};

class User extends React.Component {
  state = {
    activeSelection: "this month",
    accountModalOpen: false,
    prestoModalOpen: false
  };

  handleItemClick = async (e, { name }) => {
    if (name === "update") {
      this.setState({ prestoModalOpen: true });
    }

    if (name === "logout") {
      await requestApi.logout();
      this.props.history.push("/login");
    }

    if (name === "settings") {
      this.setState({ accountModalOpen: true });
    }
  };

  handleAccountModalClose = () => {
    this.setState({ accountModalOpen: false });
  };

  handlePrestoModalClose = () => {
    this.setState({ prestoModalOpen: false });
  };

  render() {
    const {
      firstName,
      lastName,
      cards,
      balance,
      budget,
      lastActivity,
      amount,
      since
    } = this.props;
    const { activeItem, accountModalOpen, prestoModalOpen } = this.state;

    return (
      <div style={{ background: "white" }}>
        <Menu icon secondary borderless>
          <Menu.Item header>
            {/* <Icon name="user circle outline" size="large" />{" "}
            {`  ${firstName} ${lastName}`} */}
          </Menu.Item>

          <Menu.Menu position="right">
            <Menu.Item name="update" onClick={this.handleItemClick}>
              <Icon name="refresh" size="large" />
            </Menu.Item>

            <Menu.Item name="settings" onClick={this.handleItemClick}>
              <Icon name="setting" size="large" />
            </Menu.Item>

            <Menu.Item name="logout" onClick={this.handleItemClick}>
              <Icon name="log out" size="large" />
            </Menu.Item>
          </Menu.Menu>
        </Menu>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%"
          }}>
          <SmallStatistic
            header="Balance"
            body={`$${(Math.round(balance * 100) / 100).toFixed(2)}`}
            footer={`over ${cards.length} card${cards.length !== 1 ? "s" : ""}`}
          />
          <SmallStatistic
            header="Spent"
            body={`$${Math.round(amount / 100)}`}
            footer={`since ${moment(since).format("MMM YYYY")}`}
          />
          <SmallStatistic
            header="Last Charge"
            body={`$${parseFloat(lastActivity.amount / 100).toFixed(2)}`}
            footer={`${moment(lastActivity.date).fromNow()}`}
          />
          <SmallStatistic
            header="Location"
            body={lastActivity.location}
            footer={`${moment(lastActivity.date).fromNow()}`}
          />
          <SmallStatistic
            header="Updated"
            body={moment(lastActivity.updated_at).fromNow()}
          />
        </div>

        <UpdatePresto
          open={prestoModalOpen}
          close={this.handlePrestoModalClose}
        />
        <AccountSettings
          open={accountModalOpen}
          user={this.props}
          budget={budget || {}}
          close={this.handleAccountModalClose}
        />
      </div>
    );
  }
}

User.propTypes = propTypes;
User.defaultProps = defaultProps;

export default withRouter(User);
