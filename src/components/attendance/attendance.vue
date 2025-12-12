<template>
  <h2>勤務メニュー</h2>
  <h4>案件名:&nbsp;{{ caseName }}</h4>
  <button class="lightblue" @click="syukkinHandler">出勤</button>
  <button class="bluegreen" @click="taikinHandler">退勤</button>
  <button class="yellow" @click="toWorkRecord">勤務登録</button>
  <div class="history-content">
    <div class="month">
      <input style="border:none;margin-left:100px;background:whitesmoke;width: 100px;" v-model="date" type="month"
        @change="setMonthAndYear" />
      <!-- <el-date-picker
          v-model="value2"
          type="month"
          placeholder="选择月">
        </el-date-picker> -->
    </div>
    <div class="mat-elevation-z8">
      <el-table v-loading="loading" :data="dataSource" max-height="250" width="100%" stripe
        style="overflow: auto;border-radius: 15px;"
        :header-cell-style="{ 'background-color': '#d9e2f9', 'border': '1px solid #b2bbea' }"
        :cell-style="{ 'border': '1px solid #b2bbea' }" border="true">
        <el-table-column prop="date" label="日付" />
        <el-table-column prop="begin" label="出勤時刻" />
        <el-table-column prop="end" label="退勤時刻" />
        <el-table-column prop="status" label="状態">
          <template #default="scope">
            <span v-if="scope.row.status == '出勤'" style="color: #00ce1f">出勤</span>
            <span v-else-if="scope.row.status == '退勤'" style="color: red">退勤</span>

          </template>
        </el-table-column>
        <el-table-column prop="place" label="位置" />
      </el-table>
      <!-- <table>
          <thead>
            <tr>
              <th>日付</th>
              <th>時刻</th>
              <th>状態</th>
              <th>位置</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="element in dataSource" :key="element.id">
              <td>{{ element.date }}</td>
              <td>{{ element.time }}</td>
              <td>{{ element.status }}</td>
              <td>{{ element.place }}</td>
            </tr>
          </tbody>
        </table> -->
      <paginator :page-size-options="[5, 10, 20]"></paginator>
    </div>


  </div>
</template>

<script>
import axios from 'axios';
import login from '../login/login.vue'
export default {
  props: ['server'],
  data() {
    return {
      loading: false,
      // 你的数据
      dataSource: [],
      date: new Date().toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit' }),// 示例日期
      kinmuid: "",
      // 其他需要的数据
      caseName: "",
      temBegin: "",
      temEnd: "",
    };
  },
  methods: {

    async syukkinHandler() {
      // 出勤逻辑
      try {
        // 使用 await 等待异步操作完成
        let userId = sessionStorage.getItem("userId")
        let currentDateString = new Date().toLocaleDateString();
        //let currentTimeString = new Date().toLocaleTimeString();


        let sendMessage = JSON.stringify({
          userId: userId,
          date: currentDateString,
          isAttendance: true
        })
        let em = login.methods.encryptTextWithRSAOAEPUseForge(sendMessage, sessionStorage.getItem('serverPublicKey'))
        //let em = await login.methods.encryptDataWithPublicKey(sendMessage,sessionStorage.getItem('serverPublicKey'))      使用crypto的时候开启（仅支持HTTPS）
        let clientPublicKey = sessionStorage.getItem('publicKey')
        console.log(em)
        console.log(clientPublicKey)
        console.log(this.$server)
        const response = await axios.post(this.$server + '/attendance/shuTaiKin', {
          clientPublicKey: clientPublicKey,
          token: em
        });
        console.log("syukkinHandler ran to before kinmuid")

        // 在异步操作完成后执行其他逻辑
        this.kinmuid = response.data.data[response.data.data.length - 1].kinmuid;

        let myDataSource = []
        myDataSource = response.data.data

        let tempData = []
        for (let i = 0; i < myDataSource.length; i++) {

          let formattedDate = new Date(this.date);
          // 使用toLocaleDateString()获取原本的样式
          let originalStyleDate = formattedDate.toLocaleDateString().substring(0, 6);
          console.log("this is originalStyleDate+ " + originalStyleDate)
          console.log("this is myDataSource[i].date.substring(0,6)+ " + myDataSource[i].date.substring(0, 6))

          if (myDataSource[i].date.substring(0, 6) == originalStyleDate) {
            if (myDataSource[i].begin != null && myDataSource[i].end == null)
              myDataSource[i].isAttendance = true
            if (myDataSource[i].begin != null && myDataSource[i].end != null)
              myDataSource[i].isAttendance = false
            let dataElement = {
              date: myDataSource[i].date,
              begin: myDataSource[i].begin,
              end: myDataSource[i].end,
              status: myDataSource[i].isAttendance ? "出勤" : "退勤",
              place: "在宅",

            }
            //  if (i==myDataSource.length-1){
            //     this.temBegin=dataElement.begin;
            //     this.temEnd=dataElement.end;
            //     dataElement.end="";
            //     dataElement.status="出勤";
            //   }
            tempData.push(dataElement)
          }
        }
        tempData = tempData.reverse()
        console.log(tempData)

        this.dataSource = tempData

        //新添加的，检查dataSource内容
        this.dataSource.forEach(item=>{
          console.log("item is ",item)
        })

        // if(tempData.length<=6)
        //
        // else{
        //   let subList = []
        //   for(let i=0;i<6;i++){
        //     subList.push(tempData[i])
        //   }
        //   this.dataSource = subList
        // }
        // console.log("date:")
        // console.log(this.date)

      } catch (error) {
        // 异常处理
        console.error('Error fetching data:', error);
      }
    },

    async getAnkenName() {
      this.caseName = (await axios.get(this.$server + '/anken/getAnkenName?userId=' + sessionStorage.getItem("userId"))).data;
    },
    //从这里开始是后续添加的
    monthKeyFromInputMonth(input) {
      // input 例如 "2025-12"
      const [year, month] = input.split('-');
      return `${year}/${month}`; // "2025/12"
    },
    monthKeyFromDateObj(d) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      return `${y}/${m}`; // "2025/12"
    }
    //这前面是后续添加的
    ,
    async taikinHandler() {
      // 退勤逻辑
      try {
        // 使用 await 等待异步操作完成
        let userId = sessionStorage.getItem("userId")
        let currentDateString = new Date().toLocaleDateString();
        let currentTimeString = new Date().toLocaleTimeString();
        console.log(currentTimeString);

        let sendMessage = JSON.stringify({
          userId: userId,
          date: currentDateString,
          isAttendance: false,
          kinmuid: this.kinmuid,
          end: currentTimeString

        })

        let em = login.methods.encryptTextWithRSAOAEPUseForge(sendMessage, sessionStorage.getItem('serverPublicKey'))
        //let em = await login.methods.encryptDataWithPublicKey(sendMessage,sessionStorage.getItem('serverPublicKey'))   使用crypto的时候开启（仅支持HTTPS）
        let clientPublicKey = sessionStorage.getItem('publicKey')

        const response = await axios.post(this.$server + '/attendance/shuTaiKin', {
          clientPublicKey: clientPublicKey,
          token: em,
        });
        let myDataSource = []
        myDataSource = response.data.data

        let formattedDate = new Date(this.date);
        let originalStyleDate = formattedDate.toLocaleDateString().substring(0, 6);

        let tempData = []
        for (let i = 0; i < myDataSource.length; i++) {

          // 使用toLocaleDateString()获取原本的样式
          console.log(originalStyleDate)
          if (myDataSource[i].date.substring(0, 6) == originalStyleDate) {
            if (myDataSource[i].begin != null && myDataSource[i].end == null)
              myDataSource[i].isAttendance = true
            if (myDataSource[i].begin != null && myDataSource[i].end != null)
              myDataSource[i].isAttendance = false
            let dataElement = {
              date: myDataSource[i].date,
              begin: myDataSource[i].begin,
              end: myDataSource[i].end,
              status: myDataSource[i].isAttendance ? "出勤" : "退勤",
              place: "在宅",

            }

            tempData.push(dataElement)
          }
        }
        tempData = tempData.reverse()
        this.dataSource = tempData
        // if(tempData.length<=6)
        //
        // else{
        //   let subList = []
        //   for(let i=0;i<6;i++){
        //     subList.push(tempData[i])
        //   }
        //   this.dataSource = subList
        //
        // }

        // 在异步操作完成后执行其他逻辑
        console.log('Data fetched:', response.data);
      } catch (error) {
        // 异常处理
        console.error('Error fetching data:', error);
      }
    },

    async setMonthAndYear() {
      // 设置月份和年份的逻辑
      console.log("a")
      let formattedDate = new Date(this.date);
      // 使用toLocaleDateString()获取原本的样式
      let originalStyleDate = formattedDate.toLocaleDateString().substring(0, 6);
      let userId = sessionStorage.getItem("userId")
      try {

        const response = await axios.post(this.$server + '/attendance/getAttendance', {
          userId: userId,
          date: originalStyleDate,
          isAttendance: true,
        })

        console.log(response.data.data)
        let myDataSource = []
        myDataSource = response.data.data
        let tempData = []

        for (let i = 0; i < myDataSource.length; i++) {
          if (myDataSource[i].begin != null && myDataSource[i].end == null)
            myDataSource[i].isAttendance = true
          if (myDataSource[i].begin != null && myDataSource[i].end != null)
            myDataSource[i].isAttendance = false
          let dataElement = {
            date: myDataSource[i].date,
            begin: myDataSource[i].begin,
            end: myDataSource[i].end,
            status: myDataSource[i].isAttendance ? "出勤" : "退勤",
            place: "在宅",
            time: myDataSource[i].isAttendance ? myDataSource[i].begin : myDataSource[i].end
          }

          tempData.push(dataElement)

        }




        tempData = tempData.reverse()
        this.dataSource = tempData

        // if(tempData.length<=6)
        //
        // else{
        //   let subList = []
        //   for(let i=0;i<6;i++){
        //     subList.push(tempData[i])
        //   }
        //   this.dataSource = subList;
        //
        // }
      }
      catch (error) {
        // 异常处理
        console.error('Error fetching data:', error);
      }
    },

    changePageHandle(pageName) {
      this.$emit('changePage', pageName);
    },

    toWorkRecord() {
      this.changePageHandle("WorkRecord");
    },
  },
  mounted() {

    this.setMonthAndYear();
    this.getAnkenName();
  }
};
</script>

<style>
h2 {
  margin-top: 40px;
  margin-left: 60px;
}

h4 {
  margin-left: 60px;
  color: gray;
}

button {
  color: white;
  border-radius: 15px;
  margin-left: 100px;
  margin-top: 30px;
  padding: 5px;
  width: 250px;
  text-align: center;
  border: none;
}

.lightblue {
  margin-left: 20%;
  background-color: lightblue;
}

.bluegreen {
  background-color: slateblue;
}

.yellow {
  background-color: orange;

  a {
    text-decoration: none;
    color: white;
  }
}

.history-content {
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
  flex-direction: column;
  margin-top: 20px;
}

.month {
  margin-left: auto;
}

.mat-elevation-z8 {

  width: 100%;
  margin: 20px auto;
  background-color: transparent;
  border-radius: 15px;


}

table {
  width: 70%;
  margin: 30px auto;
}

.el-table .el-table__body {
  margin-bottom: 10;
  margin-top: 0;
}

.el-table .el-table__header {
  margin-bottom: 1;
  margin-top: 1;
}

.display {
  display: none;
}
</style>