<script setup>
import doc from './doc.vue';
import { computed} from 'vue';
import { useStore } from 'vuex';
const store = useStore()
const DBID = computed(
    ()=>{
        return store.getters.getDBID
    }
) 

</script>

<template>
    <div id="wiki" class="flex-1 h-screen w-auto">
        <!-- <bookmark /> -->
        <suspense>
            <doc :DBID="DBID"/>
        </suspense>
    </div>
</template>