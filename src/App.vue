<script setup>
import SideBar from './components/toolbar.vue';
import wiki from './components/wiki.vue';
import logo from './components/logo.vue';
import search from './components/search.vue';
import brushti from './components/brushti.vue';

</script>

<template>
    <div class="w-screen h-screen">
        <div id="head" class="border-b-2 border-b-gray-200 h-14 items-center flex bg-primary">
            <logo />
            <search />
        </div> 
    
        <div class="flex h-full" id="root">
            <SideBar />
            <brushti />
            <wiki />
        </div>
    </div>
</template>>

<style scoped>

</style>