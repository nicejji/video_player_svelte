<script lang="ts">
	import { fly } from 'svelte/transition';
	import PauseSwitch from '$lib/components/PauseSwitch.svelte';
	import TimeControl from '$lib/components/TimeControl.svelte';
	import QuialityControl from '$lib/components/QuialityControl.svelte';
	import VolumeControl from '$lib/components/VolumeControl.svelte';
	import FullscreenSwitch from '$lib/components/FullscreenSwitch.svelte';
	export let readyState: 0 | 1 | 2 | 3 | 4;
	export let paused: boolean;
	export let currentTime: number;
	export let duration: number;
	export let volume: number;
	export let muted: boolean;
	export let thumbnailSrc: string;
	export let sources: { url: string; label: string }[];
	export let currentSource: { url: string; label: string };
	export let container: HTMLElement;
	export let inFullScreen: boolean;

	let qualityChange = false;
	let savedTime = 0;

	$: if (readyState > 1 && qualityChange) {
		paused = true;
		currentTime = savedTime;
		qualityChange = false;
		paused = false;
	}
</script>

<div class:p-2={!inFullScreen} transition:fly={{ y: 10, duration: 200 }}>
	<div
		class="flex flex-row w-full p-2 variant-glass-surface gap-3 items-center"
		class:rounded-full={!inFullScreen}
	>
		<PauseSwitch bind:paused />
		<TimeControl bind:currentTime {duration} {thumbnailSrc} />
		<QuialityControl
			{sources}
			bind:currentSource
			on:change={() => {
				qualityChange = true;
				savedTime = currentTime;
			}}
		/>
		<VolumeControl bind:volume bind:muted />
		<FullscreenSwitch bind:inFullScreen {container} />
	</div>
</div>
