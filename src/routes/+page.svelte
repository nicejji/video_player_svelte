<script>
	import VideoControls from '$lib/components/VideoControls.svelte';
</script>

<div class="flex w-full h-full justify-center items-center">
	<VideoControls
		class="w-[1000px]"
		title="Brawl Stars Trailer"
		sources={[
			{ label: '720p', url: '/video720.webm' },
			{ label: '360p', url: '/video360.webm' },
			{ label: '144p', url: '/video144.webm' }
		]}
		thumbnailSrc="/video144.webm"
		poster="/poster.jpg"
	/>
</div>
