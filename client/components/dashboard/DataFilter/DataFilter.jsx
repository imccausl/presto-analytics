import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Modal, Button } from 'semantic-ui-react';
import { YearInput, MonthInput } from 'semantic-ui-calendar-react';

import CardMenu from '../CardMenu';

const propTypes = {};

const defaultProps = {};

// TODO: move to default props
const options = [
  { name: 'last 30 days', value: 'last_30_days' },
  { name: 'last 60 days', value: 'last_60_days' },
  { name: 'last year', value: 'last_year' },
  { name: 'all time', value: 'all_time' },
];

const thisMonth = new Date().getMonth();
const thisYear = new Date().getFullYear();
export default class DataFilter extends React.Component {
  cardsArray = this.props.cards && this.props.cards.map(card => card.cardNumber);

  state = {
    activeSelection: options[0].name,
    selectedCard: this.cardsArray,
    modalOpen: false,
    selectedMonth: thisMonth,
    selectedYear: thisYear,
    year: thisYear,
    month: thisMonth,
  };

  handleItemClick = event => {
    this.setState({ activeSelection: event.target.textContent.toLowerCase() });
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
      selectedCard, modalOpen, selectedYear, selectedMonth,
    } = this.state;
    const { children } = this.props;

    console.log('** SELECTED CARD:', selectedCard);
    return (
      <>
        <Menu size="large" secondary text>
          <CardMenu
            cards={this.cardsArray}
            currentSelection={selectedCard}
            handleChange={value => {
              this.setState({ selectedCard: value });
            }}
          />
          <this.FilterMenu />
        </Menu>
        {children}

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
            <Button negative onclick={() => this.setState({ modalOpen: false })}>
              No
            </Button>
            <Button
              positive
              icon="checkmark"
              labelPosition="right"
              content="Yes"
              onClick={() => {
                this.setState({
                  month: selectedMonth - 1,
                  year: selectedYear || thisYear,
                  modalOpen: false,
                });
              }}
            />
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}

DataFilter.propTypes = propTypes;
DataFilter.defaultProps = defaultProps;
