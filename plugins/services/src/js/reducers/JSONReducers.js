import {JSONReducer as container} from './serviceForm/Container';
import {JSONReducer as containers} from './serviceForm/Containers';
import {JSONReducer as env} from './serviceForm/EnvironmentVariables';
import {JSONReducer as labels} from './serviceForm/Labels';
import {SET} from '../../../../../src/js/constants/TransactionTypes';
import {
  simpleFloatReducer,
  simpleIntReducer,
  simpleReducer
} from '../../../../../src/js/utils/ReducerUtil';

module.exports = {
  id: simpleReducer('id', '/'),
  instances: simpleIntReducer('instances', 1),
  container,
  containers,
  cpus: simpleFloatReducer('cpus', 0.01),
  mem: simpleIntReducer('mem', 128),
  disk: simpleIntReducer('disk', 0),
  cmd: simpleIntReducer('cmd'),
  env,
  labels
};
