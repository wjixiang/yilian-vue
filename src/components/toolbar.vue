
<script setup>
import sideicon from './toolbarIcon.vue'
import { BookOpenText } from 'lucide-vue-next';
import { Sticker } from 'lucide-vue-next';
import { NotepadText } from 'lucide-vue-next';
import logo from '@/assets/logo.svg'
// const logos = ref(logo)


</script>

<template>
    <div class="top-0 left-0 h-screen w-12 m-0 flex flex-col bg-gray-100 text-black shadow-lg">
        <sideicon tooltipText="Wiki/笔记仓库">
            <BookOpenText />
        </sideicon>

        <sideicon tooltipText="FLASHCARDS/闪卡">
            <Sticker />
        </sideicon>

        <sideicon tooltipText="QUIZ/刷题">
            <NotepadText />
        </sideicon>

    </div>
      
</template>

<style>

</style>