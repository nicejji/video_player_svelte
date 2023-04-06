<script lang="ts">
	import FloatingBox from '$lib/components/UI/FloatingBox.svelte';

	export let vertical = false;
	export let value = 0;
	export let hoverValue: number;
	export let min: number;
	export let max: number;
	export let color:
		| 'primary'
		| 'secondary'
		| 'tertiary'
		| 'success'
		| 'warning'
		| 'error'
		| 'surface' = 'primary';

	let range: HTMLDivElement;
	let beforeLine: HTMLDivElement;

	let mousePressed = false;
	let hovered = false;

	$: percent = Math.round(((value - min) / (max - min)) * 100);
	$: hoverPercent = Math.round(((hoverValue - min) / (max - min)) * 100);

	const onChange = (e: MouseEvent | TouchEvent, click = false) => {
		e.preventDefault(); // safari fix
		let calculatedValue;
		if (vertical) {
			const { bottom } = range.getBoundingClientRect();
			const posY = (e as TouchEvent)?.touches
				? (e as TouchEvent).touches[0].clientY
				: (e as MouseEvent).clientY;
			const offset = Math.max(Math.min(Math.round(bottom - posY), range.clientHeight), 0);
			calculatedValue = min + (max - min) * (offset / range.clientHeight);
		} else {
			const posX = (e as TouchEvent)?.touches
				? (e as TouchEvent).touches[0].clientX
				: (e as MouseEvent).clientX;
			const { left } = range.getBoundingClientRect();
			const offset = Math.max(Math.min(Math.round(posX - left), range.clientWidth), 0);
			calculatedValue = min + (max - min) * (offset / range.clientWidth);
		}
		hoverValue = calculatedValue;
		if (click || mousePressed || (e as TouchEvent)?.touches) {
			value = calculatedValue;
			if (!click) {
				vertical
					? beforeLine.classList.remove('height_transition')
					: beforeLine.classList.remove('width_transition');
			} else {
				vertical
					? beforeLine.classList.add('height_transition')
					: beforeLine.classList.add('width_transition');
			}
		}
	};
</script>

<div
	bind:this={range}
	class={`relative select-none cursor-pointer flex ${
		vertical ? 'flex-col-reverse' : ''
	} items-center h-3 w-3 rounded-full bg-opacity-80 variant-glass-surface ${$$props.class}`}
	on:click={(e) => onChange(e, true)}
	on:mouseenter={() => {
		hovered = true;
	}}
	on:mouseleave={() => {
		hovered = false;
	}}
	on:mousemove={onChange}
	on:touchmove|preventDefault={onChange}
	on:mousedown={() => (mousePressed = true)}
	on:keydown={(e) => {
		alert(e);
	}}
>
	{#if !mousePressed}
		<FloatingBox
			position={vertical ? 'left' : 'top'}
			style={`position: absolute; left: ${hoverPercent}%`}
			shown={hovered}
		>
			<slot name="hoverBox" slot="box" />
			<div slot="content" class="h-3 w-3" />
		</FloatingBox>
	{/if}
	<div
		bind:this={beforeLine}
		class={`select-none cursor-pointer ${vertical ? 'w-full' : 'h-full'} rounded-full`}
		style={`${
			vertical ? 'height' : 'width'
		}: ${percent}%; --tw-bg-opacity: 1; background-color: rgb(var(--color-${color}-500) / var(--tw-bg-opacity))`}
	/>
	<FloatingBox position={vertical ? 'left' : 'top'} shown={hovered}>
		<slot name="box" slot="box" />
		<span
			slot="content"
			class={`${!vertical ? '-mx-2' : '-my-2'} select-none cursor-pointer badge-icon`}
			style={`--tw-bg-opacity: 1; background-color: rgb(var(--color-${color}-500) / var(--tw-bg-opacity)); color: rgb(var(--on-${color})); --tw-bg-opacity: 1; background-color: rgb(var(--color-${color}-500) / var(--tw-bg-opacity)); color: rgb(var(--on-${color}));`}
		/>
	</FloatingBox>
</div>

<svelte:window
	on:mouseup={() => {
		mousePressed = false;
	}}
	on:mousemove={(e) => (mousePressed ? onChange(e) : 0)}
/>

<style>
	.width_transition {
		transition: width 0.2s 0s ease-out;
	}
	.height_transition {
		transition: height 0.2s 0s ease-out;
	}
</style>
