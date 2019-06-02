import moment from "moment";
import React from "react";
import Fetch from "react-fetch-component";
import PropTypes from "prop-types";
import { Menu, Modal, Button, Icon } from "semantic-ui-react";
import { YearInput, MonthInput } from "semantic-ui-calendar-react";

import API from "../../../lib/api";
import CardMenu from "../CardMenu";

const propTypes = {};

const defaultProps = {};

// TODO: move to default props
const options = [
  { name: "last 30 days", value: "30" },
  { name: "last 60 days", value: "60" },
  { name: "last year", value: "365" },
  { name: "all time", value: "all_time" }
];

const thisMonth = new Date().getMonth();
const thisYear = new Date().getFullYear();

export default class DataFilter extends React.Component {
  cardsArray =
    this.props.cards && this.props.cards.map(card => card.cardNumber);

  state = {
    activeSelection: options[0].name,
    activeSelectionValue: options[0].value,
    selectedCard: "all",
    modalOpen: false,
    selectedMonth: thisMonth,
    selectedYear: thisYear,
    url: `${API.root}${API.monthlyTransactions(2019, 4)}`
  };

  optionsMap = {
    [options[0].name]: options[0].value,
    [options[1].name]: options[1].value,
    [options[2].name]: options[2].value
  };

  componentDidMount() {
    const { selectedCard } = this.state;

    this.setState({
      url: `${API.root}${API.transactionRange(selectedCard, options[0].value)}`
    });
  }

  handleItemClick = event => {
    const { selectedCard } = this.state;

    const activeSelection = event.target.textContent.toLowerCase();
    const activeSelectionValue = this.optionsMap[activeSelection];
    const url = `${API.root}${API.transactionRange(
      this.state.selectedCard,
      activeSelectionValue
    )}`;
    this.setState({
      activeSelection,
      activeSelectionValue,
      url
    });
  };

  handleCalChange = (event, { name, value }) => {
    this.setState({ [name]: value });
  };

  FilterMenu = () => {
    const { activeSelection } = this.state;

    const fullMenu = options.map(option => (
      <Menu.Item
        key={option.value}
        name={option.name}
        active={activeSelection === option.name}
        onClick={this.handleItemClick}
      />
    ));

    return fullMenu;
  };

  render() {
    const {
      selectedCard,
      activeSelectionValue,
      modalOpen,
      selectedYear,
      selectedMonth,
      url,
      activeSelection
    } = this.state;

    const { children } = this.props;

    return (
      <Fetch url={url} options={API.send("GET")}>
        {({ fetch, data, error, loading }) => (
          <>
            <Menu size="large" pointing>
              <CardMenu
                cards={this.cardsArray}
                currentSelection={selectedCard}
                handleChange={value => {
                  let url = `${API.root}${API.transactionRange(
                    value,
                    activeSelectionValue
                  )}`;

                  if (activeSelection === "month") {
                    url = `${API.root}${API.monthlyTransactions(
                      value,
                      selectedYear || thisYear,
                      selectedMonth
                    )}`;
                  }

                  this.setState({
                    selectedCard: value,
                    url
                  });
                }}
              />
              <this.FilterMenu />
              <Menu.Item
                name="month"
                active={activeSelection === "month"}
                onClick={() => {
                  this.setState({ activeSelection: "month", modalOpen: true });
                }}>
                <Icon name="calendar" />
              </Menu.Item>
            </Menu>

            {children({ data, error, loading })}

            <Modal size="tiny" open={modalOpen} onClose={this.close}>
              <Modal.Header>Choose Another Date</Modal.Header>
              <Modal.Content>
                <MonthInput
                  inline
                  closable
                  dateFormat="M"
                  name="selectedMonth"
                  maxDate={selectedYear == thisYear ? thisMonth + 1 : 12}
                  value={selectedMonth || thisMonth + 1}
                  onChange={this.handleCalChange}
                />
                <YearInput
                  inline
                  name="selectedYear"
                  closable
                  dateFormat="YYYY"
                  maxDate={thisYear}
                  minDate={2018}
                  value={selectedYear || thisYear}
                  onChange={this.handleCalChange}
                />
              </Modal.Content>
              <Modal.Actions>
                <Button
                  negative
                  onclick={() => this.setState({ modalOpen: false })}>
                  No
                </Button>
                <Button
                  positive
                  icon="checkmark"
                  labelPosition="right"
                  content="Yes"
                  onClick={() => {
                    this.setState({
                      url: `${API.root}${API.monthlyTransactions(
                        selectedCard,
                        selectedYear || thisYear,
                        selectedMonth
                      )}`,
                      modalOpen: false
                    });
                    fetch();
                  }}
                />
              </Modal.Actions>
            </Modal>
          </>
        )}
      </Fetch>
    );
  }
}

DataFilter.propTypes = propTypes;
DataFilter.defaultProps = defaultProps;
