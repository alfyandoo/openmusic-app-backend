const autoBind = require('auto-bind');
const { successResponse } = require('../../utils/responses');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);

    const newSongId = await this._service.addSong(request.payload);

    return successResponse(h, {
      withMessage: true,
      withData: true,
      responseMessage: 'Lagu berhasil ditambahkan',
      responseData: { songId: newSongId },
      responseCode: 201,
    });
  }

  async getSongsHandler(request, h) {
    const obtainedSongs = await this._service.getSongs();
    return successResponse(h, {
      withData: true,
      responseData: { songs: obtainedSongs },
    });
  }

  async getSongByIdHandler(request, h) {
    const { songId } = request.params;
    const obtainedSong = await this._service.getSongById(songId);
    return successResponse(h, {
      withData: true,
      responseData: { song: obtainedSong },
    });
  }

  async putSongByIdHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const { songId } = request.params;

    await this._service.editSongById(songId, request.payload);

    return successResponse(h, {
      withMessage: true,
      responseMessage: 'Lagu berhasil diperbarui',
    });
  }

  async deleteSongByIdHandler(request, h) {
    const { songId } = request.params;
    await this._service.deleteSongById(songId);

    return successResponse(h, {
      withMessage: true,
      responseMessage: 'Lagu berhasil dihapus',
    });
  }
}

module.exports = SongsHandler;
