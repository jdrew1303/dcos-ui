let ActionTypes = {};
[
  'REQUEST_MESOS_LOG_ERROR',
  'REQUEST_MESOS_LOG_OFFSET_ERROR',
  'REQUEST_MESOS_LOG_OFFSET_SUCCESS',
  'REQUEST_MESOS_LOG_SUCCESS',
  'REQUEST_MARATHON_DEPLOYMENT_ROLLBACK_ERROR',
  'REQUEST_MARATHON_DEPLOYMENT_ROLLBACK_SUCCESS',
  'REQUEST_MARATHON_DEPLOYMENTS',
  'REQUEST_MARATHON_DEPLOYMENTS_ERROR',
  'REQUEST_MARATHON_DEPLOYMENTS_ONGOING',
  'REQUEST_MARATHON_DEPLOYMENTS_SUCCESS',
  'REQUEST_MARATHON_GROUP_CREATE_ERROR',
  'REQUEST_MARATHON_GROUP_CREATE_SUCCESS',
  'REQUEST_MARATHON_GROUP_DELETE_ERROR',
  'REQUEST_MARATHON_GROUP_DELETE_SUCCESS',
  'REQUEST_MARATHON_GROUP_EDIT_ERROR',
  'REQUEST_MARATHON_GROUP_EDIT_SUCCESS',
  'REQUEST_MARATHON_GROUPS',
  'REQUEST_MARATHON_GROUPS_ERROR',
  'REQUEST_MARATHON_GROUPS_ONGOING',
  'REQUEST_MARATHON_GROUPS_SUCCESS',
  'REQUEST_MARATHON_INSTANCE_INFO_ERROR',
  'REQUEST_MARATHON_INSTANCE_INFO_SUCCESS',
  'REQUEST_MARATHON_QUEUE_ERROR',
  'REQUEST_MARATHON_QUEUE_ONGOING',
  'REQUEST_MARATHON_QUEUE_SUCCESS',
  'REQUEST_MARATHON_SERVICE_CREATE_ERROR',
  'REQUEST_MARATHON_SERVICE_CREATE_SUCCESS',
  'REQUEST_MARATHON_SERVICE_DELETE_ERROR',
  'REQUEST_MARATHON_SERVICE_DELETE_SUCCESS',
  'REQUEST_MARATHON_SERVICE_EDIT_ERROR',
  'REQUEST_MARATHON_SERVICE_EDIT_SUCCESS',
  'REQUEST_MARATHON_SERVICE_RESTART_ERROR',
  'REQUEST_MARATHON_SERVICE_RESTART_SUCCESS',
  'REQUEST_MARATHON_SERVICE_VERSION_ERROR',
  'REQUEST_MARATHON_SERVICE_VERSION_SUCCESS',
  'REQUEST_MARATHON_SERVICE_VERSIONS_ERROR',
  'REQUEST_MARATHON_SERVICE_VERSIONS_SUCCESS',
  'REQUEST_MARATHON_TASK_KILL_ERROR',
  'REQUEST_MARATHON_TASK_KILL_SUCCESS',
  'REQUEST_PREVIOUS_MESOS_LOG_ERROR',
  'REQUEST_PREVIOUS_MESOS_LOG_SUCCESS',
  'REQUEST_TASK_DIRECTORY_ERROR',
  'REQUEST_TASK_DIRECTORY_SUCCESS'
].forEach(function (actionType) {
  ActionTypes[actionType] = actionType;
});

module.exports = ActionTypes;