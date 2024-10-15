<script setup>
    // import { BookmarkPlus } from 'lucide-vue-next';
    // import { FolderPlus } from 'lucide-vue-next';
    // import { ChevronsUpDown } from 'lucide-vue-next';

    import { ref, onMounted } from 'vue';  

    const bookmarks = ref([]);  

    // Fetch bookmarks from API  
    const fetchBookmarks = async () => {  
    try {  
        const response = await fetch('http://localhost:3000/api/bookmarks');  
        console.log(response)
        bookmarks.value = await response.json();  
    } catch (error) {  
        console.error('Error fetching bookmarks:', error);  
    }  
    };  

    // Fetch bookmarks when component is mounted  
    onMounted(fetchBookmarks);  

</script>

<template>
    <div class="site-body-left-colmun">
        <!-- <div id="bookmark-tool" class="flex justify-around w-full h-auto px-3">
            <BookmarkPlus class="bookmark-tool"/>
            <FolderPlus class="bookmark-tool"/>
            <ChevronsUpDown class="bookmark-tool"/>
        </div> -->


        <div id="bookmark-section">
            <ul>  
                <li v-for="bookmark in bookmarks" :key="bookmark.id">  
                  <a :href="bookmark.url" target="_blank">{{ bookmark.title }}</a>  
                </li>  
              </ul>
        </div>
    </div>
</template>