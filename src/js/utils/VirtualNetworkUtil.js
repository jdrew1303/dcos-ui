import {Link} from 'react-router';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */

import AlertPanel from '../components/AlertPanel';

const VirtualNetworkUtil = {
  getEmptyNetworkScreen() {
    return (
      <AlertPanel
        title="Virtual network not found">
        <p className="flush">
          Could not find the requested virtual network. Go to <Link to="/networking/networks">Networks</Link> overview to see all virtual networks.
        </p>
      </AlertPanel>
    );
  }
};

module.exports = VirtualNetworkUtil;
