import { graphql } from 'graphql';

import models from '../../allModels';
import schema from '../../index';

describe('Agent', () => {
  it('', () => {expect(true).toEqual(true)});
  // var mockData = {
  //   marathon: {
  //     groups: {
  //       id: '/',
  //       apps: [
  //         {
  //           id: '/test',
  //           tasks: [
  //             {
  //               id: 'foo-task'
  //             }
  //           ]
  //         }
  //       ],
  //       groups: [
  //         {
  //           id: '/nested',
  //           groups: [],
  //           apps: [
  //             {
  //               id: '/nested/app',
  //               tasks: [
  //                 {
  //                   id: 'foo-app-task'
  //                 }
  //               ]
  //             }
  //           ]
  //         }
  //       ]
  //     }
  //   },
  //   mesos: {
  //     state: {
  //       slaves: [
  //         {
  //           id: '2',
  //           hostname: 'foo'
  //         },
  //         {
  //           id: '3',
  //           hostname: 'bar'
  //         }
  //       ],
  //       frameworks: [
  //         {
  //           id: 'framework-1',
  //           name: 'framework',
  //           tasks: [
  //             {
  //               id: 'foo-task',
  //               name: 'test',
  //               slave_id: '2'
  //             }
  //           ],
  //           completed_tasks: []
  //         }
  //       ]
  //     }
  //   }
  // };
  // var context = {
  //   models: models(mockData)
  // };

  // it('returns correct data for Agent fields', async () => {
  //   var query = `
  //     query Cluster {
  //       agent(id:"2") {
  //         id
  //         hostname
  //         tasks {
  //           edges {
  //             node {
  //               id
  //             }
  //           }
  //         }
  //       }
  //     }
  //   `;
  //   var result = await graphql(schema, query, undefined, context);

  //   expect(result).toEqual({
  //     data: {
  //       agent: {
  //         id: 'agent:2',
  //         hostname: 'foo',
  //         tasks: {
  //           edges: [
  //             {
  //               node: {
  //                 id: 'task:foo-task'
  //               }
  //             }
  //           ]
  //         }
  //       }
  //     }
  //   });
  // });

  // it('returns paginated list of agents', async () => {
  //   var query = `
  //     query Cluster {
  //       agents {
  //         edges {
  //           node {
  //             id
  //           }
  //         }
  //       }
  //     }
  //   `;
  //   var result = await graphql(schema, query, undefined, context);

  //   expect(result).toEqual({
  //     data: {
  //       agents: {
  //         edges: [
  //           {
  //             node: {
  //               id: 'agent:2'
  //             }
  //           },
  //           {
  //             node: {
  //               id: 'agent:1'
  //             }
  //           }
  //         ]
  //       }
  //     }
  //   });
  // });

});
