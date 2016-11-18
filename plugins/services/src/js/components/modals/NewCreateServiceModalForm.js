import Ace from 'react-ace';
import classNames from 'classnames';
import React, {PropTypes, Component} from 'react';

import AppValidators from '../../../../../../src/resources/raml/marathon/v2/types/app.raml';
import Batch from '../../../../../../src/js/structs/Batch';
import ContainerServiceFormSection from '../forms/ContainerServiceFormSection';
import {combineParsers} from '../../../../../../src/js/utils/ParserUtil';
import {combineReducers} from '../../../../../../src/js/utils/ReducerUtil';
import EnvironmentFormSection from '../forms/EnvironmentFormSection';
import GeneralServiceFormSection from '../forms/GeneralServiceFormSection';
import JSONReducers from '../../reducers/JSONReducers';
import JSONParser from '../../reducers/JSONParser';
import Service from '../../structs/Service';
import TabButton from '../../../../../../src/js/components/TabButton';
import TabButtonList from '../../../../../../src/js/components/TabButtonList';
import Tabs from '../../../../../../src/js/components/Tabs';
import TabView from '../../../../../../src/js/components/TabView';
import TabViewList from '../../../../../../src/js/components/TabViewList';
import Transaction from '../../../../../../src/js/structs/Transaction';
import TransactionTypes from '../../../../../../src/js/constants/TransactionTypes';
import DataValidatorUtil from '../../../../../../src/js/utils/DataValidatorUtil';

const METHODS_TO_BIND = [
  'handleFormChange',
  'handleFormBlur',
  'handleJSONBlur',
  'handleJSONChange',
  'handleAddItem',
  'handleRemoveItem'
];

const SECTIONS = [
  ContainerServiceFormSection,
  EnvironmentFormSection,
  GeneralServiceFormSection
];

class NewCreateServiceModalForm extends Component {
  constructor() {
    super(...arguments);

    let {service} = this.props;
    let batch = new Batch();
      Object.assign({}, ...SECTIONS.map((item) => item.reducers))
    );
    let jsonParser = combineParsers(JSONParser);
    let jsonReducer = combineReducers(JSONReducers);

    // Turn service configuration into Batch Transactions
    if (service) {
      jsonParser(service.toJSON()).forEach((item) => {
        batch.add(item);
      });
    }

    this.state = {
      appConfig: {},
      batch,
      errors: {},
      formReducer,
      jsonParser,
      jsonReducer,
      jsonValue: JSON.stringify(batch.reduce(jsonReducer, {}), null, 2)
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentWillReceiveProps(nextProps) {
    let {service} = nextProps;
    let batch = new Batch();
    if (service && this.props.service !== service) {
      let formReducer = combineReducers(
        Object.assign({}, ...SECTIONS.map((item) => item.reducers))
      );
      let jsonParser = combineParsers(JSONParser);
      let jsonReducer = combineReducers(JSONReducers);

      // Turn current configuration into Batch Transactions
      jsonParser(service.toJSON()).forEach((item) => {
        batch.add(item);
      });

      this.setState({appConfig: {}, batch, formReducer, jsonParser, jsonReducer});
    }
  }

  handleConvertToPod() {
  handleJSONBlur() {
    let {errors, jsonParser, jsonValue} = this.state;
    let newState = {};
    let appConfig;

    try {
      appConfig = JSON.parse(jsonValue);
    } catch (event) {
      // TODO: handle error
      newState.errors = Object.assign(errors, {
        jsonEditor: 'JSON value is not valid json.'
      });
    }

    if (appConfig) {
      // Flush batch
      let batch = new Batch();

      // Run data validation on the raw data
      let errorList = DataValidatorUtil.validate(appConfig, [
        AppValidators.App
      ]);

      let errors = DataValidatorUtil.errorArrayToMap( errorList );

      // Translate appConfig to batch transactions
      jsonParser(appConfig).forEach((item) => {
        batch.add(item);
      });

      // Update batch, errors and appConfig
      Object.assign(newState, {batch, errors, appConfig: {}});
    }

    this.setState(newState);
  }

  handleJSONChange(jsonValue) {
    let newState = {jsonValue};
    let parsedData;

    try {
      parsedData = JSON.parse(jsonValue);
    } catch (event) {
      // Not valid json, let's wait with firing event for new data
    }

    if (parsedData) {
      let batch = new Batch();
      let appConfig = {};
      this.state.jsonParser(parsedData).forEach((item) => {
        batch.add(item);
      });
      Object.assign(newState, {batch, appConfig});
    }

    this.setState(newState);
  }

  handleFormBlur() {
    // Create temporary finalized appConfig
    let appConfig = this.getAppConfig();

    // Run data validation on the raw data
    let errorList = DataValidatorUtil.validate(appConfig, [
      AppValidators.App
    ]);

    let errors = DataValidatorUtil.errorArrayToMap( errorList );

    // Create new jsonValue
    let jsonValue = JSON.stringify(appConfig, null, 2);
    this.setState({errors, jsonValue});
  }

  handleFormChange(event) {
    let {appConfig, batch, jsonReducer} = this.state;

    let value = event.target.value;
    if (event.target.type === 'checkbox') {
      value = event.target.checked;
    }
    let path = event.target.getAttribute('name');
    batch.add(new Transaction(path.split('.'), value));
    let newState = {batch};

    // Only update the jsonValue if we have a valid value
    if (event.target.validity.valid) {
      newState.jsonValue = JSON.stringify(
        batch.reduce(jsonReducer, appConfig),
        null,
        2
      );
    }

    this.setState(newState);
  }

  handleAddItem({value, path}) {
    let {appConfig, batch, jsonReducer} = this.state;
    batch.add(new Transaction(path.split(','), value, TransactionTypes.ADD_ITEM));

    // Update JSON data
    let jsonValue = JSON.stringify(batch.reduce(jsonReducer, appConfig), null, 2);
    this.setState({batch, jsonValue});
  }

  handleRemoveItem({value, path}) {
    let {appConfig, batch} = this.state;
    batch.add(new Transaction(path.split(','), value, TransactionTypes.REMOVE_ITEM));

    // Update JSON data
    let jsonValue = JSON.stringify(batch.reduce(jsonReducer, appConfig), null, 2);
    this.setState({batch, jsonValue});
  }

  getAppConfig() {
    let {appConfig, batch, jsonReducer} = this.state;

    return batch.reduce(jsonReducer, appConfig);
  }

  render() {
    let {appConfig, batch, errors, formReducer, jsonValue} = this.state;
    let {isJSONModeActive, isEdit, onConvertToPod, service} = this.props;
    let data = batch.reduce(formReducer, appConfig);

    let jsonEditorPlaceholderClasses = classNames(
      'modal-full-screen-side-panel-placeholder',
      {'is-visible': isJSONModeActive}
    );
    let jsonEditorClasses = classNames('modal-full-screen-side-panel', {
      'is-visible': isJSONModeActive
    });

    return (
      <div className="flex flex-item-grow-1">
        <div className="container flex flex-direction-top-to-bottom">
          <form onChange={this.handleFormChange} onBlur={this.handleFormBlur}>
            <Tabs vertical={true}>
              <TabButtonList>
                <TabButton id="services" label="Services" />
                <TabButton id="environment" label="Environment" />
              </TabButtonList>
              <TabViewList>
                <TabView id="services">
                  <GeneralServiceFormSection errors={errors} data={data} />
                </TabView>
                <TabView id="environment">
                  <EnvironmentFormSection
                    data={data}
                    onRemoveItem={this.handleRemoveItem}
                    onAddItem={this.handleAddItem} />
                </TabView>
              </TabViewList>
            </Tabs>
          </form>
        </div>
        <div className={jsonEditorPlaceholderClasses} />
        <div className={jsonEditorClasses}>
          <Ace
            editorProps={{$blockScrolling: true}}
            mode="json"
            onBlur={this.handleJSONBlur}
            onChange={this.handleJSONChange}
            showGutter={true}
            showPrintMargin={false}
            theme="monokai"
            height="100%"
            value={jsonValue}
            width="100%" />
        </div>
      </div>
    );
  }
}

NewCreateServiceModalForm.defaultProps = {
  onChange() {}
};

NewCreateServiceModalForm.propTypes = {
  onChange: PropTypes.func,
  service: PropTypes.instanceOf(Service)
};

module.exports = NewCreateServiceModalForm;
