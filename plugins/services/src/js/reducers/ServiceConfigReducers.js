import {simpleReducer} from '../../../../../src/js/utils/ReducerUtil';

module.exports = {
  id: simpleReducer('id', '/'),
  cpus: simpleReducer('cpus', 0.01),
  mem: simpleReducer('mem', 128),
  disk: simpleReducer('disk', 0),
  instances: simpleReducer('instances', 1),
  cmd: simpleReducer('cmd', '')
};
