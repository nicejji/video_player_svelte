<script lang="ts">
	import 'iconify-icon';
	import { fade } from 'svelte/transition';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import VideoControls from '$lib/components/VideoControls.svelte';

	export let title: string;
	export let poster: string;
	export let thumbnailSrc: string;
	export let sources: { label: string; url: string }[];

	let currentSource = sources[0];

	$: src = currentSource.url;

	let duration: number;
	let currentTime = 0;
	let paused = true;
	let muted = true;
	let volume = 1;
	let ended = false;
	let readyState: 0 | 1 | 2 | 3 | 4;

	$: volume === 0 ? (muted = true) : (muted = false);

	let container: HTMLDivElement;
	let inFullScreen = false;
	let showControls = false;
	let showControlsTimeout: number;

	const onMouseMove = () => {
		showControls = true;
		if (showControlsTimeout !== undefined) clearTimeout(showControlsTimeout);
		showControlsTimeout = setTimeout(() => (showControls = false), 2500);
	};

	const onMouseLeave = () => {
		showControls = false;
	};
</script>

<div
	class={`relative h-fit overflow-clip ${$$props.class}`}
	class:rounded-xl={!inFullScreen}
	on:mousemove={onMouseMove}
	on:mouseleave={onMouseLeave}
	on:focus={() => {}}
>
	<video
		{src}
		{poster}
		class="w-full h-full bg-black"
		bind:readyState
		bind:duration
		bind:paused
		bind:currentTime
		bind:volume
		bind:muted
		bind:ended
	>
		<track kind="captions" />
	</video>
	{#if (showControls || paused || ended) && readyState}
		<div class="absolute top-0 flex flex-col w-full h-full justify-between">
			<div class="flex p-7 bg-gradient-to-b from-black w-full z-10" transition:fade>
				<span class="font-bold text-xl">{title}</span>
			</div>
			<div
				class="flex justify-center items-center w-full h-full z-10"
				on:click={() => (paused = !paused)}
				on:keydown={() => {}}
			>
				{#if paused || ended || readyState !== 4}
					{#if readyState === 4}
						<button class="btn btn-icon-xl variant-filled-primary z-10" transition:fade>
							<iconify-icon
								class="text-3xl"
								icon={ended
									? 'material-symbols:replay-rounded'
									: 'material-symbols:play-arrow-rounded'}
							/>
						</button>
					{:else}
						<div transition:fade>
							<ProgressRadial meter="stroke-primary-500" width="w-16" stroke={150} />
						</div>
					{/if}
				{/if}
			</div>
			<VideoControls
				bind:paused
				bind:currentTime
				bind:volume
				bind:muted
				bind:currentSource
				bind:inFullScreen
				{duration}
				{sources}
				{thumbnailSrc}
				{container}
			/>
		</div>
	{/if}
</div>
