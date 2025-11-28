<script>
  import { onMount } from 'svelte';// importa onMount para ejecutar el codigo cuando el componente se monta
  import { AnimeService } from '$lib/animeService.js';//importa el servicio de anime 
  import { goto } from '$app/navigation';//importa goto para navegar programaticamente por la app
  //import AuthComponent from '$lib/components/AuthComponent.svelte';//importa el componente de autenticacion

  let animes = [];//define un array para guardar los animes populares
  let loading = true;//indica si los datos estan cargando
  let error = null;//almacena cualquier error que ocurra durante la carga

  //cuando el componente se monta, carga los animes populares 
  onMount(async () => {//funcion asincrona para cargar los animes 
    try {//intenta ejecutar este codigo
      animes = await AnimeService.getPopularAnime(20);//llama al servicio para obtener los animes populares y los guarda en la variable animes que es un array 
      //20 es el numero de animes a obtener
      loading = false;//indica que la carga ha termiado
    } catch (err) {//captura cualquier erro que ocurra durante la carga
      error = err.message;//almacena el mensaje de error
      loading = false;//indica que la carga ha terminado incluso si hay un error
    }
  });
//funcion para navegar a los detalles de un anime 
  function viewAnimeDetails(animeId) {//recibe el id del anime
    goto(`/anime/${animeId}`);//goto navega a la pagina de detalles del anime usando su id
    //la ruta es carpeta anime y el id del anime 
  }
</script>

<svelte:head><!-- aqui se dfine el titulo de la pagina  -->
  <title>AnimeStar - Animes Populares</title>
</svelte:head>

<main><!-- se define el contenido principal de la pagina  -->
  <header>
    <h1>AnimeStar</h1>
    <p>Descubre los animes más populares</p>
    <!--<AuthComponent />-->
  </header>

  {#if loading}<!-- muestra un indicador de carga mientras se obtienen los animes populares  -->
    <div class="loading"><!-- indicador de carga, con clase loading -->
      <div class="spinner"></div>
      <p>Cargando animes populares...</p>
    </div>
  {:else if error}
    <div class="error"><!-- muestra un mensaje de error si este llegara a ocurrir  -->
      <h2>❌ Error</h2>
      <p>{error}</p>
    </div>
  {:else}
    <div class="anime-grid"><!-- grid que contiene las tarjetas de los animes populares -->
      {#each animes as anime}<!-- itera sobre el array de animes -->
      <!-- al hacer click en una tarjeta de anime te manda a los detalles del anime   -->
        <div 
          class="anime-card" 
          on:click={() => viewAnimeDetails(anime.mal_id)}
          on:keydown={(e) => e.key === 'Enter' && viewAnimeDetails(anime.mal_id)}
          tabindex="0"
          role="button"
        ><!-- aqui se define una tarjeta de anime que es interactica y accesible   -->
          <div class="anime-image">
            <img 
              src={anime.images.jpg.large_image_url} 
              alt={anime.title}
              loading="lazy"
            />
            <div class="rating">
              ⭐ {anime.score || 'N/A'}
            </div><!-- aqui se muestra la calificacion de un anime -->
          </div>
          <div class="anime-info">
            <h3>{anime.title}</h3><!-- muestra el titulo del anime -->
            <p class="year">{anime.year || 'N/A'}</p>
            <p class="episodes">{anime.episodes ? `${anime.episodes} eps` : 'En emisión'}</p>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</main>

<!-- aqui se definen los estilos  -->
<style>
  :global(body) {
    margin: 0;
    font-family: 'Arial', sans-serif;
    background: linear-gradient(135deg, #00012c 0%, #1802da 100%);
    min-height: 100vh;
  }

  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  header {
    text-align: center;
    margin-bottom: 40px;
    color: white;
  }

  header h1 {
    font-size: 3rem;
    margin: 0;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  }

  header p {
    font-size: 1.2rem;
    margin: 10px 0;
    opacity: 0.9;
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    color: white;
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
    color: white;
    backdrop-filter: blur(10px);
  }

  .anime-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 25px;
    padding: 20px 0;
  }

  .anime-card {
    background: rgba(255,255,255,0.1);
    border-radius: 15px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.2);
  }

  .anime-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    background: rgba(255,255,255,0.15);
  }

  .anime-card:focus {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }

  .anime-image {
    position: relative;
    height: 300px;
    overflow: hidden;
  }

  .anime-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .anime-card:hover .anime-image img {
    transform: scale(1.1);
  }

  .rating {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(0,0,0,0.7);
    color: white;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: bold;
  }

  .anime-info {
    padding: 20px;
    color: white;
  }

  .anime-info h3 {
    margin: 0 0 10px 0;
    font-size: 1.1rem;
    font-weight: bold;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .anime-info p {
    margin: 5px 0;
    opacity: 0.8;
    font-size: 0.9rem;
  }

  .year {
    color: #ffd700;
    font-weight: bold;
  }

  .episodes {
    color: #00ff88;
  }

  @media (max-width: 768px) {
    .anime-grid {
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 15px;
    }
    
    header h1 {
      font-size: 2rem;
    }
    
    main {
      padding: 10px;
    }
  }
</style>
