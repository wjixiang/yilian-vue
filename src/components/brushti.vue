<script setup>
import { onMounted } from 'vue';
import indexitem from './testmark.vue';
import { ref } from 'vue';
import instance from '../myaxios'

const treeData = ref(null)
const fetchBookmarks = async () => {  
    try {  
        const response = await instance.get('/api/bookmarks');  
        treeData.value = response.data
        console.log(response.data)
    } catch (error) {  
        console.error('Error fetching bookmarks:', error);  
    }  
    };  

    // Fetch bookmarks when component is mounted  

    onMounted(fetchBookmarks)

</script>

<template>
    <div class="w-[400px] border-r-2 h-full">
        <div id="test-control">

        </div>
        <div id="test-select" class="overflow-auto h-full">
            <indexitem v-for="tree in treeData" :key="tree.id" :node="tree"/>
        </div>
    </div>
    
</template>

<style lang="css" scoped>
</style>
