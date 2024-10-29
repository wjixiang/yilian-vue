<template>
  <div class="font-sans">
    <div class="tree-item">
      <div
        class="flex items-center gap-1 cursor-pointer py-1 hover:bg-gray-100 rounded"
        @click="toggleExpand"
      >
        <svg
          v-if="hasChildren"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          :class="[
            'transition-transform duration-200',
            { 'rotate-90': isExpanded }
          ]"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>

        <svg 
        v-if="isClass"
        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-text"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/><path d="M8 11h8"/><path d="M8 7h6"/></svg>
        
        <svg 
        v-if="isTest"
        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
        
        <span class="select-none">{{ node.title }}</span>
      </div>
      
      <div
        v-if="hasChildren"
        :class="[
          'ml-6 overflow-hidden transition-all duration-200',
          isExpanded ? 'opacity-100' : 'max-h-0 opacity-0'
        ]"
      >
        <component
          :is="$options.name"
          v-for="child in node.children"
          :key="child.id"
          :node="child"
          :depth="depth+1"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexItem',
  props: {
    node: {
      type: Object,
      required: true,
      default: () => ({
        id: '',
        title: '',
        children: []
      })
    },
    depth:{
      type:Number,
      default:0
    }
  },
  data() {
    return {
      isExpanded: true
    }
  },
  computed: {
    hasChildren() {
      return this.node.children && this.node.children.length > 0
    },
    isClass(){
      return (this.depth==1) 
    },
    isTest(){
      return (this.depth==2) 
    }
  },
  methods: {
    toggleExpand() {
      if (this.hasChildren) {
        this.isExpanded = !this.isExpanded
      }
    }
  }
}
</script>