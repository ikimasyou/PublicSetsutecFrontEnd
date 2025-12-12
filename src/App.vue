<template>
<component :is="currentPage" @logInSuccessMsg = "logInSuccessHandle" :server="server"/>    <!-- 在模板上设置对logInSuccessMsg的监听，若被触发则执行logInSuccessHandle -->
</template>

<script>
import Login from "./components/login/login.vue"
import HomePage from "./components/homepage/homepage.vue"
import ChangePassword from "./components/changePassword/changePassword.vue"
import attendance from "./components/attendance/attendance.vue"
import EventBus from './eventBus.js';



export default {

data(){
  return{
    currentPageName: "", 
    currentPage:"",
    server : "http://localhost:8080"//原本是http://inner.setsu-tech.co.jp:8080
  }
},
mounted() {
            // 监听事件
            EventBus.on('LogOut', this.LogOutHandle);     //在mount阶段监听事件，如果LogOut被触发，则执行LogOutHandle
        },

beforeMount(){
  this.currentPageName = "login"
  this.currentPage = "Login"
  EventBus.off('LogOut', this.LogOutHandle);    //取消对LogOut事件的监听
},
components:{
  Login, 
  HomePage,
  ChangePassword,
},
methods:{
  logInSuccessHandle(){
    console.log("logInSuccessHandle");
    this.currentPageName = "HomePage";
    this.currentPage = "HomePage";
  },
  LogOutHandle(){
    console.log("LogOutHandle");
    this.currentPageName = "login";
    this.currentPage = "Login";
  },
}
}

</script>

<style>

</style>