/* global $ */
import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  validateChangePasswordInputs, validateDeleteAccountInputs,
} from '../../helpers/inputValidators';
import { logOut } from '../../actions/authAction';
import { changePassword, deleteAccount } from '../../actions/userActions';
import { getAllEvents } from '../../actions/eventActions';
import { stopAsyncProcess } from '../../actions/commonActions';
import * as asyncProcess from '../../actions/asyncProcess';
import UserSideNav from '../common/SideNavigation';
import { UserTopNav } from '../common/TopNavigation';
import Header from '../common/Header';
import { LoadingIcon } from '../common/LoadingAnimation';
import { BigAlert, SmallAlert } from '../common/Alert';
import { countCollection } from '../../helpers/helpers';

@connect((store) => {
  const { user } = store.authReducer;
  return {
    user,
    isAdmin: user.role === 'admin',
    isSuperAdmin: user.role === 'admin' || user.role === 'superAdmin',
    isUserAuthenticaed: store.authReducer.loggingUserResolved,
    events: store.fetchEventsReducer.events,
    changingPasswordStarted: store.changePasswordReducer.changingPasswordStarted,
    changingPasswordResolved: store.changePasswordReducer.changingPasswordResolved,
    changingPasswordError: store.changePasswordReducer.changingPasswordError,
    deletingAccountStarted: store.deleteAccountReducer.deletingAccountStarted,
    deletingAccountResolved: store.deleteAccountReducer.deletingAccountResolved,
    deletingAccountError: store.deleteAccountReducer.deletingAccountError,
  };
})
class Profile extends React.Component {
  constructor() {
    super();
    this.state = {
      formerPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      password: '',
      inputErrors: {
        passwordError: null,
        formerPasswordError: null,
        newPasswordError: null,
        confirmNewPasswordError: null,
      },
    };
  }

  componentDidMount() {
    this.props.dispatch(getAllEvents(this.props.user.token));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.deletingUserResolved) {
      this.props.dispatch(logOut());
      $('#delete-account-modal').modal('hide');
    }
  }

  componentWillUnmount() {
    this.props.dispatch(stopAsyncProcess(asyncProcess.CHANGING_PASSWORD));
    this.props.dispatch(stopAsyncProcess(asyncProcess.DELETING_ACCOUNT));
    $('#delete-account-modal').modal('hide');
    $('#change-password-modal').modal('hide');
  }

  /**
   * Stores the user inputs in the state of this component.
   * @param {Event} event The event object.
   */
  getInput = (event) => {
    const state = { ...this.state };
    state[event.target.name] = event.target.value;
    this.setState(state);
  }

  /**
   * It clears the inputs of the forms in the modals.
   */
  clearInputs = () => {
    const state = { ...this.state };
    state.formerPassword = '';
    state.newPassword = '';
    state.confirmNewPassword = '';
    state.password = '';
    this.setState(state);
  }

  /**
   * Clears all the inputErrors in the state.
   */
  clearInputErrors = () => {
    const state = { ...this.state };
    state.inputErrors = {
      passwordError: null,
      formerPasswordError: null,
      newPasswordError: null,
      confirmNewPasswordError: null,
    };
    this.setState(state);
  }

  /**
   * It stops the asynchronous process that might have being started.
   */
  killAsyncProcess = () => {
    this.props.dispatch(stopAsyncProcess(asyncProcess.CHANGING_PASSWORD));
    this.props.dispatch(stopAsyncProcess(asyncProcess.DELETING_ACCOUNT));
  }

  /**
   * Perform some clean up actions when the modal is closed.
   */
  closeModalEffects = () => {
    this.clearInputs();
    setTimeout(() => {
      this.clearInputErrors();
    }, 1000);
    this.killAsyncProcess();
  }

  /**
   * It dispatches an action to change password.
   */
  changePassword = () => {
    this.props.dispatch(stopAsyncProcess(asyncProcess.CHANGING_PASSWORD));
    const {
      formerPassword, newPassword, confirmNewPassword,
    } = this.state;
    const passwordDetials = {
      formerPassword, newPassword, confirmNewPassword,
    };
    const inputErrors = validateChangePasswordInputs(passwordDetials);
    if (inputErrors.errorFound) {
      const state = { ...this.state };
      state.inputErrors = inputErrors;
      this.setState(state);
    } else {
      this.clearInputErrors();
      const userToken = this.props.user.token;
      this.props.dispatch(changePassword(passwordDetials, userToken));
    }
  }

  /**
   * It dispatches an action to delete the user's account.
   */
  deleteAccount = () => {
    this.props.dispatch(stopAsyncProcess(asyncProcess.DELETING_ACCOUNT));
    const { password } = this.state;
    const inputErrors = validateDeleteAccountInputs({ password });
    if (inputErrors.errorFound) {
      const state = { ...this.state };
      state.inputErrors = inputErrors;
      this.setState(state);
    } else {
      this.clearInputErrors();
      const userToken = this.props.user.token;
      this.props.dispatch(deleteAccount(password, userToken));
    }
  }

  render() {
    if (!this.props.isUserAuthenticaed) {
      return <Redirect to="/users/login" />;
    }
    return (
      <div id="profile-container">

        {/* Top Navigation on small and medium screens */}
        <UserTopNav
          name={this.props.user.name}
          title="Profile"
          isAdmin={this.props.isAdmin}
          isSuperAdmin={this.props.isSuperAdmin}
          dispatch={this.props.dispatch}
        />

        <div className="container-fluid">
          <div className="row">

            {/* Side navigation on large sreen */}
            <UserSideNav
              name={this.props.user.name}
              isAdmin={this.props.isAdmin}
              isSuperAdmin={this.props.isSuperAdmin}
              dispatch={this.props.dispatch}
            />

            {/* <!-- Main content --> */}
            <div className="col-lg-10 offset-lg-2">

              {/* Content Header(navigation) on large screen */}
              <Header text="Profile" />

              {/* <!-- Profile Detials --> */}
              <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '500px', marginTop: '70px' }} id="content">
                <div className="bg-white p-3" style={{ width: '500px' }}>
                  <p className="h1 text-center text-capitalize" style={{ fontWeight: 'lighter', fontSize: '3rem' }}>{this.props.user.name}</p>
                  <p className="h3 mt-3" style={{ fontWeight: 'normal' }}>Events</p>
                  <ul className="list-group">
                    <Link to="/events" className="just-link">
                      <li className="list-group-item d-flex justify-content-between align-items-center text-grey">
                        Done
                        <span className="badge badge-primary badge-pill">
                          {countCollection(this.props.events, event => event.status === 'done')}
                        </span>
                      </li>
                    </Link>
                    <Link to="/events" className="just-link">
                      <li className="list-group-item d-flex justify-content-between align-items-center text-grey">
                        Pending
                        <span className="badge badge-primary badge-pill">
                          {countCollection(this.props.events, event => event.status === 'allowed')}
                        </span>
                      </li>
                    </Link>
                    <Link to="/events" className="just-link">
                      <li className="list-group-item d-flex justify-content-between align-items-center text-grey">
                        Canceled
                        <span className="badge badge-primary badge-pill">
                          {countCollection(this.props.events, event => event.status === 'canceled')}
                        </span>
                      </li>
                    </Link>
                  </ul>
                  <p className="h3 mt-3" style={{ fontWeight: 'normal' }}>Account Settings</p>
                  <ul className="list-group">
                    <a href="" className="just-link" data-toggle="modal" data-target="#change-password-modal">
                      <li className="list-group-item">Change Password</li>
                    </a>
                    <a href="" className="just-link" data-toggle="modal" data-target="#delete-account-modal">
                      <li className="list-group-item">Delete Account</li>
                    </a>
                  </ul>
                </div>
              </div>
              {/* <!-- /.Profile Details --> */}

              {/* <!-- Change Password Modal --> */}
              <div className="modal fade" id="change-password-modal" tabIndex="-1" role="dialog" data-backdrop="static">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Change Password</h5>
                      <button
                        type="button"
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                        onClick={this.closeModalEffects}
                        disabled={this.props.changingPasswordStarted}
                      ><span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <LoadingIcon start={this.props.changingPasswordStarted} size={3} />
                      <BigAlert message={this.props.changingPasswordError} />
                      <BigAlert
                        message={this.props.changingPasswordResolved ? 'Password Changed!!' : null}
                        type="success"
                      />
                      <form className="mt-0">
                        <div className="form-group">
                          <label htmlFor="former-password">Former Password</label>
                          <input
                            type="password"
                            className="form-control"
                            id="former-password"
                            name="formerPassword"
                            value={this.state.formerPassword}
                            onChange={this.getInput}
                          />
                          <SmallAlert message={this.state.inputErrors.formerPasswordError} />
                        </div>
                        <div className="form-group">
                          <label htmlFor="new-password">New Password</label>
                          <input
                            type="password"
                            className="form-control"
                            id="new-password"
                            name="newPassword"
                            value={this.state.newPassword}
                            onChange={this.getInput}
                          />
                          <SmallAlert message={this.state.inputErrors.newPasswordError} />
                        </div>
                        <div className="form-group">
                          <label htmlFor="confirm-new-password">Confirm New Password</label>
                          <input
                            type="password"
                            className="form-control"
                            id="confirm-new-password"
                            name="confirmNewPassword"
                            value={this.state.confirmNewPassword}
                            onChange={this.getInput}
                          />
                          <SmallAlert message={this.state.inputErrors.confirmNewPasswordError} />
                        </div>
                      </form>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-dark pointer-button"
                        data-dismiss="modal"
                        onClick={this.closeModalEffects}
                        disabled={this.props.changingPasswordStarted}
                      >Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary pointer-button"
                        onClick={this.changePassword}
                        disabled={this.props.changingPasswordStarted}
                      >Change
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* <!-- /.Change Password Modal --> */}

              {/* <!-- Delete Account Modal --> */}
              <div className="modal fade" id="delete-account-modal" tabIndex="-1" role="dialog" data-backdrop="static">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Delete Account</h5>
                      <button
                        type="button"
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                        onClick={this.closeModalEffects}
                        disabled={this.props.deletingAccountStarted}
                      ><span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <p className="h6">Are you sure you wan't to delete your account? </p>
                      <span className="text-grey">This action is irreversible, you would loose all your data on this platform.</span>
                      <div className="form-group mt-3">
                        <label htmlFor="password" className="h6">Your Password</label>
                        <input
                          type="password"
                          className="form-control"
                          id="password"
                          placeholder="Input you password to continue"
                          name="password"
                          value={this.state.password}
                          onChange={this.getInput}
                        />
                        <SmallAlert message={this.state.inputErrors.passwordError} />
                        <LoadingIcon start={this.props.deletingAccountStarted} size={3} />
                        <br />
                        <BigAlert message={this.props.deletingAccountError} />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-dark pointer-button"
                        data-dismiss="modal"
                        onClick={this.closeModalEffects}
                        disabled={this.props.deletingAccountStarted}
                      >Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger pointer-button"
                        onClick={this.deleteAccount}
                        disabled={this.props.deletingAccountStarted}
                      >Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* <!-- /.Delete Account Modal --> */}

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;