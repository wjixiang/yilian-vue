<script setup>
    import { mapState,mapActions,useStore} from 'vuex';
    import { ref, onMounted, computed } from 'vue';  

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
    const store = useStore()
    const inputDBID = ref('')
    const changeDBID = ()=>{
        if (inputDBID.value) {  
        store.dispatch('updateDBID', inputDBID.value); // 调用 Vuex action 更新 DBID  
        inputDBID.value = ''; // 重置输入框  
        }
        // DBID.value = "670e3bfa7f4b0b1583fc4127"
    }
    // Fetch bookmarks when component is mounted  
    onMounted(fetchBookmarks);  

    

</script>

<template>
    <div class="site-body-left-colmun">
        <div id="bookmark-section">
            <input v-model="inputDBID" placeholder="输入新的 DBID" />
            <button @click="changeDBID" class="border-amber-800 border-x-4">submit</button>
            <ul>  
                <li v-for="bookmark in bookmarks" :key="bookmark.id">  
                  <a :href="bookmark.url" target="_blank">{{ bookmark.title }}</a>  
                </li>  
              </ul>
        </div>
    </div>
</template>