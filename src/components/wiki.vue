<script setup>
import bookmark from './bookmark.vue';
import doc from './doc.vue';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
const store = useStore()
const DBID = computed(
    ()=>{
        return store.getters.getDBID
    }
) 

</script>

<template>
    <div id="wiki" class="flex h-screen">
        <bookmark />
        <suspense>
            <doc :DBID="DBID"/>
        </suspense>
    </div>
</template>