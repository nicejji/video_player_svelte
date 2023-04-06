<script lang="ts">
	export let position: 'left' | 'right' | 'bottom' | 'top' = 'top';
	export let shown = false;
	export let style = '';

	let hovered = false;
	$: transformClasses = {
		left: `top-[50%] right-[100%] translate-y-[-50%] translate-x-[-10px]`,
		right: `top-[50%] left-[100%] translate-y-[-50%] translate-x-[10px]`,
		top: `bottom-[100%] left-[50%] translate-x-[-50%] translate-y-[-10px]`,
		bottom: `top-[100%] left-[50%] translate-x-[-50%] translate-y-[10px]`
	};

	$: currentClass = `absolute ${transformClasses[position]} ${$$props.class || ''}`;
</script>

<div
	class="relative"
	{style}
	on:mouseenter={() => (hovered = true)}
	on:mouseleave={() => (hovered = false)}
>
	<div class={currentClass}>
		{#if hovered || shown}
			<slot name="box" />
		{/if}
	</div>
	<div>
		<slot name="content" />
	</div>
</div>
