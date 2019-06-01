import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';

const propTypes = {};

function makeCardMenuData(cards) {
  const options = cards.map((card, index) => ({
    key: cards.length > 1 ? index + 2 : index + 1,
    text: card.cardNumber,
    value: card.cardNumber,
  }));

  if (cards.length > 1) {
    options.unshift({ key: 1, text: 'All Cards', value: cards });
  }

  return options;
}

export default function CardMenu(props) {
  const { cards, handleChange, currentSelection } = props;
  const options = makeCardMenuData(cards);

  return (
    <Dropdown
      item
      inline
      options={options}
      defaultValue={cards}
      value={currentSelection}
      onChange={(e, { value }) => {
        handleChange(value);
      }}
    />
  );
}

CardMenu.propTypes = propTypes;
