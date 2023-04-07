<script lang="ts">
	import FloatingBox from '$lib/components/UI/FloatingBox.svelte';
	import { horizontalPercent, isTouchEvent, verticalPercent } from '$lib/utils/utils';
	import { onMount } from 'svelte';

	export let vertical = false;
	export let value: number;
	export let hoverValue: number;
	export let min: number;
	export let max: number;
	export let color = 'primary';
	export let boxOffset = 0.5;

	let range: HTMLDivElement;
	let beforeLine: HTMLDivElement;

	let mousePressed = false;
	let hovered = false;

	$: percent = (min + value) / (max - min);
	let hoverPercent = 0;

	const onChange = (e: MouseEvent | TouchEvent, click = false) => {
		hoverPercent = vertical ? verticalPercent(range, e) : horizontalPercent(range, e);
		hoverValue = min + (max - min) * hoverPercent;
		if (click || mousePressed || isTouchEvent(e)) {
			value = hoverValue;
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

	onMount(() => {
		vertical
			? beforeLine.classList.add('height_transition')
			: beforeLine.classList.add('width_transition');
	});
</script>

<div
	bind:this={range}
	class={`relative select-none cursor-pointer flex ${
		vertical ? 'flex-col-reverse' : ''
	} items-center h-3 w-3 rounded-full bg-opacity-80 variant-glass-surface ${$$props.class}`}
	on:click={(e) => onChange(e, true)}
	on:mouseenter={() => (hovered = true)}
	on:mouseleave={() => (hovered = false)}
	on:mousemove={onChange}
	on:touchmove={onChange}
	on:mousedown={() => (mousePressed = true)}
	on:keydown={(e) => {
		alert(e);
	}}
>
	<div
		bind:this={beforeLine}
		class={`select-none cursor-pointer ${vertical ? 'w-full' : 'h-full'} rounded-full`}
		style={`${vertical ? 'height' : 'width'}: ${Math.round(
			percent * 100
		)}%; --tw-bg-opacity: 1; background-color: rgb(var(--color-${color}-500) / var(--tw-bg-opacity))`}
	/>
	<FloatingBox
		position={vertical ? 'left' : 'top'}
		shown={hovered || mousePressed}
		offset={boxOffset}
	>
		<slot name="box" slot="box" />
		<span
			slot="content"
			class={`${!vertical ? '-mx-2' : '-my-2'} select-none cursor-pointer badge-icon`}
			style={`--tw-bg-opacity: 1; background-color: rgb(var(--color-${color}-500) / var(--tw-bg-opacity)); color: rgb(var(--on-${color})); --tw-bg-opacity: 1; background-color: rgb(var(--color-${color}-500) / var(--tw-bg-opacity)); color: rgb(var(--on-${color}));`}
		/>
	</FloatingBox>
	<FloatingBox
		position={vertical ? 'left' : 'top'}
		offset={boxOffset}
		style={`position: absolute; ${vertical ? 'bottom' : 'left'}: ${Math.round(
			hoverPercent * 100
		)}%`}
		shown={hovered}
		hide={mousePressed}
	>
		<slot name="hoverBox" slot="box" />
		<div slot="content" class="h-3 w-3" />
	</FloatingBox>
</div>

<svelte:window
	on:mouseup={() => (mousePressed = false)}
	on:mousemove|preventDefault={(e) => (mousePressed ? onChange(e) : 0)}
/>

<style>
	.width_transition {
		transition: width 0.2s 0s ease-out;
	}
	.height_transition {
		transition: height 0.2s 0s ease-out;
	}
</style>
