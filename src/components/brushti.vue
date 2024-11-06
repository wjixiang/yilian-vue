<template>
    <div class="h-full w-[25%] bg-white">
      <!-- 顶部导航栏 -->
      <nav class="h-14 border-b border-gray-200 flex items-center px-4 bg-white sticky top-0 z-10">
        <div v-if="currentView !== 'navigation'" 
             @click="goBack" 
             class="cursor-pointer mr-4 text-gray-600 hover:text-gray-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span class="ml-1">返回</span>
        </div>
        <h1 class="text-xl font-semibold">{{ pageTitle }}</h1>
      </nav>
  
      <!-- 主要内容区域 -->
      <div class="h-[calc(100%-3.5rem)] overflow-auto">
        <!-- 导航目录视图 -->
        <div v-if="currentView === 'navigation'" class="max-w-3xl mx-auto p-4">
          <div v-for="cls in clsList" 
               :key="cls" 
               class="mb-4">
            <div @click="handleNodeClick(cls)"
                 class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors
                        flex items-center justify-between">
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-3">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>
                </svg>
                <span class="font-medium">{{ cls }}</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>
        </div>
  
        <!-- 章节题目预览 -->
        <div v-else-if="currentView === 'chapter'" class="p-4 max-w-5xl mx-auto">  
          <div class="grid grid-cols-1 gap-4">  
            <!-- 使用 v-if 确保 treeData 存在才渲染 -->  
            <testmark    
              v-for="tree in treeData"
              :key="tree.node"
              :node="tree"  
              :depth="0"  
              @node-click="handleTestmarkClick"  
            />  
          </div>  
        </div>  

        <!-- 试题详情视图 -->
        <div v-else-if="currentView === 'question'" class="p-4">
          <div class="max-w-2xl mx-auto">
            <!-- 题型标识 -->
            <div class="mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
                <path d="m15 5 4 4"/>
              </svg>
              <span class="font-bold">题型：</span>
              <span>{{ currentQuestion.type === 'X' ? '多选题' : '单选题' }}</span>
            </div>
  
            <!-- 题目内容 -->
            <div class="mb-6 text-lg">{{ currentQuestion.text }}</div>
  
            <!-- 选项列表 -->
            <div class="space-y-4 mb-6">
              <div v-for="(option, index) in currentQuestion.options"
                   :key="index"
                   @click="selectOption(index)"
                   :class="[
                     'flex items-center p-3 rounded-lg cursor-pointer transition-colors',
                     isOptionSelected(index) ? 'bg-blue-50' : 'hover:bg-gray-50'
                   ]">
                <div :class="[
                  'w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center transition-colors',
                  isOptionSelected(index) ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                ]">
                  <div v-if="isOptionSelected(index)"
                       class="w-2 h-2 rounded-full bg-white">
                  </div>
                </div>
                <span>{{ option }}</span>
              </div>
            </div>
  
            <!-- 提交按钮 -->
            <button @click="submitAnswer"
                    :disabled="isSubmitted || selectedOptions.length === 0"
                    class="w-full py-3 rounded-lg bg-blue-500 text-white font-medium
                           hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed
                           transition-colors">
              提交答案
            </button>
  
            <!-- 答案解析 -->
            <div v-if="isSubmitted"
                 class="mt-6 p-4 bg-gray-50 rounded-lg space-y-4">
              <div class="flex items-center">
                <span class="font-bold mr-2">正确答案：</span>
                <span>{{ currentQuestion.answer }}</span>
              </div>
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>
                  <path d="M8 11h8"/>
                  <path d="M8 7h6"/>
                </svg>
                <span class="font-bold mr-2">课本出处：</span>
                <span>{{ currentQuestion.source }}</span>
              </div>
              <div>
                <div class="font-bold mb-2">试题解析：</div>
                <p class="text-gray-700">{{ currentQuestion.explanation }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import instance from '../myaxios';
  import testmark from './testmark.vue';
  
  // 状态管理
  const currentView = ref('navigation');
  const pageTitle = ref('在线题库');
  const clsList = ref([])
  const treeData = ref(null);
  const chapterQuestions = ref([]);
  const currentQuestion = ref(null);
  const selectedOptions = ref([]);
  const isSubmitted = ref(false);
  const currentNode = ref(null);
  
  // 获取章节数据
  const fetchBookmarks = async () => {
    try {
      const response = await instance.get('/api/quiz/index/source/1');
      clsList.value = response.data.unitList;
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  };
  
  // 处理节点点击
  const handleNodeClick = async (node) => {
    try {
      console.log(node)
      currentNode.value = node;
      const response = await instance.get(`/api/quiz/index/cls/${node}`);
      chapterQuestions.value = response.data;
      console.log(response.data)
      currentView.value = 'chapter';
      pageTitle.value = node;

      treeData.value = response.data.children

    } catch (error) {
      console.error('Error fetching chapter questions:', error);
    }
  };
  
  // 选择题目
  const selectQuestion = (question, index) => {
    currentQuestion.value = question;
    currentView.value = 'question';
    pageTitle.value = `题目 ${index + 1}`;
    selectedOptions.value = [];
    isSubmitted.value = false;
  };
  
  // 选择选项
  const selectOption = (index) => {
    if (isSubmitted.value) return;
  
    if (currentQuestion.value.type === 'X') {
      // 多选题
      const optionIndex = selectedOptions.value.indexOf(index);
      if (optionIndex === -1) {
        selectedOptions.value.push(index);
      } else {
        selectedOptions.value.splice(optionIndex, 1);
      }
    } else {
      // 单选题
      selectedOptions.value = [index];
    }
  };
  
  // 检查选项是否被选中
  const isOptionSelected = (index) => {
    return selectedOptions.value.includes(index);
  };
  
  // 提交答案
  const submitAnswer = () => {
    isSubmitted.value = true;
  };
  
  // 返回上一级
  const goBack = () => {
    if (currentView.value === 'question') {
      currentView.value = 'chapter';
      pageTitle.value = currentNode.value.title;
      selectedOptions.value = [];
      isSubmitted.value = false;
      currentQuestion.value = null;
    } else if (currentView.value === 'chapter') {
      currentView.value = 'navigation';
      pageTitle.value = '在线题库';
      chapterQuestions.value = [];
      currentNode.value = null;
    }
  };
  
  onMounted(fetchBookmarks);
  </script>