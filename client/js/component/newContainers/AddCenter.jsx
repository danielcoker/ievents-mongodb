import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { validateAddCenterInputs } from '../../helpers/inputValidators';
import { addCenter } from '../../actions/centerActions';
import { stopAsyncProcess } from '../../actions/commonActions';
import * as asyncProcess from '../../actions/asyncProcess';
import UserSideNav from '../common/SideNavigation';
import Header from '../common/Header';
import ImageInput from '../common/ImageInput';
import { UserTopNav } from '../common/TopNavigation';
import { LoadingIcon } from '../common/LoadingAnimation';
import { BigAlert, SmallAlert } from '../common/Alert';


@connect((store) => {
  const { user } = store.authReducer;
  return {
    user,
    isAdmin: user.role === 'admin',
    isSuperAdmin: user.role === 'admin' || user.role === 'superAdmin',
    isUserAuthenticaed: store.authReducer.loggingUserResolved,
    addingCenterStarted: store.addCenterReducer.addingCenterStarted,
    addingCenterResolved: store.addCenterReducer.addingCenterResolved,
    addingCenterError: store.addCenterReducer.addingCenterError,
  };
})
class AddCenter extends React.Component {
  constructor() {
    super();
    this.state = {
      name: null,
      location: null,
      details: null,
      capacity: null,
      price: null,
      images: null,
      inputErrors: {
        nameError: null,
        locationError: null,
        detailsError: null,
        capacityError: null,
        priceError: null,
      },
    };
  }

  componentWillUnmount() {
    this.props.dispatch(stopAsyncProcess(asyncProcess.ADDING_CENTER));
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
   * Clears all the inputErrors in the state.
   */
  clearInputErrors = () => {
    const state = { ...this.state };
    state.inputErrors = {
      nameError: null,
      locationError: null,
      detailsError: null,
      capacityError: null,
      priceError: null,
    };
    this.setState(state);
  }

  /**
   * A callback to update the state after the user uploads an image.
   * @param {File} files The image file.
   */
  handleImageDrop = (files) => {
    this.setState({ images: files });
  }

  /**
   * Dispatches the action to add the center.
   * @param {Event} event The event object.
   */
  add = (event) => {
    event.preventDefault();
    this.props.dispatch(stopAsyncProcess(asyncProcess.ADDING_CENTER));
    const {
      name, location, details, capacity, price, images,
    } = this.state;
    const centerDetails = {
      name, location, details, capacity, price,
    };
    const inputErrors = validateAddCenterInputs(centerDetails);
    if (inputErrors.errorFound) {
      const state = { ...this.state };
      state.inputErrors = inputErrors;
      this.setState(state);
    } else {
      this.clearInputErrors();
      const fd = new FormData();
      const entries = Object.entries(centerDetails);
      entries.forEach((entry) => {
        const key = entry[0];
        const value = entry[1];
        if (value) {
          fd.append(key, value);
        }
      });
      if (images) {
        fd.append('image', images[0]);
      }
      this.props.dispatch(addCenter(fd, this.props.user.token));
    }
    window.scrollTo(0, 0);
  }

  render() {
    if (!this.props.isUserAuthenticaed) {
      return (<Redirect to="/users/login" />);
    } else if (this.props.addingCenterResolved) {
      return (<Redirect to="/centers2" />);
    }
    return (
      <div className="add-center-container">
        {/* Top navigation on small screen */}
        <UserTopNav
          name={this.props.user.name}
          title="Add a center"
          isAdmin={this.props.isAdmin}
          isSuperAdmin={this.props.isSuperAdmin}
          dispatch={this.props.dispatch}
        />
        <div className="container-fluid">
          <div className="row">
            {/*  Side navigation on large screen */}
            <UserSideNav
              name={this.props.user.name}
              isAdmin={this.props.isAdmin}
              isSuperAdmin={this.props.isSuperAdmin}
              dispatch={this.props.dispatch}
            />
            {/* Main content */}
            <div className="col-lg-10 offset-md-2" id="add-event-section">
              {/* Content Header(navigation) on large screen */}
              <Header text="Add a center" />
              {/* Input form */}
              <form className="mt-lg-5 mb-md-5">
                <LoadingIcon start={this.props.addingCenterStarted} size={3} />
                <div className="w-lg-50 mx-auto">
                  <BigAlert message={this.props.addingCenterError} />
                </div>
                <div className="container">
                  <div className="row">
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          name="name"
                          placeholder="The name of the center"
                          onChange={this.getInput}
                        />
                        <small className="form-text text-muted">Between 5 and 30 characters</small>
                        <SmallAlert message={this.state.inputErrors.nameError} />
                      </div>
                    </div>
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label htmlFor="location">Location</label>
                        <input
                          type="text"
                          className="form-control"
                          id="location"
                          name="location"
                          placeholder="The location of the center"
                          onChange={this.getInput}
                        />
                        <small className="form-text text-muted">Less than 30 characters</small>
                        <SmallAlert message={this.state.inputErrors.locationError} />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-lg-6">
                      <div className="form-group">
                        <label htmlFor="details">Details</label>
                        <textarea
                          className="form-control"
                          id="details"
                          rows="7"
                          name="details"
                          placeholder="More details about the center"
                          onChange={this.getInput}
                        />
                        <small className="form-text text-muted">Less than 300 characters</small>
                        <SmallAlert message={this.state.inputErrors.detailsError} />
                      </div>
                    </div>
                    <div className="col-12 col-lg-6">
                      <div className="row">
                        <div className="col-12">
                          <div className="form-group">
                            <label htmlFor="capacity">Capacity</label>
                            <input
                              type="number"
                              pattern="\d*"
                              className="form-control"
                              id="capacity"
                              name="capacity"
                              placeholder="How many seats"
                              onChange={this.getInput}
                            />
                            <SmallAlert message={this.state.inputErrors.capacityError} />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <div className="form-group">
                            <label htmlFor="price">Price</label>
                            <input
                              type="number"
                              className="form-control"
                              id="price"
                              name="price"
                              placeholder="Price"
                              onChange={this.getInput}
                            />
                            <SmallAlert message={this.state.inputErrors.priceError} />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <div className="form-group">
                            <label htmlFor="image">Image</label>
                            <div className="text-center">
                              <ImageInput
                                style={{ height: '100px' }}
                                id="image"
                                onDrop={this.handleImageDrop}
                                newImage={this.state.images ? this.state.images[0] : null}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="ml-3 pt-3">
                          <button
                            id="add-btn"
                            className="btn btn-outline-dark"
                            disabled={this.props.addingCenterStarted}
                            onClick={this.add}
                          >Add
                            </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <footer className="d-block d-sm-none mt-5">
          <div className="container text-white text-center py-5">
            <h1>Ievents</h1>
            <p>Copyright &copy; 2017</p>
          </div>
        </footer>
      </div>
    );
  }
}

export default AddCenter;