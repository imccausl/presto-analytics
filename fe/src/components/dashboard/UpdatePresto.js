import React, { Component } from 'react';
import Fetch from 'react-fetch-component';
import {
  Dimmer, Loader, Form, Modal, Header, Icon, Button, Dropdown,
} from 'semantic-ui-react';

import API from '../../lib/api';
import requestApi from '../../lib/requestApi';
import PrestoSignin from '../PrestoSignin';

export default class UpdatePresto extends Component {
  state = { open: this.props.open, username: '', password: '' };

  componentDidUpdate(prevProps, nextProps) {
    if (prevProps.open !== this.props.open) {
      this.setState({ open: this.props.open });
    }
  }

  handleTextEntry = e => {
    const { name, value } = e.target;
    // console.log(name, value);
    this.setState({ [name]: value });
  };

  render() {
    const { open, username, password } = this.state;

    return (
      <>
        <Dropdown.Item
          onClick={() => {
            this.setState({ open: true });
          }}
        >
          Update Presto Data
        </Dropdown.Item>

        <Modal open={open} size="tiny">
          <PrestoSignin
            update
            closeModal={() => {
              this.setState({ open: false });
            }}
          />
        </Modal>
      </>
    );
  }
}
