import AgentStore from './agents/AgentStore';
import FrameworkStore from './frameworks/FrameworkStore';
import GroupStore from './groups/GroupStore';
import TaskStore from './tasks/TaskStore';

export default function createStore(endpoints) {
  return {
    Agents: new AgentStore({ endpoints }),
    Frameworks: new FrameworkStore({ endpoints }),
    Groups: new GroupStore({ endpoints }),
    Tasks: new TaskStore({ endpoints })
  };
}
