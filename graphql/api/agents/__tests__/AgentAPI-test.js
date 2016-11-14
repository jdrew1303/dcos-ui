jest.unmock('../AgentResolvers');
jest.unmock('../AgentSchema');
jest.unmock('../../applications/ApplicationResolvers');
jest.unmock('../../applications/ApplicationSchema');
jest.unmock('../../cluster/ClusterResolvers');
jest.unmock('../../cluster/ClusterSchema');
jest.unmock('../../frameworks/FrameworkResolvers');
jest.unmock('../../frameworks/FrameworkSchema');
jest.unmock('../../groups/GroupResolvers');
jest.unmock('../../groups/GroupSchema');
jest.unmock('../../tasks/TaskResolvers');
jest.unmock('../../tasks/TaskSchema');
jest.unmock('../../common/pagination/schema');
jest.unmock('../../common/status/schema');
jest.unmock('../../index');
jest.unmock('../../resolvers');
jest.unmock('../../schema');


//const graphql = require('graphql').graphql;

import models from '../../models';
import schema from '../../index';
describe('Agent', () => {
  it('', () => {
    expect(true).toEqual(true);
  })
});
// describe('Agent', () => {
//   it('returns correct data for Agent fields', async () => {
//     var query = `
//       query Cluster {
//         agent(id:"2") {
//           id
//           hostname
//           tasks {
//             edges: {
//               node : {
//                 id
//               }
//             }
//           }
//         }
//       }
//     `;
//     var mockData = {
//       marathon: {
//         id: '/',
//         apps: [{
//           id: '/test',
//           tasks: [
//             {
//               id: 'foo-task'
//             }
//           ]
//         }],
//         groups: []
//       },
//       mesos: {
//         state: {
//           slaves: [
//             {
//               id: '2',
//               hostname: 'foo'
//             }
//           ]
//         },
//         frameworks: [
//           {
//             id: 'framework-1',
//             name: 'framework',
//             tasks: [
//               {
//                 id: 'foo-task',
//                 name: 'test'
//               }
//             ],
//             completed_tasks: []
//           }
//         ]
//       }
//     };
//     var context = {
//       models: models(mockData)
//     };

//     var result = await graphql(schema, query, undefined, context);

//     expect(result).toEqual({});

//   })
// });
