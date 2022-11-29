/*
 * @Description:
 * @Author: zhongweibin
 * @Date: 2021-07-14 18:31:52
 * @LastEditTime: 2021-11-03 10:13:19
 * @LastEditors: zhongweibin
 * @Reference:
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'hash',
  routes,
});
