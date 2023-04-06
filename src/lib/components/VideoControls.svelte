<script lang="ts">
	import 'iconify-icon';
	import { fly, fade } from 'svelte/transition';
	import FloatingBox from '$lib/components/UI/FloatingBox.svelte';
	import Range from '$lib/components/Range.svelte';
	import { formatSeconds } from '$lib/utils/utils';

	export let title: string;

	export let poster: string;
	export let thumbnailSrc: string;

	export let sources: { label: string; url: string }[];

	let currentSource = sources[0];

	$: src = currentSource.url;

	let duration = 0;
	let currentTime = 0;
	let paused = true;
	let muted = true;
	let volume = 1;
	let ended = false;
	let readyState: 0 | 1 | 2 | 3 | 4;

	$: console.log(readyState ?? 'nothing');

	let hoverTime = 0;

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

	const enterFS = () => {
		const box = container as any;
		const enter = box.requestFullscreen ?? box.webkitRequestFullscreen ?? box.msRequestFullScreen;
		enter.apply(box);
	};

	const exitFS = () => {
		const doc = document as any;
		const exit =
			doc.exitFullscreen ??
			doc.mozCancelFullScreen ??
			doc.webkitExitFullscreen ??
			doc.msExitFullscreen;
		exit.apply(doc);
	};
</script>

<div
	class={`relative h-fit overflow-clip ${$$props.class}`}
	class:rounded-xl={!inFullScreen}
	bind:this={container}
	on:mousemove={onMouseMove}
	on:mouseleave={onMouseLeave}
	on:focus={() => {}}
>
	<video
		class="w-full h-full bg-black"
		{src}
		{poster}
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
	{#if showControls || paused}
		<div class="absolute top-0 flex flex-col w-full h-full justify-between">
			<div class="flex p-7 bg-gradient-to-b from-black w-full z-10" transition:fade>
				<span class="font-bold text-xl">{title}</span>
			</div>
			<div
				class="flex justify-center items-center w-full h-full"
				on:click={() => (paused = !paused)}
				on:keydown={() => {}}
			>
				{#if paused || ended}
					<button class="btn btn-icon-xl variant-filled-primary z-10" transition:fade>
						<iconify-icon
							class="text-3xl"
							icon={ended
								? 'material-symbols:replay-rounded'
								: 'material-symbols:play-arrow-rounded'}
						/>
					</button>
				{/if}
			</div>
			<div class:p-2={!inFullScreen} transition:fly={{ y: 10, duration: 200 }}>
				<div
					class:rounded-full={!inFullScreen}
					class="flex flex-row w-full p-2 variant-glass-surface gap-3 items-center"
				>
					<button class="btn btn-icon variant-glass-surface" on:click={() => (paused = !paused)}>
						<iconify-icon
							class="text-xl"
							icon={paused
								? 'material-symbols:play-arrow-rounded'
								: 'material-symbols:pause-rounded'}
						/>
					</button>
					<Range
						bind:value={currentTime}
						bind:hoverValue={hoverTime}
						min={0}
						max={duration}
						class="w-full"
					>
						<div
							class="card p-1 gap-1 w-44 flex flex-col items-center"
							slot="hoverBox"
							transition:fade
						>
							<video src={thumbnailSrc} muted={true} bind:currentTime={hoverTime} paused={true}>
								<track kind="captions" />
							</video>
							<span class="text-xs">{formatSeconds(hoverTime)}</span>
						</div>
						<div slot="box" class="card p-1" transition:fade>
							<span class="text-sm">{formatSeconds(currentTime)}</span>
						</div>
					</Range>
					<span class="whitespace-nowrap text-sm"
						>{formatSeconds(currentTime)} / {formatSeconds(duration)}</span
					>
					<FloatingBox>
						<button class="btn btn-icon variant-glass-surface" slot="content" on:click={() => {}}>
							<iconify-icon icon={'material-symbols:grid-view-rounded'} />
						</button>
						<div
							class="card p-4 variant-glass-surface flex flex-col items-center gap-3"
							slot="box"
							transition:fade
						>
							{#each sources as source}
								<button
									class="btn btn-sm"
									class:variant-filled-secondary={currentSource === source}
									class:variant-glass-surface={currentSource !== source}
									on:click={() => {
										currentSource = source;
									}}>{source.label}</button
								>
							{/each}
						</div>
					</FloatingBox>
					<FloatingBox>
						<div
							class="card p-4 variant-glass-surface flex flex-col items-center gap-3"
							slot="box"
							transition:fade
						>
							<Range
								bind:value={volume}
								hoverValue={0}
								min={0}
								max={1}
								color="tertiary"
								class="h-32"
								vertical={true}
							>
								<div slot="box" class="card p-1" transition:fade>
									<span class="text-sm whitespace-nowrap">{Math.round(volume * 100)} %</span>
								</div>
							</Range>
						</div>
						<button
							slot="content"
							class="btn btn-icon"
							class:variant-filled-tertiary={muted}
							class:variant-glass-surface={!muted}
							on:click={() => (muted = !muted)}
						>
							<iconify-icon icon={muted ? 'ic:round-volume-up' : 'ic:round-volume-off'} />
						</button>
					</FloatingBox>
					<button
						class="btn btn-icon variant-glass-surface"
						on:click={inFullScreen ? exitFS : enterFS}
					>
						<iconify-icon
							icon={inFullScreen
								? 'material-symbols:fullscreen-exit-rounded'
								: 'material-symbols:fullscreen-rounded'}
						/>
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>

<svelte:window
	on:fullscreenchange={() => (inFullScreen = !inFullScreen)}
	on:keydown={(e) => {
		switch (e.key) {
			case ' ': {
				paused = !paused;
				break;
			}
			case 'f': {
				inFullScreen ? exitFS() : enterFS();
				break;
			}
			case 'l': {
				duration - currentTime >= 10 ? (currentTime += 10) : (currentTime = duration);
				break;
			}
			case 'j': {
				currentTime >= 10 ? (currentTime -= 10) : (currentTime = 0);
				break;
			}
			case 'ArrowLeft': {
				currentTime >= 10 ? (currentTime -= 10) : (currentTime = 0);
				break;
			}
			case 'ArrowRight': {
				duration - currentTime >= 10 ? (currentTime += 10) : (currentTime = duration);
				break;
			}
		}
	}}
/>
