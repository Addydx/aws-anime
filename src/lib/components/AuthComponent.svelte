<script>
  import { onMount } from 'svelte';
  
  let user = null;
  let loading = true;
  let authError = null;

  onMount(async () => {
    try {
      // Verificar si Amplify está configurado antes de usar auth
      const { getCurrentUser } = await import('aws-amplify/auth');
      user = await getCurrentUser();
    } catch (error) {
      console.log('Auth not configured yet or no user signed in:', error.message);
      authError = error.message;
    } finally {
      loading = false;
    }
  });

  async function handleSignOut() {
    try {
      const { signOut } = await import('aws-amplify/auth');
      await signOut();
      user = null;
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  async function handleSignIn() {
    try {
      const { signInWithRedirect } = await import('aws-amplify/auth');
      await signInWithRedirect();
    } catch (error) {
      console.error('Error signing in:', error);
      authError = error.message;
    }
  }
</script>

{#if loading}
  <div class="auth-loading">Cargando autenticación...</div>
{:else if authError}
  <div class="auth-info">
    <span>🔧 Configurando backend... (Ejecuta: amplify push)</span>
  </div>
{:else if user}
  <div class="auth-info">
    <span>👋 Hola, {user.username}!</span>
    <button on:click={handleSignOut} class="auth-btn">
      Cerrar Sesión
    </button>
  </div>
{:else}
  <div class="auth-info">
    <button on:click={handleSignIn} class="auth-btn">
      Iniciar Sesión
    </button>
  </div>
{/if}

<style>
  .auth-info {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 10px 20px;
    background: rgba(255,255,255,0.1);
    border-radius: 25px;
    backdrop-filter: blur(10px);
    color: white;
    margin-bottom: 20px;
  }

  .auth-btn {
    background: rgba(255,255,255,0.2);
    border: none;
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .auth-btn:hover {
    background: rgba(255,255,255,0.3);
  }

  .auth-loading {
    color: white;
    text-align: center;
    padding: 10px;
  }
</style>