import {JSONReducer as container} from './serviceForm/Container';
import {JSONReducer as containers} from './serviceForm/Containers';
import {JSONReducer as env} from './serviceForm/EnvironmentVariables';
import {JSONReducer as labels} from './serviceForm/Labels';
import {JSONReducer as healthChecks} from './serviceForm/HealthChecks';
import {SET} from '../../../../../src/js/constants/TransactionTypes';
import {
  simpleFloatReducer,
  simpleIntReducer,
  simpleReducer
} from '../../../../../src/js/utils/ReducerUtil';

module.exports = {
  id: simpleReducer('id'),
  instances: simpleIntReducer('instances'),
  container,
  containers,
  cpus: simpleFloatReducer('cpus'),
  mem: simpleIntReducer('mem'),
  disk: simpleIntReducer('disk'),
  cmd(state, {type, path = [], value}) {
    if (!path.includes('container')) {
      return state;
    }

    const joinedPath = path.join('.');
    if (type === SET && joinedPath === 'container.docker.exec.command') {
      return value;
    }

    return state;
  },
  env,
  labels,
  healthChecks
};
