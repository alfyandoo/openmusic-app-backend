const autoBind = require('auto-bind');
const { successResponse } = require('../../utils/responses');

class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, validator) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    autoBind(this);
  }

  async postToCollaborationHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

    const collaborationId = await this._collaborationsService.addToCollaboration(playlistId, userId);

    return successResponse(h, {
      withMessage: true,
      withData: true,
      responseMessage: 'Kolaborasi berhasil ditambahkan',
      responseData: {
        collaborationId,
      },
      responseCode: 201,
    });
  }

  async deleteFromCollaborationHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._collaborationsService.deleteFromCollaboration(playlistId, userId);

    return successResponse(h, {
      withMessage: true,
      responseMessage: 'Kolaborasi berhasil dihapus',
    });
  }
}

module.exports = CollaborationsHandler;
