import React from "react";
import Fetch from "react-fetch-component";
import PropTypes from "prop-types";
import { Menu, Modal, Button, Icon, Header } from "semantic-ui-react";
import { YearInput, MonthInput } from "semantic-ui-calendar-react";

import API from "../../../lib/api";
import CardMenu from "../CardMenu";

const SEARCH_TYPE_RANGE = "range";
const SEARCH_TYPE_MONTH = "month";
const RANGE_LIMIT = 500;

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
    yearOrRange: options[0].value,
    monthOrUnit: "days",
    searchType: "range",
    selectedCard: "all",
    modalOpen: false,
    selectedMonth: thisMonth,
    selectedYear: thisYear,
    url: ""
  };

  optionsMap = {
    [options[0].name]: options[0].value,
    [options[1].name]: options[1].value,
    [options[2].name]: options[2].value
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { cardNumber, yearOrRange, monthOrUnit, searchType } = nextProps;

    // data validation:
    console.log(
      "getderivedstatefromprops:",
      cardNumber,
      yearOrRange,
      monthOrUnit,
      searchType
    );

    // if (!this.cardsArray.includes(cardNumber) || cardNumber != "all") {
    //   console.log(cardNumber, "************* ERR", nextProps.cards);
    //   // TODO: error about invalid card number
    //   return null;
    // }

    if (searchType === "err") {
      // TODO: return error about invalid searchType
      return null;
    }

    if (
      (searchType === SEARCH_TYPE_RANGE &&
        parseInt(yearOrRange, 10) > RANGE_LIMIT) ||
      (searchType === SEARCH_TYPE_RANGE && parseInt(yearOrRange, 10) < 5)
    ) {
      // TODO: return error about range too high
      return null;
    }

    if (searchType === SEARCH_TYPE_MONTH) {
      if (
        parseInt(yearOrRange, 10) > thisYear ||
        (parseInt(yearOrRange, 10) === thisYear &&
          parseInt(monthOrUnit, 10) > thisMonth)
      ) {
        // TODO: return error message about date being in the future
        return null;
      }

      if (
        parseInt(yearOrRange, 10) < 2010 ||
        (parseInt(yearOrRange, 10) < 2010 && parseInt(monthOrUnit, 10) < 5)
      ) {
        // TODO: return error message about date out of range: Presto phase 2 started May 5th, 2010.
        return null;
      }

      if (parseInt(monthOrUnit) > 12 || parseInt(monthOrUnit) < 1) {
        // TODO: month value out of range
        return null;
      }
    }

    return cardNumber === prevState.cardNumber &&
      yearOrRange === prevState.yearOrRange &&
      monthOrUnit === prevState.monthOrUnit &&
      searchType === prevState.searchType
      ? null
      : {
          cardNumber,
          yearOrRange,
          monthOrUnit,
          searchType,
          url:
            searchType === SEARCH_TYPE_MONTH
              ? `${API.root}${API.monthlyTransactions(
                  cardNumber,
                  yearOrRange,
                  monthOrUnit
                )}`
              : `${API.root}${API.transactionRange(cardNumber, yearOrRange)}`
        };
  }

  handleItemClick = event => {
    const { selectedCard } = this.state;

    const activeSelection = event.target.textContent.toLowerCase();
    const yearOrRange = this.optionsMap[activeSelection];
    const monthOrUnit = "days";
    const searchType = "range";

    const url = `${API.root}${API.transactionRange(
      this.state.selectedCard,
      yearOrRange
    )}`;
    this.setState({
      activeSelection,
      yearOrRange,
      monthOrUnit,
      searchType,
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

    const { children, match, history } = this.props;
    console.log("datafilter:", match, history);
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
                  this.setState({
                    activeSelection: "month",
                    modalOpen: true
                  });
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
                  content="No"
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

export { SEARCH_TYPE_MONTH, SEARCH_TYPE_RANGE };
