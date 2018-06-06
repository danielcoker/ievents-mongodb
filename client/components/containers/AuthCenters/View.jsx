import React from 'react';
import PropTypes from 'prop-types';
import SideNavigation from '../../common/SideNavigation';
import Header from '../../common/Header';
import CenterCards from '../../common/CenterCards';
import { LoadingBox } from '../../common/LoadingAnimation';
import { AuthTopNavigation } from '../../common/TopNavigation';
import { CenterDetailsModal } from '../../common/Modals';

const View = props => (
  <div id="auth-centers-container">
    <AuthTopNavigation
      name={props.userName}
      title="Centers"
      isAdmin={props.isAdmin}
      isSuperAdmin={props.isSuperAdmin}
      dispatch={props.dispatch}
    />
    <div className="container-fluid">
      <div className="row">
        <SideNavigation
          name={props.userName}
          isAdmin={props.isAdmin}
          isSuperAdmin={props.isSuperAdmin}
          dispatch={props.dispatch}
        />
        <div className="col-lg-10 offset-lg-2 mt-lg-0">
          <Header text="Centers" />
          {
            props.centers.length === 0 && props.fetchingCentersStarted ?
              <LoadingBox iconSize={4} /> :
              <div className="page-content">
                <div className="container">
                  <div className="mt-5">
                    <div className="row">
                      <CenterCards
                        centers={props.centers}
                        isAdmin={props.isAdmin || props.isSuperAdmin}
                        onBook={props.onBook}
                        onEdit={props.onEdit}
                        createModalContent={props.createModalContent}
                      />
                    </div>
                  </div>
                </div>
                <CenterDetailsModal {...props.modalContent} />
              </div>
          }
        </div>
      </div>
    </div>
  </div>
);

View.defaultProps = {
  modalContent: {}
};

/* eslint-disable react/forbid-prop-types */
View.propTypes = {
  userName: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isSuperAdmin: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  centers: PropTypes.array.isRequired,
  fetchingCentersStarted: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onBook: PropTypes.func.isRequired,
  modalContent: PropTypes.object,
  createModalContent: PropTypes.func.isRequired
};

export default View;
