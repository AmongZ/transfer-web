<!--
 * @Description: 
 * @Author: zhongweibin
 * @Date: 2021-06-30 19:23:25
 * @LastEditTime: 2021-11-03 10:13:39
 * @LastEditors: zhongweibin
 * @Reference: 
-->
<template>
  <div id="app">
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'App',
  };
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 10px;
  }
</style>
