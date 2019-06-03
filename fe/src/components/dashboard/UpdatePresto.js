import React, { Component } from "react";
import { Modal } from "semantic-ui-react";

import PrestoSignin from "../PrestoSignin";

const UpdatePresto = props => {
  const { open, close } = props;

  return (
    <>
      <Modal open={open} size="tiny">
        <PrestoSignin update closeModal={close} />
      </Modal>
    </>
  );
};

export default UpdatePresto;
