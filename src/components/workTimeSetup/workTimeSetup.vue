<template>
    <h2>
        勤務時間の初期設定
    </h2>
 <div class="content">
   <h3>案件名:{{caseName}}</h3>
   <div>
     出勤时间:<span style="color: red">*</span>
   </div>
   <div>
     <el-time-select
         v-model="workTime"
         class="inputbox"
         start="06:30"
         step="00:15"
         end="18:30"
         placeholder="時間を選んでください"
     />
   </div>
   <!-- 除了mounted后获取个caseName，没有任何设定 -->
   <div style="margin-top: 20px">
     退勤时间:<span style="color: red">*</span>
   </div>
   <div >
     <el-time-select
         v-model="offWorkTime"
         class="inputbox"
         start="06:30"
         step="00:15"
         end="23:30"
         placeholder="時間を選んでください"
     />
   </div>
   <div style="margin-top: 20px">
     休憩時間(昼間):<span style="color: red">*</span>
   </div>
   <div >
     <el-time-select
         v-model="breakday"
         class="inputbox"
         start="06:30"
         step="00:15"
         end="18:30"
         placeholder="時間を選んでください"
     />
   </div>
   <div style="margin-top: 20px">
     休憩時間(昼間):<span style="color: red">*</span>
   </div>
   <div >
     <el-time-select
         v-model="breaknight"
         class="inputbox"
         start="06:30"
         step="00:15"
         end="18:30"
         placeholder="時間を選んでください"
     />
   </div>
   <div>
     <el-button type="primary" style="width: 40%; margin-left: 20%;margin-top: 50px">登録</el-button>
   </div>
 </div>

</template>

<script>
import axios from "axios";

export default {
  data(){
    return{
      test:"ssswwww",
      caseName:"",
      workTime:"",
      offWorkTime:"",
      breakday:"",
      breaknight:""
    }
  },
  methods:{
   async getdata(){
      this.caseName = (await axios.get(this.$server + '/anken/getAnkenName?userId=' + sessionStorage.getItem("userId"))).data;

    }
  },
  mounted() {
    this.getdata()

  }
}

</script>

<style scoped>
.content{
  margin-left: 70px;
  background-color: transparent;
}
h3{
  color: gray;
}
.inputbox{

  width: 80%;
  height: 25px;
  border-radius: 2px;
  border: transparent;
  margin-top: 20px;
}
</style>