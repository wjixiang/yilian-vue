<script setup>
import SideBar from './components/toolbar.vue';
import wiki from './components/wiki.vue';
import logo from './components/logo.vue';

</script>

<template>
    <div>
        <div id="head" class="border-b-2 border-b-gray-200 h-14 items-center flex bg-primary">
            <logo />
    
        </div> 
    
        <div class="flex" id="root">
            <SideBar />
            <wiki />
        </div>
    </div>
</template>>

<style scoped>

</style>