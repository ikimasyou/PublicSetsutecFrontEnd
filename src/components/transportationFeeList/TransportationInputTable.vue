<template>
    <div class="transportationInputTableClass">
        <h3>交通費詳細</h3>
        <div>
            <label for="date">日付</label>
            <input type="text" name="date" id="date" v-model="dataFormat.date">
        </div>
        <div>
            <h3>片道/往復</h3>
            <div>
                <label for="">
                    <input type="radio" name="category" value="katamichi" v-model="dataFormat.category" />
                    片道
                </label>
                <label for="">
                    <input type="radio" name="category" value="oufuku" v-model="dataFormat.category" />往復
                </label>
            </div>
        </div>
        <div>
            <label for="tripType">交通区分</label>
            <select name="tripType" id="tripType" v-model="dataFormat.tripType">
                <option value="tsuukin">通勤</option>
                <option value="syucyou">出張</option>
            </select>
        </div>
        <div>
            <label for="startStation">線路From</label>
            <input type="text" name="startStation" id="startStation" v-model="dataFormat.startStation">
        </div>
        <div>
            <label for="endStation">線路To</label>
            <input type="text" name="endStation" id="endStation" v-model="dataFormat.endStation">
        </div>
        <div>
            <label for="fare">料金</label>
            <input type="number" name="fare" id="fare" v-model.number="dataFormat.fare">
        </div>
        <div>
            <label for="note">備考</label>
            <input type="text" name="note" id="note" v-model="dataFormat.note">
        </div>
        <div>
            <button @click="emit('changeInputTable')">キャンセル</button>
            <button @click="submit2()">登録</button>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { ref, reactive, watch,inject,onMounted,defineEmits,getCurrentInstance } from 'vue';
let dataFormat = reactive({
    date: "",
    category: "",
    tripType: "",
    startStation: "",
    endStation: "",
    fare: "",
    note: ""
})
//获取当前的date信息
onMounted(()=>{
    const date=inject("date")
    dataFormat.date=date.value
})
//获取是否显示当前输入框的函数以及获取后端数据的函数
const emit=defineEmits(["changeInputTable","fetchAllTransportationInfo"])
//发送信息确定好的信息给后端
const {proxy}=getCurrentInstance()
function submit(){
    let message=JSON.stringify(dataFormat)
    axios.get(proxy.$server + '/transportation/submit',{
        params:{
            message
        }
    }).then(res=>alert("this is res "+res.data)).catch(error=>alert("error"))
}
function submit2(){
    axios.post(proxy.$server + '/transportation/submit2',
        { ...dataFormat }, 
        { headers: { 'Content-Type': 'application/json' } }
    ).then(res => {
        emit("fetchAllTransportationInfo")
        emit("changeInputTable")
    }).catch(error => console.log(error))
}

</script>

<style scoped>
/* .transportationInputTableClass {
    position: fixed;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    width: 300px;
    height: 600px;
    background-color: aliceblue;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    padding: 20px;
}
button{
    width: 50px;
} */
.transportationInputTableClass {
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;

  width: 320px;
  max-height: calc(100vh - 160px);
  overflow-y: auto;

  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
  padding: 20px;
  box-sizing: border-box;
}

/* 标题 */
.transportationInputTableClass > h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
}

/* 每一行表单 */
.transportationInputTableClass > div {
  margin-bottom: 14px;
}

/* label 样式 */
label {
  display: block;
  margin-bottom: 6px;
  font-size: 12px;
  color: #555;
}

/* input / select 统一风格 */
input[type="text"],
input[type="number"],
select {
  width: 100%;
  height: 34px;
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  font-size: 13px;
}

input:focus,
select:focus {
  outline: none;
  border-color: #409eff;
}

/* radio 区域横向排列 */
.transportationInputTableClass h3 + div {
  display: flex;
  gap: 16px;
}

input[type="radio"] {
  margin-right: 4px;
}

/* ✅ 最底部按钮区域横向排列 */
.transportationInputTableClass > div:last-child {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

/* ✅ 按钮样式：文字居中，宽度可变 */
button {
  padding: 0px;
  margin:0px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 13px;
  text-align: center;
  white-space: nowrap;
}

/* 取消按钮 */
button:first-child {
  background-color: #f2f2f2;
  color: #333;
}

/* 注册按钮 */
button:last-child {
  background-color: #409eff;
  color: #fff;
}

button:hover {
  opacity: 0.9;
}



</style>