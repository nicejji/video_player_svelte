<script lang="ts">
	import { fade } from 'svelte/transition';
	import Range from '$lib/components/Range.svelte';
	import { formatSeconds } from '$lib/utils/utils';

	export let currentTime: number;
	export let thumbnailSrc: string;
	export let duration: number;

	let hoverTime = 0;
</script>

<div class="flex w-full gap-3 items-center">
	<Range
		bind:value={currentTime}
		bind:hoverValue={hoverTime}
		min={0}
		max={duration ?? 0}
		class="w-full"
	>
		<div class="card p-1 gap-1 w-44 flex flex-col items-center" slot="hoverBox" transition:fade>
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
		>{formatSeconds(currentTime)} / {formatSeconds(duration ?? 0)}</span
	>
</div>

<svelte:window
	on:keydown={(e) => {
		switch (e.key) {
			case 'l': {
				duration ?? 0 - currentTime >= 10 ? (currentTime += 10) : (currentTime = duration ?? 0);
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
				duration ?? 0 - currentTime >= 10 ? (currentTime += 10) : (currentTime = duration ?? 0);
				break;
			}
		}
	}}
/>
