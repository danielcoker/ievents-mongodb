import React from 'react';
import AddCenter from '../../../components/containers/AddCenter';
import AddCenterView from '../../../components/containers/AddCenter/View';
import CenterForm from '../../../components/containers/AddCenter/CenterForm';

describe('<AddCenter />', () => {
  const props = {
    userName: 'tester',
    userToken: 'justASampleToken',
    isAdmin: false,
    isSuperAdmin: false,
    addingCenterStarted: false,
    addingCenterResolved: false,
    addingCenterError: null,
    dispatch: jest.fn()
  };
  const alterProps = newProps => ({ ...props, ...newProps });
  describe('Rendering:', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = shallow(<AddCenter {...props} />);
    });
    it('should render correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
    it('should redirect to the centers page if adding center resolved', () => {
      wrapper.setProps(alterProps({ addingCenterResolved: true }));
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('Behaviour:', () => {
    let wrapper; let wrapperInstance;
    beforeEach(() => {
      props.dispatch.mockReset();
      wrapper = shallow(<AddCenter {...props} />);
      wrapperInstance = wrapper.instance();
    });
    // The names on the following test block refers
    // to the instance method that handles the behaviour tested.
    describe('GET_INPUT', () => {
      it('should update the state with user input', () => {
        const userInput = 'best center';
        const fakeEvent = { target: { name: 'details', value: userInput } };
        wrapperInstance.getInput(fakeEvent);
        expect(wrapper.state('details')).toEqual(userInput);
      });
    });

    describe('CLEAR_INPUT_ERRORS', () => {
      it('should clear input errors in the state', () => {
        const nameError = 'Center name is required';
        wrapper.setState({ inputErrors: { nameError } });
        wrapperInstance.clearInputErrors();
        expect(wrapper.state('inputErrors').nameError).toBeNull();
      });
    });

    describe('HANDLE_IMAGE_DROP', () => {
      it('should update the state with image input', () => {
        const fakeImages = [{ info: 'I am a fake image' }];
        wrapperInstance.handleImageDrop(fakeImages);
        expect(wrapper.state('newImage')).toEqual(fakeImages[0]);
      });
    });

    describe('ADD', () => {
      it('should dispatch an action and set inputErros if validation fails', () => {
        const fakeEvent = { preventDefault: () => { } };
        const wrongPrice = 'wrongPriceValue';
        wrapper.setState({ price: wrongPrice });
        props.dispatch.mockReset();
        wrapperInstance.add(fakeEvent);
        expect(typeof wrapper.state('inputErrors').priceError).toEqual('string');
        expect(props.dispatch.mock.calls.length).toEqual(1);
      });
      it('should dispatch two acitons and clear inputErrors if validation pass', () => {
        const fakeEvent = { preventDefault: () => { } };
        const correctCenterData = {
          name: 'test-center1',
          location: 'test-center-location',
          details: 'test-center-details',
          capacity: '200',
          price: '500',
          newImages: 'http://testImage.jpg',
        };
        const previousError = 'Capacity is required';
        wrapper.setState({
          ...correctCenterData, inputErrors: { capacityError: previousError }
        });
        props.dispatch.mockReset();
        wrapperInstance.add(fakeEvent);
        expect(wrapper.state('inputErrors').capacityError).toBeNull();
        expect(props.dispatch.mock.calls.length).toEqual(2);
      });
    });

    describe('COMOPONENT_WILL_UNMOUNT', () => {
      it('should dispatch an action when the component wants to unmount', () => {
        props.dispatch.mockReset();
        wrapper.unmount();
        expect(props.dispatch.mock.calls.length).toEqual(1);
      });
    });
  });
});

describe('<AddCenterView />', () => {
  const props = {
    userName: 'tester',
    isAdmin: false,
    isSuperAdmin: false,
    addingCenterStarted: false,
    addingCenterError: null,
    inputErrors: {},
    newImageLink: 'http://testImage.jpg',
    add: () => { },
    getInput: () => { },
    handleImageDrop: () => { },
    dispatch: () => { },
    centerToUpdate: {},
    update: () => { },
    updating: false,
    updatingCenterError: null,
    updatingCenterStarted: false,
  };
  const alterProps = newProps => ({ ...props, ...newProps });
  describe('Rendering', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = shallow(<AddCenterView {...props} />);
    });
    it('should render correctly when adding', () => {
      expect(wrapper).toMatchSnapshot();
    });
    it('should render correctly when updating', () => {
      wrapper.setProps(alterProps({ updating: true }));
      expect(wrapper).toMatchSnapshot();
    });
  });
});

describe('<CenterForm />', () => {
  const props = {
    addingCenterStarted: false,
    addingCenterError: null,
    inputErrors: {},
    newImageLink: 'http://testImage.jpg',
    add: () => { },
    getInput: () => { },
    handleImageDrop: () => { },
    dispatch: () => { },
    centerToUpdate: {},
    update: () => { },
    updating: false,
    updatingCenterError: null,
    updatingCenterStarted: false,
  };
  const alterProps = newProps => ({ ...props, ...newProps });
  describe('Rendering', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = shallow(<CenterForm {...props} />);
    });
    it('should render correctly when adding', () => {
      expect(wrapper).toMatchSnapshot();
    });
    it('should render correctly when updating', () => {
      wrapper.setProps(alterProps({ updating: true }));
      expect(wrapper).toMatchSnapshot();
    });
    it('should render correctly if the center has its image', () => {
      wrapper.setProps(alterProps({ centerToUpdate: { images: ['image1'] } }));
      expect(wrapper).toMatchSnapshot();
    });
    it('should hide cancel button when updating/adding center starts', () => {
      wrapper.setProps(alterProps({ addingCenterStarted: true }));
      expect(wrapper).toMatchSnapshot();
    });
  });
});
