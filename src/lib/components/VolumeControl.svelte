<script lang="ts">
	import 'iconify-icon';
	import { fade } from 'svelte/transition';
	import FloatingBox from '$lib/components/UI/FloatingBox.svelte';
	import Range from '$lib/components/Range.svelte';
	export let volume: number;
	export let muted: boolean;
</script>

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
		on:click={() => ((volume = muted ? 0.7 : 0), (muted = !muted))}
	>
		<iconify-icon icon={muted ? 'ic:round-volume-up' : 'ic:round-volume-off'} />
	</button>
</FloatingBox>
