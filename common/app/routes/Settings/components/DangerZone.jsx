import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Panel, Alert, Button } from 'react-bootstrap';
import { connect } from 'react-redux';

import { FullWidthRow } from '../../../helperComponents';
import ResetModal from './ResetModal.jsx';
import DeleteModal from './DeleteModal.jsx';
import SectionHeader from './SectionHeader.jsx';
import { resetProgress, deleteAccount } from '../redux';

const propTypes = {
  deleteAccount: PropTypes.func.isRequired,
  resetProgress: PropTypes.func.isRequired
};

const mapStateToProps = () => ({});
const mapDispatchToProps = {
  deleteAccount,
  resetProgress
};

class DangerZone extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      delete: false,
      reset: false
    };

    this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
    this.toggleResetModal = this.toggleResetModal.bind(this);
  }

  toggleDeleteModal() {
    return this.setState(state => ({
      ...state,
      delete: !state.delete
    }));
  }

  toggleResetModal() {
    return this.setState(state => ({
      ...state,
      reset: !state.reset
    }));
  }

  render() {
    const { resetProgress, deleteAccount } = this.props;
    return (
      <div>
        <SectionHeader>
          Danger Zone
        </SectionHeader>
        <FullWidthRow>
          <Panel
            bsStyle='danger'
            className='danger-zone-panel'
            header={<h2><strong>Danger Zone</strong></h2>}
            >
            <Alert
              bsStyle='danger'
              >
              <p>
                Tread carefully, changes made in this area are permanent.
                They cannot be undone. Be sure you mean it when you click
                around in here.
              </p>
            </Alert>
            <FullWidthRow>
              <Button
                block={ true }
                bsSize='lg'
                bsStyle='danger'
                onClick={ this.toggleResetModal }
                >
                Reset all of my progress
              </Button>
              <hr />
              <Button
                block={ true }
                bsSize='lg'
                bsStyle='danger'
                onClick={ this.toggleDeleteModal }
                >
                Delete my account
              </Button>
            </FullWidthRow>
          </Panel>
          <ResetModal
            onHide={ this.toggleResetModal }
            reset={ resetProgress }
            show={ this.state.reset }
          />
          <DeleteModal
            delete={ deleteAccount }
            onHide={ this.toggleDeleteModal }
            show={ this.state.delete }
          />
        </FullWidthRow>
      </div>
    );
  }
}

DangerZone.displayName = 'DangerZone';
DangerZone.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(DangerZone);
