import classNames from 'classnames';
import {Hooks} from 'PluginSDK';
import React, {Component, PropTypes} from 'react';
import {routerShape} from 'react-router';

import ApplicationSpec from '../../structs/ApplicationSpec';
import PodSpec from '../../structs/PodSpec';

import {DEFAULT_APP_SPEC} from '../../constants/DefaultApp';
import {DEFAULT_POD_SPEC} from '../../constants/DefaultPod';

import AppValidators from '../../../../../../src/resources/raml/marathon/v2/types/app.raml';
import CreateServiceJsonOnly from './CreateServiceJsonOnly';
import DataValidatorUtil from '../../../../../../src/js/utils/DataValidatorUtil';
import FullScreenModal from '../../../../../../src/js/components/modals/FullScreenModal';
import FullScreenModalHeader from '../../../../../../src/js/components/modals/FullScreenModalHeader';
import FullScreenModalHeaderActions from '../../../../../../src/js/components/modals/FullScreenModalHeaderActions';
import FullScreenModalHeaderTitle from '../../../../../../src/js/components/modals/FullScreenModalHeaderTitle';
import MarathonAppValidators from '../../validators/MarathonAppValidators';
import MarathonErrorUtil from '../../utils/MarathonErrorUtil';
import NewCreateServiceModalServicePicker from './NewCreateServiceModalServicePicker';
import NewCreateServiceModalForm from './NewCreateServiceModalForm';
import PodValidators from '../../../../../../src/resources/raml/marathon/v2/types/pod.raml';
import Service from '../../structs/Service';
import ServiceConfigDisplay from '../../service-configuration/ServiceConfigDisplay';
import ServiceUtil from '../../utils/ServiceUtil';
import ToggleButton from '../../../../../../src/js/components/ToggleButton';
import Util from '../../../../../../src/js/utils/Util';
import ContainerServiceFormSection from '../forms/ContainerServiceFormSection';
import EnvironmentFormSection from '../forms/EnvironmentFormSection';
import GeneralServiceFormSection from '../forms/GeneralServiceFormSection';
import HealthChecksFormSection from '../forms/HealthChecksFormSection';
import NetworkingFormSection from '../forms/NetworkingFormSection';
import MultiContainerNetworkingFormSection from '../forms/MultiContainerNetworkingFormSection';
import MultiContainerVolumesFormSection from '../forms/MultiContainerVolumesFormSection';
import ValidatorUtil from '../../../../../../src/js/utils/ValidatorUtil';
import VolumesFormSection from '../forms/VolumesFormSection';
import {combineParsers} from '../../../../../../src/js/utils/ParserUtil';
import {combineReducers} from '../../../../../../src/js/utils/ReducerUtil';
import JSONAppReducers from '../../reducers/JSONAppReducers';
import JSONMultiContainerReducers from '../../reducers/JSONMultiContainerReducers';
import JSONParser from '../../reducers/JSONParser';

const METHODS_TO_BIND = [
  'handleGoBack',
  'handleClearErrors',
  'handleClose',
  'handleConvertToPod',
  'handleJSONToggle',
  'handleServiceChange',
  'handleServiceErrorsChange',
  'handleServiceReview',
  'handleServiceRun',
  'handleServiceSelection',
  'handleTabChange'
];

const APP_ERROR_VALIDATORS = [
  AppValidators.App,
  MarathonAppValidators.containsCmdArgsOrContainer,
  MarathonAppValidators.complyWithResidencyRules,
  MarathonAppValidators.complyWithIpAddressRules
];

const POD_ERROR_VALIDATORS = [
  PodValidators.Pod
];

class NewCreateServiceModal extends Component {
  constructor() {
    super(...arguments);

    this.state = this.getResetState();

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  /**
   * @override
   */
  componentWillUpdate(nextProps) {
    const requestCompleted = this.props.isPending && !nextProps.isPending;
    const shouldClose = requestCompleted && !nextProps.errors;

    if (shouldClose) {
      this.handleClose();
    }
  }

  /**
   * @override
   */
  componentWillReceiveProps(nextProps) {
    if (!ServiceUtil.isEqual(this.props.service, nextProps.service)) {
      const newState = {serviceConfig: nextProps.service.getSpec()};

      if (nextProps.isEdit) {
        newState.servicePickerActive = false;
        newState.serviceJsonActive = false;
        newState.serviceFormActive = true;

        if (nextProps.service instanceof PodSpec) {
          newState.serviceJsonActive = true;
          newState.serviceFormActive = false;
        }
      }

      this.setState(newState);
    }
  }

  shouldForceSubmit() {
    const {errors} = this.props;

    if (errors && errors.message) {
      return /force=true/.test(errors.message);
    }

    return false;
  }

  handleGoBack({tabViewID}) {
    const {
      serviceFormActive,
      serviceJsonActive,
      servicePickerActive,
      serviceReviewActive
    } = this.state;

    if (serviceReviewActive) {
      // Just hide review screen. Form or JSON mode will be
      // activated automatically depending on their last state
      this.setState({
        serviceReviewActive: false,
        activeTab: tabViewID
      });

      return;
    }

    // Close if picker is open, or if editing a service in the form
    if (servicePickerActive || (!serviceReviewActive && this.props.isEdit)) {
      this.handleClose();

      return;
    }

    if (serviceFormActive) {
      // Switch back from form to picker
      this.setState({
        servicePickerActive: true,
        serviceFormActive: false
      });

      return;
    }

    if (serviceJsonActive) {
      // Switch back from JSON to picker
      this.setState({
        servicePickerActive: true,
        serviceJsonActive: false
      });

    }
  }

  handleTabChange(activeTab) {
    this.setState({activeTab});
  }

  handleClose() {
    this.props.onClose();
    this.setState(this.getResetState());
  }

  handleClearErrors() {
    this.props.clearError();
    this.setState({showAllErrors: false});
  }

  handleConvertToPod() {
    this.handleServiceSelection({type: 'pod'});
  }

  handleJSONToggle() {
    this.setState({isJSONModeActive: !this.state.isJSONModeActive});
  }

  handleServiceChange(newService) {
    const {errors} = this.props;
    if (!ValidatorUtil.isEmpty(errors)) {
      this.props.clearError();
    }

    this.setState({
      serviceConfig: newService,
      showAllErrors: false
    });
  }

  handleServiceErrorsChange(errors) {
    this.setState({serviceFormErrors: errors});
  }

  handleServiceSelection({route, type}) {
    switch (type) {

      case 'app':
        this.setState({
          servicePickerActive: false,
          serviceFormActive: true,
          serviceConfig: new ApplicationSpec(
            Object.assign(
              {id: this.props.service.getId()},
              DEFAULT_APP_SPEC
            )
          )
        });
        break;

      case 'pod':
        this.setState({
          servicePickerActive: false,
          serviceFormActive: true,
          serviceConfig: new PodSpec(
            Object.assign(
              {id: this.props.service.getId()},
              DEFAULT_POD_SPEC
            )
          )
        });
        break;

      case 'json':
        this.setState({
          servicePickerActive: false,
          serviceJsonActive: true,
          serviceConfig: this.props.service.getSpec()
        });
        break;

      case 'redirect':
        this.context.router.push(route);
        break;

    };
  }

  handleServiceReview() {
    const errors = this.getAllErrors();
    if (errors.length === 0) {
      this.setState({serviceReviewActive: true});
    } else {
      this.setState({showAllErrors: true});
    }
  }

  handleServiceRun() {
    const {marathonAction, service} = this.props;
    marathonAction(
      service,
      this.state.serviceConfig,
      this.shouldForceSubmit()
    );
  }

  /**
   * This function combines the errors received from marathon and the errors
   * produced by the form into a unified error array
   *
   * @returns {Array} - An array of error objects
   */
  getAllErrors() {
    const {serviceFormErrors, serviceConfig} = this.state;
    const {errors} = this.props;
    let validationErrors = [];

    // Validate Application or Pod according to the contents
    // of the serviceConfig property.

    if (serviceConfig instanceof ApplicationSpec) {
      validationErrors = DataValidatorUtil.validate(
        ServiceUtil.getServiceJSON(serviceConfig),
        APP_ERROR_VALIDATORS
      );
    }

    if (serviceConfig instanceof PodSpec) {
      validationErrors = DataValidatorUtil.validate(
        ServiceUtil.getServiceJSON(serviceConfig),
        POD_ERROR_VALIDATORS
      );
    }

    // Combine all errors
    return [].concat(
      MarathonErrorUtil.parseErrors(errors),
      serviceFormErrors,
      validationErrors
    );
  }

  getHeader() {

    // NOTE: Always prioritize review screen check
    if (this.state.serviceReviewActive) {
      return (
        <FullScreenModalHeader>
          <FullScreenModalHeaderActions
            actions={this.getSecondaryActions()}
            type="secondary" />
          <FullScreenModalHeaderTitle>
            Review & Run Service
          </FullScreenModalHeaderTitle>
          <FullScreenModalHeaderActions
            actions={this.getPrimaryActions()}
            type="primary" />
        </FullScreenModalHeader>
      );
    }

    let title = 'Run a Service';
    const {isEdit, service} = this.props;
    let serviceName = service.getName();
    if (serviceName) {
      serviceName = `"${serviceName}"`;
    } else {
      serviceName = 'Service';
    }

    if (isEdit) {
      title = `Edit ${serviceName}`;
    }

    return (
      <FullScreenModalHeader>
        <FullScreenModalHeaderActions
          actions={this.getSecondaryActions()}
          type="secondary" />
        <FullScreenModalHeaderTitle>
          {title}
        </FullScreenModalHeaderTitle>
        <FullScreenModalHeaderActions
          actions={this.getPrimaryActions()}
          type="primary" />
      </FullScreenModalHeader>
    );
  }

  getModalContent() {
    let {
      isJSONModeActive,
      serviceConfig,
      serviceFormActive,
      serviceJsonActive,
      servicePickerActive,
      serviceReviewActive
    } = this.state;

    // NOTE: Always prioritize review screen check
    if (serviceReviewActive) {
      return (
        <div className="flex-item-grow-1">
          <div className="container">
            <ServiceConfigDisplay
              onEditClick={this.handleGoBack}
              appConfig={serviceConfig}
              errors={this.getAllErrors()} />
          </div>
        </div>
      );
    }

    if (servicePickerActive) {
      return (
        <NewCreateServiceModalServicePicker
          onServiceSelect={this.handleServiceSelection} />
      );
    }

    if (serviceFormActive) {
      const {isEdit} = this.props;
      const {showAllErrors} = this.state;

      const SECTIONS = [
        ContainerServiceFormSection,
        EnvironmentFormSection,
        GeneralServiceFormSection,
        HealthChecksFormSection,
        NetworkingFormSection,
        VolumesFormSection,
        MultiContainerVolumesFormSection,
        MultiContainerNetworkingFormSection
      ];

      const jsonParserReducers = combineParsers(
        Hooks.applyFilter('serviceCreateJsonParserReducers', JSONParser)
      );

      const isPod = serviceConfig instanceof PodSpec;

      let jsonConfigReducers = combineReducers(
        Hooks.applyFilter('serviceJsonConfigReducers', JSONAppReducers)
      );

      if (isPod) {
        jsonConfigReducers = combineReducers(
          Hooks.applyFilter('serviceJsonConfigReducers', JSONMultiContainerReducers)
        );
      }

      const inputConfigReducers = combineReducers(
        Hooks.applyFilter('serviceInputConfigReducers',
          Object.assign({}, ...SECTIONS.map((item) => item.configReducers))
        )
      );

      return (
        <NewCreateServiceModalForm
          activeTab={this.state.activeTab}
          errors={this.getAllErrors()}
          jsonParserReducers={jsonParserReducers}
          jsonConfigReducers={jsonConfigReducers}
          handleTabChange={this.handleTabChange}
          inputConfigReducers={inputConfigReducers}
          isEdit={isEdit}
          isJSONModeActive={isJSONModeActive}
          ref={(ref) => {
            return this.createComponent = ref;
          }}
          onChange={this.handleServiceChange}
          onConvertToPod={this.handleConvertToPod}
          onErrorsChange={this.handleServiceErrorsChange}
          service={serviceConfig}
          showAllErrors={showAllErrors} />
      );
    }

    if (serviceJsonActive) {
      return (
        <CreateServiceJsonOnly
          errors={this.getAllErrors()}
          onChange={this.handleServiceChange}
          onErrorsChange={this.handleServiceErrorsChange}
          ref={(ref) => {
            return this.createComponent = ref;
          }}
          service={serviceConfig} />
      );
    }

    return null;
  }

  getPrimaryActions() {
    const {
      serviceFormActive,
      serviceJsonActive,
      servicePickerActive,
      serviceReviewActive
    } = this.state;

    const force = this.shouldForceSubmit();
    const runButtonLabel = force ? 'Force Run Service' : 'Run Service';
    const runButtonClassNames = classNames('flush-vertical', {
      'button-primary': !force,
      'button-danger': force
    });

    // NOTE: Always prioritize review screen check
    if (serviceReviewActive) {
      return [
        {
          className: runButtonClassNames,
          clickHandler: this.handleServiceRun,
          label: runButtonLabel
        }
      ];
    }

    if (servicePickerActive) {
      return null;
    }

    if (serviceFormActive) {
      // const errors = this.getAllErrors();

      return [
        {
          node: (
            <ToggleButton
              className="flush"
              checkboxClassName="toggle-button"
              checked={this.state.isJSONModeActive}
              onChange={this.handleJSONToggle}
              key="json-editor">
              JSON Editor
            </ToggleButton>
          )
        },
        {
          className: 'button-primary flush-vertical',
          clickHandler: this.handleServiceReview,
          disabled: false,
          // disabled: errors.length !== 0,
          label: 'Review & Run'
        }
      ];
    }

    if (serviceJsonActive) {
      // const errors = this.getAllErrors();

      return [
        {
          className: 'button-primary flush-vertical',
          clickHandler: this.handleServiceReview,
          disabled: false,
          // disabled: errors.length !== 0,
          label: 'Review & Run'
        }
      ];
    }

    return [];
  }

  getResetState(nextProps = this.props) {
    const newState = {
      activeTab: null,
      isJSONModeActive: false,
      serviceConfig: nextProps.service.getSpec(),
      serviceFormErrors: [],
      serviceFormActive: false,
      serviceJsonActive: false,
      servicePickerActive: true,
      serviceReviewActive: false,
      serviceFormHasErrors: false,
      showAllErrors: false
    };

    // Switch directly to form/json if edit
    if (nextProps.isEdit) {
      newState.servicePickerActive = false;

      if (nextProps.service instanceof PodSpec) {
        newState.serviceJsonActive = true;
      } else {
        newState.serviceFormActive = true;
      }
    }

    return newState;
  }

  getSecondaryActions() {
    const {
      servicePickerActive,
      serviceReviewActive
    } = this.state;
    let label = 'Back';

    if (servicePickerActive || (this.props.isEdit && !serviceReviewActive)) {
      label = 'Cancel';
    }

    return [
      {
        className: 'button-stroke',
        clickHandler: this.handleGoBack,
        label
      }
    ];
  }

  render() {
    const {props, state: {servicePickerActive, serviceReviewActive}} = this;
    let useGemini = false;

    if (servicePickerActive || serviceReviewActive) {
      useGemini = true;
    }

    return (
      <div>
        <FullScreenModal
          header={this.getHeader()}
          onClose={this.handleClose}
          useGemini={useGemini}
          {...Util.omit(props, Object.keys(NewCreateServiceModal.propTypes))}>
          {this.getModalContent()}
        </FullScreenModal>
      </div>
    );
  }
}

NewCreateServiceModal.contextTypes = {
  router: routerShape
};

NewCreateServiceModal.propTypes = {
  clearError: PropTypes.func.isRequired,
  errors: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string
  ]),
  isEdit: PropTypes.bool,
  isPending: PropTypes.bool.isRequired,
  marathonAction: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  service: PropTypes.instanceOf(Service).isRequired
};

module.exports = NewCreateServiceModal;
