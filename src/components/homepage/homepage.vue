<template>
  <TopBar @changePage = "changePageHandle"/>
  <div class="body">
    <div class="sidebar">
        <Navigation @changePage = "changePageHandle"/>
    </div>
    
    <div class="content">
      
      <component :is="mainContent" @changePage = "changePageHandle"/>
      <!-- 页面的主要内容放在这里 -->
    </div>
</div>
</template>

<script>
import TopBar from "../topbar/topbar.vue";
import Navigation from "../navigation/navigation.vue"
import Attendance from "../attendance/attendance.vue"
import WorkTimeSetup from "../workTimeSetup/workTimeSetup.vue"
import WorkManual from "../workManual/workManual.vue"
import TransportationFeeSubmit from "../transportationFeeSubmit/transportationFeeSubmit.vue"
import MyTransportationFeeList from "../transportationFeeList/MyTransportationFeeList.vue";
import SendMessage from "../sendMessage/sendMessage.vue"
import TransportationFeeList from "../transportationFeeList/TransportationFeeList.vue"
import WorkRecord from "../workRecord/workRecord.vue"
import ChangePassword from "../changePassword/changePassword.vue"
import EventBus from '../../eventBus.js';
import SkillSubmit from "../skill/SkillSubmit.vue";
import BPInfo from "../dbManager/BPInfo.vue";
import BPResume from "../dbManager/BPResume.vue";

export default {
  data(){
    return{
      mainContent: "", 
      last_mainContent: "",
    }
  }, 
  components: {
    TopBar,
    Navigation,
    Attendance,
    WorkRecord,
    WorkTimeSetup,
    WorkManual,
    TransportationFeeSubmit,
    SendMessage,
    TransportationFeeList,
    ChangePassword,
    MyTransportationFeeList,
    SkillSubmit,
    BPInfo,
    BPResume
  },
  beforeMount(){
    this.mainContent = "Attendance",
    this.last_mainContent = "Attendance"
  },
  mounted(){
    EventBus.on('ChangePassword', this.ChangePasswordHandle);
  },
  methods:{
    changePageHandle(pageName){
      console.log("homepage changePageHandle, pageName = ", pageName);
      if (pageName != "last"){
        this.last_mainContent = this.mainContent;
        this.mainContent = pageName; 
      } else{
        this.mainContent = this.last_mainContent;
      }
      
    },
    ChangePasswordHandle(){
      console.log("EventBus.on('ChangePassword', this.ChangePasswordHandle);");
      this.changePageHandle("ChangePassword");
    },
  }
};


</script>

<style>
.sidebar {
    width: 220px;
    overflow:clip;
    border-radius: 10px;
    height: 100%;
    background-color: white;
    /* overflow: visible;  */
    padding-top: 20px;
}


.body{
  display: flex;
  height: 100%;
  overflow: visible;
  /* flex-direction: column; */
}

.content{
  /* white-space: nowrap; 避免影响后续布局，暂时去掉 */ 
  flex:1;
  background-color: rgba(255, 255, 255, 0.7);
  width: 100%;
  border-radius: 10px;
}

</style>