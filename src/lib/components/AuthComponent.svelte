<script>
  import { onMount } from 'svelte';
  import { getCurrentUser, signOut, signInWithRedirect } from 'aws-amplify/auth';
  
  let user = null;
  let loading = true;

  onMount(async () => {
    try {
      user = await getCurrentUser();
    } catch (error) {
      console.log('No user signed in');
    } finally {
      loading = false;
    }
  });

  async function handleSignOut() {
    try {
      await signOut();
      user = null;
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  async function handleSignIn() {
    try {
      await signInWithRedirect();
    } catch (error) {
      console.error('Error signing in:', error);
    }
  }
</script>

{#if loading}
  <div class="auth-loading">Cargando...</div>
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