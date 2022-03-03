<template>
  <SideBar />
  <HeaderComponent />
  <router-view />
</template>

<script setup lang="ts">
import SideBar from '@/components/SideBar/index.vue'
import HeaderComponent from '@/components/HeaderComponent/index.vue'
</script>
