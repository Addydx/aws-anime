// Servicio para interactuar con la API no oficial de MyAnimeList (Jikan API)
const BASE_URL = 'https://api.jikan.moe/v4';

export class AnimeService {
  // Obtener animes más populares
  static async getPopularAnime(limit = 24) {
    try {
      const response = await fetch(`${BASE_URL}/top/anime?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching popular anime:', error);
      throw error;
    }
  }

  // Obtener detalles de un anime específico
  static async getAnimeDetails(id) {
    try {
      const response = await fetch(`${BASE_URL}/anime/${id}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching anime details:', error);
      throw error;
    }
  }

  // Obtener videos/trailers de un anime
  static async getAnimeVideos(id) {
    try {
      const response = await fetch(`${BASE_URL}/anime/${id}/videos`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching anime videos:', error);
      throw error;
    }
  }
}