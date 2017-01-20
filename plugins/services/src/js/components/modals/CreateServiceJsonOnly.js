import React, {PropTypes} from 'react';
import deepEqual from 'deep-equal';

import ApplicationSpec from '../../structs/ApplicationSpec';
import FieldHelp from '../../../../../../src/js/components/form/FieldHelp';
import FieldLabel from '../../../../../../src/js/components/form/FieldLabel';
import JSONEditor from '../../../../../../src/js/components/JSONEditor';
import PodSpec from '../../structs/PodSpec';
import ServiceUtil from '../../utils/ServiceUtil';
import ServiceValidatorUtil from '../../utils/ServiceValidatorUtil';

const METHODS_TO_BIND = [
  'handleJSONChange',
  'handleJSONErrorStateChange'
];

class CreateServiceJsonOnly extends React.Component {
  constructor() {
    super(...arguments);

    this.state = {
      appConfig: ServiceUtil.getServiceJSON(this.props.service)
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  /**
   * @override
   */
  componentWillReceiveProps({service}) {
    const prevJSON = ServiceUtil.getServiceJSON(this.props.service);
    const nextJSON = ServiceUtil.getServiceJSON(service);
    // Make sure to not set state unless the service has actually changed
    if (deepEqual(prevJSON, nextJSON)) {
      return;
    }

    this.setState(this.getNewStateForJSON(ServiceUtil.getServiceJSON(service)));
  }

  /**
   * Emmit the correct ServiceSpec on JSON change
   *
   * @param {Object} jsonObject - The JSON object from which to build the spec
   */
  handleJSONChange(jsonObject) {
    let newObject;
    if (ServiceValidatorUtil.isPodSpecDefinition(jsonObject)) {
      newObject = new PodSpec(jsonObject);
    } else {
      newObject = new ApplicationSpec(jsonObject);
    }

    this.props.onChange(newObject);
  }

  /**
   * Emmit JSON form errors if the syntax is invalid
   *
   * @param {Boolean} errorState - True if there are JSON syntax errors
   */
  handleJSONErrorStateChange(errorState) {
    const {errors, onErrorsChange} = this.props;
    const hasJsonError = errors.some(function (error) {
      return error.type === 'JSON_ERROR';
    });

    // Produce a JSON error if we have errors
    if (errorState && !hasJsonError) {
      onErrorsChange([
        {
          path: [],
          type: 'JSON_ERROR',
          variables: {},
          message: 'The input entered is not a valid JSON string'
        }
      ]);
    }

    // Remove JSON error if we are back to normal
    if (!errorState && hasJsonError) {
      onErrorsChange([]);
    }
  }

  getNewStateForJSON(appConfig) {
    return {appConfig};
  }

  render() {
    const {errors} = this.props;
    const {appConfig} = this.state;

    // Note: The `transform` parameter is just a hack to properly align the
    // error message.
    const editorStyles = {
      transform: 'translateX(0)'
    };

    return (
      <div className="create-service-modal-json-only container">
        <div className="create-service-modal-json-only-introduction">
          <FieldLabel>JSON Configuration</FieldLabel>
          <FieldHelp>
            Use this text area to customize your configuration via JSON.
          </FieldHelp>
        </div>
        <div className="create-service-modal-json-only-editor-container">
          <JSONEditor
            className="create-service-modal-json-only-editor"
            errors={errors}
            onChange={this.handleJSONChange}
            onErrorStateChange={this.handleJSONErrorStateChange}
            showGutter={true}
            showPrintMargin={false}
            style={editorStyles}
            theme="monokai"
            value={appConfig} />
        </div>
      </div>
    );
  }
}

CreateServiceJsonOnly.defaultProps = {
  onChange() {},
  onErrorsChange() {}
};

CreateServiceJsonOnly.propTypes = {
  errors: PropTypes.array.isRequired,
  onChange: PropTypes.func,
  onErrorsChange: PropTypes.func,
  service: PropTypes.object
};

module.exports = CreateServiceJsonOnly;
