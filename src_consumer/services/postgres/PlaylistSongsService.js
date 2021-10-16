const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistSongsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async getSongsFromPlaylistsId(playlistId) {
    try {
      const result = await this._cacheService.get(`playlistsongs-consumer:${playlistId}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: `SELECT songs.id, songs.title, songs.performer FROM playlists
              INNER JOIN playlistsongs ON playlistsongs.playlist_id = playlists.id
              INNER JOIN songs ON songs.id = playlistsongs.song_id
              WHERE playlists.id = $1`,
        values: [playlistId],
      };

      const result = await this._pool.query(query);

      if (!result.rows) {
        throw new InvariantError('Gagal mengambil lagu dari playlist');
      }

      await this._cacheService.set(`playlistsongs-consumer:${playlistId}`, JSON.stringify(result.rows));

      return result.rows;
    }
  }
}

module.exports = PlaylistSongsService;
