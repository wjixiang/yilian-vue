<script setup>
    import { mapState,mapActions,useStore} from 'vuex';
    import { ref } from 'vue';

    const store = useStore()
    const inputDBID = ref('')
    const changeDBID = ()=>{
        if (inputDBID.value) {  
        store.dispatch('updateDBID', inputDBID.value); // 调用 Vuex action 更新 DBID  
        inputDBID.value = ''; // 重置输入框  
        }
        // DBID.value = "670e3bfa7f4b0b1583fc4127"
    }
</script>

<template>
    <input v-model="inputDBID" placeholder="输入新的 DBID" />
    <button @click="changeDBID" class="border-amber-800 border-x-4">submit</button>
</template>