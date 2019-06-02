import moment from 'moment';
import React from 'react';
import Fetch from 'react-fetch-component';
import PropTypes from 'prop-types';
import {
  Menu, Modal, Button, Icon,
} from 'semantic-ui-react';
import { YearInput, MonthInput } from 'semantic-ui-calendar-react';

import API from '../../../lib/api';
import CardMenu from '../CardMenu';

const propTypes = {};

const defaultProps = {};

// TODO: move to default props
const options = [
  { name: 'last 30 days', value: '30' },
  { name: 'last 60 days', value: '60' },
  { name: 'last year', value: '365' },
  { name: 'all time', value: 'all_time' },
];

const optionsMap = {
  [options[0].name]: `${API.root}${API.transactionRange(options[0].value)}`,
  [options[1].name]: `${API.root}${API.transactionRange(options[1].value)}`,
  [options[2].name]: `${API.root}${API.transactionRange(options[2].value)}`,
};

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
    url: `${API.root}${API.monthlyTransactions(2019, 4)}`,
  };

  componentWillMount() {
    this.setState({ url: optionsMap['last 30 days'] });
  }

  handleItemClick = event => {
    const activeSelection = event.target.textContent.toLowerCase();

    this.setState({ activeSelection, url: optionsMap[activeSelection] });
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
      modalOpen,
      selectedYear,
      selectedMonth,
      url,
      activeSelection,
    } = this.state;

    const { children } = this.props;

    return (
      <Fetch url={url} options={API.send('GET')}>
        {({
          fetch, data, error, loading,
        }) => (
          <>
            <Menu size="large" pointing text>
              <CardMenu
                cards={this.cardsArray}
                currentSelection={selectedCard}
                handleChange={value => {
                  this.setState({ selectedCard: value });
                }}
              />
              <this.FilterMenu />
              <Menu.Item
                name="month"
                active={activeSelection === 'month'}
                onClick={() => {
                  this.setState({ activeSelection: 'month', modalOpen: true });
                }}
              >
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
                      url: `${API.root}${API.monthlyTransactions(
                        selectedYear || thisYear,
                        selectedMonth,
                      )}`,
                      modalOpen: false,
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
