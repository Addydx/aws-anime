<script>
	import favicon from '$lib/assets/favicon.svg';
	import '../lib/amplifyConfig.js'; // Inicializar Amplify

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
