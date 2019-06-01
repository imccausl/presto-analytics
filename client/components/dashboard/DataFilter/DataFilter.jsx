import React from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'semantic-ui-react';

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

export default class DataFilter extends React.Component {
  cardsArray = this.props.cards && this.props.cards.map(card => card.cardNumber);

  state = { activeSelection: options[0].name, selectedCard: this.cardsArray };

  handleItemClick = event => {
    this.setState({ activeSelection: event.target.textContent.toLowerCase() });
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
    const { selectedCard } = this.state;

    return (
      <Menu size="large" secondary text style={{ paddingBottom: '10px' }}>
        <CardMenu
          cards={this.cardsArray}
          currentSelection={selectedCard}
          handleChange={value => {
            this.setState({ selectedCard: value });
          }}
        />
        <this.FilterMenu />
      </Menu>
    );
  }
}

DataFilter.propTypes = propTypes;
DataFilter.defaultProps = defaultProps;
