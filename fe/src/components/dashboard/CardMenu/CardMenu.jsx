import React from "react";
import PropTypes from "prop-types";
import { Dropdown } from "semantic-ui-react";

const propTypes = {};

function makeCardMenuData(cards) {
  const options = cards.map((card, index) => ({
    key: cards.length > 1 ? index + 2 : index + 1,
    text: card,
    value: card
  }));

  if (cards.length > 1) {
    options.unshift({ key: 1, text: "All Cards", value: "all" });
  }

  return options;
}

export default function CardMenu(props) {
  const { cards, handleChange, currentSelection } = props;
  const options = makeCardMenuData(cards);

  return (
    <Dropdown
      item
      options={options}
      value={currentSelection}
      onChange={(e, { value }) => {
        handleChange(value);
      }}
    />
  );
}

CardMenu.propTypes = propTypes;
