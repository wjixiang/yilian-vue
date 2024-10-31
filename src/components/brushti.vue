<template>
    <div class="h-full flex w-[40%]">
        <!-- 左侧导航树 -->  
        <div class="w-[300px] border-r border-gray-200 h-full flex flex-col bg-white shadow-sm">  
            <div class="h-14 border-b border-gray-200 flex items-center px-6 bg-white">  
            <h1 class="text-xl font-semibold text-gray-800">题库目录</h1>  
            </div>  
            <div class="flex-1 overflow-auto p-4">  
            <indexitem   
                v-for="tree in treeData"   
                :key="tree.id"   
                :node="tree"  
                @nodeClick="handleNodeClick"  
            />  
            </div>  
        </div> 
    
      <!-- 右侧内容区域 -->
      <div class="flex-1 flex flex-col h-full">
        <!-- 顶部导航栏 -->
        <nav class="h-14 border-b-2 flex items-center px-4 bg-white">
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
        <div class="flex-1 overflow-auto">
          <!-- 章节预览界面 -->
          <div v-if="currentView === 'chapter'" class="p-8">  
            <div class="grid grid-cols-5 gap-6">  
              <div v-for="(question, index) in chapterQuestions"   
                   :key="index"  
                   @click="selectQuestion(question, index)"  
                   class="aspect-square rounded-xl bg-white border border-gray-200 hover:border-blue-500   
                          flex items-center justify-center cursor-pointer   
                          text-lg font-medium transition-all duration-200 hover:shadow-md">  
                {{ index + 1 }}  
              </div>  
            </div>  
          </div> 
  
          <!-- 试题页面 -->
          <div v-else-if="currentView === 'question'" class="p-6">
            <div class="max-w-2xl mx-auto">
              <!-- 题型 -->
              <div class="mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                  <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
                  <path d="m15 5 4 4"/>
                </svg>
                <span class="font-bold">题型：</span>
                <span>{{ currentQuestion.type === 'X' ? '多选题' : '单选题' }}</span>
              </div>
  
              <!-- 题目 -->
              <div class="mb-6 text-lg">{{ currentQuestion.text }}</div>
  
              <!-- 选项 -->
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
  
              <!-- 答案反馈区域 -->
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
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import indexitem from './testmark.vue';
  import instance from '../myaxios';
  
  // 状态管理
  const currentView = ref('navigation');
  const pageTitle = ref('在线题库');
  const treeData = ref(null);
  const chapterQuestions = ref([]);
  const currentQuestion = ref(null);
  const selectedOptions = ref([]);
  const isSubmitted = ref(false);
  const currentNode = ref(null);
  const components = {  
  indexitem: indexitem  
};  
  // 获取章节数据
  const fetchBookmarks = async () => {
    try {
      const response = await instance.get('/api/bookmarks');
      treeData.value = response.data;
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  };
  
  // 处理节点点击
  const handleNodeClick = async (node) => {
    console.log("handleNodeClick triggered", node); // 添加调试输出  
        try {
        // 这里需要根据你的API调整请求路径
        console.log(node.title)
        const response = await instance.get(`/api/chapter/${node.title}/questions`);
        chapterQuestions.value = response.data;
        currentView.value = 'chapter';
        pageTitle.value = node.title;
        return node
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

