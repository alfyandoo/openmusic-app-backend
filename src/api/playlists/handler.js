const autoBind = require('auto-bind');
const { successResponse } = require('../../utils/responses');

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postToPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);

    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const playlistId = await this._service.addPlaylist({
      name, owner: credentialId,
    });

    return successResponse(h, {
      withMessage: true,
      withData: true,
      responseMessage: 'Playlist berhasil ditambahkan',
      responseData: {
        playlistId,
      },
      responseCode: 201,
    });
  }

  async getFromPlaylistsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._service.getPlaylists(credentialId);

    return successResponse(h, {
      withData: true,
      responseData: {
        playlists,
      },
    });
  }

  async getFromPlaylistByIdHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(id, credentialId);

    const playlist = await this._service.getPlaylistById(id);

    return successResponse(h, {
      withData: true,
      responseData: {
        playlist,
      },
    });
  }

  async putToPlaylistByIdHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);

    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(id, credentialId);
    await this._service.editPlaylistById(id, request.payload);

    return successResponse(h, {
      withMessage: true,
      responseMessage: 'Playlist berhasil diperbarui',
    });
  }

  async deleteFromPlaylistByIdHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(id, credentialId);
    await this._service.deletePlaylistById(id);

    return successResponse(h, {
      withMessage: true,
      responseMessage: 'Pllaylist berhasil dihapus',
    });
  }

  async postToPlaylistSongHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);

    const { songId } = request.payload;
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.addPlaylistSong(playlistId, songId);

    return successResponse(h, {
      withMessage: true,
      responseMessage: 'Lagu berhasil ditambahkan ke playlist',
      responseCode: 201,
    });
  }

  async getFromPlaylistSongsHandler(request, h) {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);

    const songs = await this._service.getPlaylistSongs(playlistId);

    return successResponse(h, {
      withData: true,
      responseData: {
        songs,
      },
    });
  }

  async deleteFromPlaylistSongByIdHandler(request, h) {
    const { playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.deletePlaylistSongById(playlistId, songId);

    return successResponse(h, {
      withMessage: true,
      responseMessage: 'Lagu berhasil dihapus dari playlist',
    });
  }
}

module.exports = PlaylistsHandler;
