<script lang="ts">
	export let offset = 1;
	export let position: 'left' | 'right' | 'bottom' | 'top' = 'top';
	export let shown = false;
	export let hide = false;

	let hovered = false;
	$: transformStyles = {
		left: `top: 50%; right: 100%; transform: translateY(-50%) translateX(-${offset}rem)`,
		right: `top: 50%; left: 100%; transform: translateY(-50%) translateX(${offset}rem)`,
		top: `bottom: 100%; left: 50%; transform: translateX(-50%) translateY(-${offset}rem)`,
		bottom: `top: 100%; left: 50%; transform: translateX(-50%) translateY(${offset}rem)`
	};
</script>

<div
	class="relative"
	style={$$props.style}
	on:mouseenter={() => (hovered = true)}
	on:mouseleave={() => (hovered = false)}
>
	<div style={`position: absolute; ${transformStyles[position]}`}>
		{#if (hovered || shown) && !hide}
			<slot name="box" />
		{/if}
	</div>
	<div>
		<slot name="content" />
	</div>
</div>
