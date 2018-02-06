import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { Button } from 'react-bootstrap';
import FA from 'react-fontawesome';

import ns from './ns.json';
import { FullWidthRow, Spacer } from '../../helperComponents';
import LockedSettings from './Locked-Settings.jsx';
import SocialSettings from './Social-Settings.jsx';
import EmailSettings from './Email-Setting.jsx';
import LanguageSettings from './Language-Settings.jsx';
import SettingsSkeleton from './Settings-Skeleton.jsx';

import { toggleUserFlag } from './redux';
import {
  toggleNightMode,
  updateTitle,

  signInLoadingSelector,
  userSelector,
  themeSelector,
  hardGoTo
} from '../../redux';

const mapStateToProps = createSelector(
  userSelector,
  themeSelector,
  signInLoadingSelector,
  (
    {
      username,
      email,
      isLocked,
      isGithubCool,
      isTwitter,
      isLinkedIn,
      sendMonthlyEmail,
      sendNotificationEmail,
      sendQuincyEmail
    },
    theme,
    showLoading,
  ) => ({
    currentTheme: theme,
    email,
    isGithubCool,
    isLinkedIn,
    isLocked,
    isTwitter,
    sendMonthlyEmail,
    sendNotificationEmail,
    sendQuincyEmail,
    showLoading,
    username
  })
);

const mapDispatchToProps = {
  hardGoTo,
  toggleIsLocked: () => toggleUserFlag('isLocked'),
  toggleMonthlyEmail: () => toggleUserFlag('sendMonthlyEmail'),
  toggleNightMode,
  toggleNotificationEmail: () => toggleUserFlag('sendNotificationEmail'),
  toggleQuincyEmail: () => toggleUserFlag('sendQuincyEmail'),
  updateTitle
};

const propTypes = {
  children: PropTypes.element,
  currentTheme: PropTypes.string,
  email: PropTypes.string,
  hardGoTo: PropTypes.func.isRequired,
  initialLang: PropTypes.string,
  isGithubCool: PropTypes.bool,
  isLinkedIn: PropTypes.bool,
  isLocked: PropTypes.bool,
  isTwitter: PropTypes.bool,
  lang: PropTypes.string,
  sendMonthlyEmail: PropTypes.bool,
  sendNotificationEmail: PropTypes.bool,
  sendQuincyEmail: PropTypes.bool,
  showLoading: PropTypes.bool,
  toggleIsLocked: PropTypes.func.isRequired,
  toggleMonthlyEmail: PropTypes.func.isRequired,
  toggleNightMode: PropTypes.func.isRequired,
  toggleNotificationEmail: PropTypes.func.isRequired,
  toggleQuincyEmail: PropTypes.func.isRequired,
  updateMyLang: PropTypes.func,
  updateTitle: PropTypes.func.isRequired,
  username: PropTypes.string
};

export class Settings extends React.Component {
  constructor(...props) {
    super(...props);
    this.updateMyLang = this.updateMyLang.bind(this);
  }

  updateMyLang(e) {
    e.preventDefault();
    const lang = e.target.value;
    this.props.updateMyLang(lang);
  }

  componentWillMount() {
    this.props.updateTitle('Settings');
  }
  componentWillReceiveProps({ username, showLoading, hardGoTo }) {
    if (!username && !showLoading) {
      hardGoTo('/signup');
    }
  }

  render() {
    const {
      currentTheme,
      email,
      isGithubCool,
      isLinkedIn,
      isLocked,
      isTwitter,
      sendMonthlyEmail,
      sendNotificationEmail,
      sendQuincyEmail,
      showLoading,
      toggleIsLocked,
      toggleMonthlyEmail,
      toggleNightMode,
      toggleNotificationEmail,
      toggleQuincyEmail,
      username
    } = this.props;
    if (!username && showLoading) {
      return <SettingsSkeleton />;
    }
    return (
      <div className={ `${ns}-container` }>
        <FullWidthRow>
          <Button
            block={ true }
            bsSize='lg'
            bsStyle='primary'
            className='btn-link-social'
            href={ `/${username}` }
            >
            <FA name='user' />
            Show me my public profile
          </Button>
          <Button
            block={ true }
            bsSize='lg'
            bsStyle='primary'
            className='btn-link-social'
            href={ '/signout' }
            >
            Sign me out of freeCodeCamp
          </Button>
        </FullWidthRow>
        <h1 className='text-center'>Settings for your Account</h1>
        <h2 className='text-center'>Actions</h2>
        <FullWidthRow>
          <Button
            block={ true }
            bsSize='lg'
            bsStyle='primary'
            className='btn-link-social'
            onClick={ () => toggleNightMode(username, currentTheme) }
            >
            Toggle Night Mode
          </Button>
        </FullWidthRow>
        <FullWidthRow>
          <SocialSettings
            isGithubCool={ isGithubCool }
            isLinkedIn={ isLinkedIn }
            isTwitter={ isTwitter }
          />
        </FullWidthRow>
        <Spacer />
        <h2 className='text-center'>Account Settings</h2>
        <FullWidthRow>
          <Button
            block={ true }
            bsSize='lg'
            bsStyle='primary'
            className='btn-link-social'
            href='/commit'
            >
            Edit my pledge
          </Button>
        </FullWidthRow>
        <Spacer />
        <h2 className='text-center'>Privacy Settings</h2>
        <FullWidthRow>
          <LockedSettings
            isLocked={ isLocked }
            toggle={ toggleIsLocked }
          />
        </FullWidthRow>
        <Spacer />
        <h2 className='text-center'>Email Settings</h2>
        <FullWidthRow>
          <EmailSettings
            email={ email }
            sendMonthlyEmail={ sendMonthlyEmail }
            sendNotificationEmail={ sendNotificationEmail }
            sendQuincyEmail={ sendQuincyEmail }
            toggleMonthlyEmail={ toggleMonthlyEmail }
            toggleNotificationEmail={ toggleNotificationEmail }
            toggleQuincyEmail={ toggleQuincyEmail }
          />
        </FullWidthRow>
        <Spacer />
        <h2 className='text-center'>Display challenges in:</h2>
        <FullWidthRow>
          <LanguageSettings />
        </FullWidthRow>
        <Spacer />
        <h2 className='text-center'>Danger Zone</h2>
        <FullWidthRow>
          <Button
            block={ true }
            bsSize='lg'
            bsStyle='danger'
            className='btn-link-social'
            href='/delete-my-account'
            >
            Delete my freeCodeCamp account
          </Button>
          <Button
            block={ true }
            bsSize='lg'
            bsStyle='danger'
            className='btn-link-social'
            href='/reset-my-progress'
            >
            Reset all of my progress and brownie points
          </Button>
        </FullWidthRow>
      </div>
    );
  }
}

Settings.displayName = 'Settings';
Settings.propTypes = propTypes;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
