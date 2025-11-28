<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { AnimeService } from '$lib/animeService.js';

  let anime = null;
  let videos = null;
  let loading = true;
  let error = null;
  let animeId;

  // Obtener el ID del anime de la URL
  $: animeId = $page.params.id;

  onMount(async () => {
    if (animeId) {
      await loadAnimeData();
    }
  });

  async function loadAnimeData() {
    try {
      loading = true;
      // Cargar detalles del anime y videos en paralelo
      const [animeData, videoData] = await Promise.all([
        AnimeService.getAnimeDetails(animeId),
        AnimeService.getAnimeVideos(animeId).catch(() => ({ trailers: [], promo: [] }))
      ]);
      
      anime = animeData;
      videos = videoData;
      loading = false;
    } catch (err) {
      error = err.message;
      loading = false;
    }
  }

  function goBack() {
    goto('/');
  }

  function openMyAnimeList() {
    if (anime?.url) {
      window.open(anime.url, '_blank');
    }
  }

  function playTrailer() {
    if (videos?.trailers?.[0]?.url) {
      window.open(videos.trailers[0].url, '_blank');
    } else if (anime?.trailer?.url) {
      window.open(anime.trailer.url, '_blank');
    }
  }
</script>

<svelte:head>
  <title>{anime?.title || 'Cargando...'} - AnimeStar</title>
</svelte:head>

<main>
  {#if loading}
    <div class="loading">
      <div class="spinner"></div>
      <p>Cargando detalles del anime...</p>
    </div>
  {:else if error}
    <div class="error">
      <h2>❌ Error</h2>
      <p>{error}</p>
      <button on:click={goBack} class="btn btn-secondary">
        ← Volver
      </button>
    </div>
  {:else if anime}
    <div class="anime-detail">
      <!-- Botón de volver -->
      <button on:click={goBack} class="back-btn">
        ← Volver a la lista
      </button>

      <!-- Header con imagen y información básica -->
      <div class="anime-header">
        <div class="anime-poster">
          <img 
            src={anime.images.jpg.large_image_url} 
            alt={anime.title}
          />
          <div class="rating-badge">
            ⭐ {anime.score || 'N/A'}
          </div>
        </div>

        <div class="anime-main-info">
          <h1>{anime.title}</h1>
          
          {#if anime.title_japanese}
            <h2 class="japanese-title">{anime.title_japanese}</h2>
          {/if}

          <div class="basic-info">
            <div class="info-item">
              <span class="label">Año:</span>
              <span class="value">{anime.year || 'N/A'}</span>
            </div>
            
            <div class="info-item">
              <span class="label">Episodios:</span>
              <span class="value">{anime.episodes || 'En emisión'}</span>
            </div>
            
            <div class="info-item">
              <span class="label">Estado:</span>
              <span class="value">{anime.status || 'N/A'}</span>
            </div>
            
            <div class="info-item">
              <span class="label">Tipo:</span>
              <span class="value">{anime.type || 'N/A'}</span>
            </div>

            {#if anime.duration}
              <div class="info-item">
                <span class="label">Duración:</span>
                <span class="value">{anime.duration}</span>
              </div>
            {/if}
          </div>

          <!-- Géneros -->
          {#if anime.genres && anime.genres.length > 0}
            <div class="genres">
              <span class="label">Géneros:</span>
              <div class="genre-tags">
                {#each anime.genres as genre}
                  <span class="genre-tag">{genre.name}</span>
                {/each}
              </div>
            </div>
          {/if}

          <!-- Botones de acción -->
          <div class="action-buttons">
            <button on:click={openMyAnimeList} class="btn btn-primary">
              📱 Ver en MyAnimeList
            </button>
            
            {#if (videos?.trailers?.[0]?.url || anime?.trailer?.url)}
              <button on:click={playTrailer} class="btn btn-secondary">
                🎬 Ver Trailer
              </button>
            {/if}
          </div>
        </div>
      </div>

      <!-- Synopsis -->
      {#if anime.synopsis}
        <div class="synopsis-section">
          <h3>📝 Sinopsis</h3>
          <p class="synopsis">{anime.synopsis}</p>
        </div>
      {/if}

      <!-- Información adicional -->
      <div class="additional-info">
        <div class="info-grid">
          {#if anime.studios && anime.studios.length > 0}
            <div class="info-card">
              <h4>🏢 Estudios</h4>
              <p>{anime.studios.map(s => s.name).join(', ')}</p>
            </div>
          {/if}

          {#if anime.aired?.string}
            <div class="info-card">
              <h4>📅 Emisión</h4>
              <p>{anime.aired.string}</p>
            </div>
          {/if}

          {#if anime.source}
            <div class="info-card">
              <h4>📚 Fuente</h4>
              <p>{anime.source}</p>
            </div>
          {/if}

          {#if anime.rank}
            <div class="info-card">
              <h4>🏆 Ranking</h4>
              <p>#{anime.rank}</p>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: 'Arial', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
  }

  main {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
    color: white;
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
  }

  .spinner {
    border: 4px solid rgba(255,255,255,0.3);
    border-top: 4px solid white;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error {
    background: rgba(255,255,255,0.1);
    padding: 30px;
    border-radius: 15px;
    text-align: center;
    backdrop-filter: blur(10px);
  }

  .back-btn {
    background: rgba(255,255,255,0.2);
    border: none;
    color: white;
    padding: 10px 20px;
    border-radius: 25px;
    cursor: pointer;
    margin-bottom: 20px;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
  }

  .back-btn:hover {
    background: rgba(255,255,255,0.3);
    transform: translateX(-5px);
  }

  .anime-detail {
    background: rgba(255,255,255,0.1);
    border-radius: 20px;
    padding: 30px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.2);
  }

  .anime-header {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 40px;
    margin-bottom: 40px;
  }

  .anime-poster {
    position: relative;
  }

  .anime-poster img {
    width: 100%;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  }

  .rating-badge {
    position: absolute;
    top: 15px;
    right: 15px;
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 8px 15px;
    border-radius: 25px;
    font-weight: bold;
    font-size: 1.1rem;
  }

  .anime-main-info h1 {
    font-size: 2.5rem;
    margin: 0 0 10px 0;
    line-height: 1.2;
  }

  .japanese-title {
    font-size: 1.2rem;
    opacity: 0.8;
    margin: 0 0 30px 0;
    font-weight: normal;
  }

  .basic-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin-bottom: 25px;
  }

  .info-item {
    display: flex;
    justify-content: space-between;
    padding: 10px 15px;
    background: rgba(255,255,255,0.1);
    border-radius: 10px;
    backdrop-filter: blur(5px);
  }

  .label {
    font-weight: bold;
    opacity: 0.9;
  }

  .value {
    color: #ffd700;
  }

  .genres {
    margin-bottom: 30px;
  }

  .genre-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
  }

  .genre-tag {
    background: rgba(255,255,255,0.2);
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.9rem;
    backdrop-filter: blur(5px);
  }

  .action-buttons {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
  }

  .btn {
    padding: 12px 25px;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .btn-primary {
    background: linear-gradient(45deg, #00ff88, #00cc6a);
    color: white;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0,255,136,0.3);
  }

  .btn-secondary {
    background: linear-gradient(45deg, #ff6b6b, #ee5a52);
    color: white;
  }

  .btn-secondary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255,107,107,0.3);
  }

  .synopsis-section {
    margin-bottom: 40px;
  }

  .synopsis-section h3 {
    font-size: 1.5rem;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .synopsis {
    line-height: 1.6;
    opacity: 0.9;
    background: rgba(255,255,255,0.05);
    padding: 20px;
    border-radius: 12px;
    backdrop-filter: blur(5px);
  }

  .additional-info h3 {
    margin-bottom: 20px;
    font-size: 1.5rem;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
  }

  .info-card {
    background: rgba(255,255,255,0.1);
    padding: 20px;
    border-radius: 12px;
    backdrop-filter: blur(5px);
  }

  .info-card h4 {
    margin: 0 0 10px 0;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 1.1rem;
  }

  .info-card p {
    margin: 0;
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    .anime-header {
      grid-template-columns: 1fr;
      gap: 20px;
      text-align: center;
    }

    .anime-poster {
      max-width: 300px;
      margin: 0 auto;
    }

    .anime-main-info h1 {
      font-size: 2rem;
    }

    .basic-info {
      grid-template-columns: 1fr;
    }

    .action-buttons {
      justify-content: center;
    }

    main {
      padding: 10px;
    }

    .anime-detail {
      padding: 20px;
    }
  }
</style>