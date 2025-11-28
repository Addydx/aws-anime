<script>
	import favicon from '$lib/assets/favicon.svg';
	// import '../lib/amplifyConfig.js'; // Activar después de configurar en consola web

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} /> <!-- aqui se coloca un logo de svelte -->
</svelte:head>

{@render children()}
