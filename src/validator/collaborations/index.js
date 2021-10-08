const InvariantError = require('../../exceptions/InvariantError');
const { CollaborationPayloadSchema } = require('./schema');

const CollaborationsValidator = {
  validateCollaborationPayload: (payload) => {
    const collaborationvalidationResult = CollaborationPayloadSchema.validate(payload);

    if (collaborationvalidationResult.error) {
      throw new InvariantError(collaborationvalidationResult.error.message);
    }
  },
};

module.exports = CollaborationsValidator;
