import {SET} from '../../../../../../src/js/constants/TransactionTypes';

function containers(state, {type, path = [], value}) {
  if (!path.includes('containers')) {
    return state;
  }

  if (!state) {
    state = [];
  }

  let newState = state.slice();
  const index = path[1];
  const joinedPath = path.join('.');

  if (type === SET && joinedPath === `containers.${index}.exec.command`) {
    if (!newState[index]) {
      newState[index] = {};
    }
    newState[index].exec = Object.assign({}, newState[index].exec, {command: value});
  }
  if (type === SET && joinedPath === `containers.${index}.privileged`) {
    if (!newState[index]) {
      newState[index] = {};
    }
    newState[index] = Object.assign({}, newState[index], {privileged: value});
  }

  if (type === SET && joinedPath === `containers.${index}.forcePullImage`) {
    if (!newState[index]) {
      newState[index] = {};
    }
    newState[index] = Object.assign({}, newState[index], {forcePullImage: value});
  }

  if (type === SET && joinedPath === `containers.${index}.image`) {
    if (!newState[index]) {
      newState[index] = {};
    }
    newState[index] = Object.assign({}, newState[index], {image: value});
  }

  return newState;
};

module.exports = {
  JSONReducer: containers,
  FormReducer: containers
};
