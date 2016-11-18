import {SET} from '../../../../../../src/js/constants/TransactionTypes';
import VolumeConstants from '../../constants/VolumeConstants';

let {MESOS} = VolumeConstants.type;

function container(state, {type, path = [], value}) {
  if (!path.includes('container')) {
    return state;
  }

  const joinedPath = path.join('.');
  let newState = Object.assign({}, state);
  if (!newState.type) {
    newState.type = MESOS;
  }

  if (type === SET && joinedPath === 'container.type') {
    newState.type = value;
  }

  if (type === SET && joinedPath === 'container.docker.exec.command') {
    newState.docker = Object.assign({}, newState.docker);
    newState.docker.exec = Object.assign({}, newState[index].exec, {command: value});
  }

  if (type === SET && joinedPath === 'container.docker.privileged') {
    newState.docker = Object.assign({}, newState.docker, {privileged: value});
  }

  if (type === SET && joinedPath === 'container.docker.privileged') {
    newState.docker = Object.assign({}, newState.docker, {privileged: value});
  }

  if (type === SET && joinedPath === 'container.docker.forcePullImage') {
    newState.docker = Object.assign({}, newState.docker, {forcePullImage: value});
  }

  if (type === SET && joinedPath === 'container.docker.image') {
    newState.docker = Object.assign({}, newState.docker, {image: value});
  }

  // Move container to new containerKey
  return newState;
};

module.exports = {
  JSONReducer: container,
  FormReducer: container
};
