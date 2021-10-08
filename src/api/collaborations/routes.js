const routes = (handler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: handler.postToCollaborationHandler,
    options: {
      auth: 'openmusicapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: handler.deleteFromCollaborationHandler,
    options: {
      auth: 'openmusicapp_jwt',
    },
  },
];

module.exports = routes;
