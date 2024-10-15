<script setup>
import { ref,defineProps } from 'vue';
const props = defineProps({
    tooltipText: {
        type:String,
        default:"tooltip-Text"
    }
})
</script>

<template>
    <!-- <div class="flex"> -->
        <div class="sidebar-icon group">
            <slot></slot>
            <span class="sidebar-tooltip group-hover:scale-100">{{tooltipText}}</span>
        </div>
    <!-- </div> -->
</template>