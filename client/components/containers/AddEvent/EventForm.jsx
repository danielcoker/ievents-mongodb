import React from 'react';
import PropTypes from 'prop-types';
import FakeDiv from '../../hoc/FakeDiv';
import CenterDropDown from './CenterDropDown';
import { LoadingIcon } from '../../common/LoadingAnimation';
import { BigAlert, SmallAlert } from '../../common/Alert';

const EventForm = (props) => {
  const toUpdate = { ...props.toUpdate };
  return (
    <FakeDiv>
      <form className="mt-lg-5 w-lg-50">
        <LoadingIcon start={props.addingEventStarted || props.updatingEventStarted} size={3} />
        <BigAlert message={props.addingEventError || props.updatingEventError} />
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            placeholder="A short description of your event"
            defaultValue={toUpdate.title}
            onChange={props.getInput}
          />
          <small
            id="emailHelp"
            className="form-text text-muted"
          >Between 5 and 30 characters
          </small>
          <SmallAlert message={props.inputErrors.titleError} />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            rows="6"
            name="description"
            id="description"
            className="form-control"
            placeholder="More details about the event"
            defaultValue={toUpdate.description}
            onChange={props.getInput}
          />
          <small
            id="emailHelp"
            className="form-text text-muted"
          >Less than 200 characters
          </small>
          <SmallAlert message={props.inputErrors.descriptionError} />
        </div>
      </form>
      <form className="my-3 form-inline">
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            className="form-control ml-sm-3"
            name="date"
            defaultValue={toUpdate.title ? toUpdate.date.replace(/\//g, '-') : null}
            onChange={props.getInput}
          />
          <SmallAlert message={props.inputErrors.dateError} />
        </div>
        <div className="form-group ml-md-3">
          <label htmlFor="centers">Choose a Center</label>
          <CenterDropDown
            centers={props.centers}
            handleChange={props.getInput}
            defaultValue={props.centerToBook || toUpdate.centerId}
          />
          <SmallAlert message={props.inputErrors.centerIdError} />
        </div>
      </form>
      <button
        className="btn ie-blue-button"
        disabled={props.addingEventStarted || props.updatingEventStarted}
        onClick={props.add || props.update}
      >{toUpdate.title ? 'Update' : 'Create'}
      </button>
    </FakeDiv>
  );
};

EventForm.defaultProps = {
  addingEventStarted: undefined,
  addingEventError: '',
  updatingEventStarted: undefined,
  updatingEventError: '',
  centerToBook: 0,
  inputErrors: {},
  toUpdate: {},
  add: undefined,
  update: undefined,
};

/* eslint-disable react/forbid-prop-types */
EventForm.propTypes = {
  addingEventStarted: PropTypes.bool,
  addingEventError: PropTypes.string,
  updatingEventStarted: PropTypes.bool,
  updatingEventError: PropTypes.string,
  getInput: PropTypes.func.isRequired,
  inputErrors: PropTypes.object,
  centers: PropTypes.array.isRequired,
  centerToBook: PropTypes.number,
  toUpdate: PropTypes.object,
  add: PropTypes.func,
  update: PropTypes.func,
};

export default EventForm;
