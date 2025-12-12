<template>
    <div class="title">
        勤務への連絡
    </div>
    <div class="nyuryoku">
      連絡タイトル:<span style="color: red;margin-left: 10px">*</span>
    </div>
  <div>
    <input class="inputbox" v-model="title" />
  </div>


    <div class="renraku">
        連絡内容:<span style="color: red;margin-left: 10px">*</span>
    </div>
  <div>
    <textarea class="inputbox2" v-model="message"></textarea>
  </div>
  <div class="buttonbox">
    <button @click="sendmessage">登録</button>
  </div>

</template>
<!-- 这里也是完全没有任何功能实现 -->
<script>
import axios from 'axios';
export default {
  data(){
   return{
     title:"",
     message:""
   }
  },
  methods:{
    sendmessage(){
      if (this.title.length==0||this.message.length==0){
        alert("必要なメッセージを入力してください。")
      }
      else{
        axios.post(this.$server+"/mail/mailTo",{title:this.title,message:this.message,userId:sessionStorage.getItem("userId")}).then(res=>{
          if(res.data){
            this.title=""
            this.message=""
            alert("送信しました")
          }else{
            alert("もう一度試してください")
          }
        }).catch(error=>console.log(error)).finally(()=>console.log("send mail ended"))
      }
    }
  }

}



</script>

<style scoped>
.title{
  margin-left:50px ;
  margin-top: 50px;
  font-size: 25px;
}
.renraku{
  margin-left:50px ;
  margin-top: 20px;
}
.inputbox{
  margin-left: 3.5%;
  width: 80%;
  height: 25px;
  border-radius: 2px;
  border: transparent;
  margin-top: 20px;
}
.inputbox2{
  margin-left: 3.5%;
  width: 80%;
  height: 205px;
  border-radius: 2px;
  border: transparent;
  margin-top: 20px;

}
.nyuryoku{
  margin-left:50px ;
  margin-top: 7px;
}
button{
  margin-left: 35%;
  background-color: #0733ff;
}
button:hover{
  cursor: pointer;
}
textarea {
  resize: none;
}
</style>