import {simpleParser} from '../../../../../src/js/utils/ParserUtil';
import {JSONParser as environmentVariables} from './serviceForm/EnvironmentVariables';
import {JSONParser as labels} from './serviceForm/Labels';
import {JSONParser as healthChecks} from './serviceForm/HealthChecks';
import {JSONParser as containers} from './serviceForm/Containers';
import VolumeConstants from '../constants/VolumeConstants';

const {DOCKER} = VolumeConstants.type;

module.exports = [
  simpleParser(['id']),
  simpleParser(['instances']),
  simpleParser(['container', 'type']),
  simpleParser(['container', DOCKER.toLowerCase(), 'image']),
  simpleParser(['container', DOCKER.toLowerCase(), 'forcePullImage']),
  simpleParser(['container', DOCKER.toLowerCase(), 'privileged']),
  simpleParser(['cpus']),
  simpleParser(['mem']),
  simpleParser(['disk']),
  simpleParser(['cmd']),
  containers,
  environmentVariables,
  labels,
  healthChecks
];
