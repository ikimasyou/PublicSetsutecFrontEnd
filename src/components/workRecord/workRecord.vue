<template>
  <h1 style="margin-left: 50px; margin-top:10px;">
      勤務登録画面
  </h1>
  <div class="infobox">
    <el-dialog
        v-model="dialogVisible"
        title="勤務詳細"
        width="700"
        :show-close="false"
        :close-on-click-modal="false"

    >
      <div class="inputs">
      <span>勤務区分</span>
      <!-- class="diInputbox" -->
      <el-input v-model="division" placeholder="Please input" class="diInputbox"></el-input>
    </div>
      <div class="inputs">
        <span>出勤時間</span>
        <el-time-select
         v-model="begin"
         start="06:30"
         step="00:15"
         end="23:30"
         style="margin-left: 20px;width: 240px"
         placeholder="時間を選んでください"
     />
        <!-- <el-time-picker v-model="begin"  value-format="HH:mm:ss"   placeholder="Arbitrary time" style="margin-left: 20px;width: 240px" /> -->
      </div>
      <div class="inputs">
        <span>退勤時間</span>
        <el-time-select
         v-model="end"
         start="06:30"
         step="00:15"
         end="23:30"
         style="margin-left: 20px;width: 240px"
         placeholder="時間を選んでください"
     />
        <!-- <el-time-picker v-model="end"  value-format="HH:mm:ss"   placeholder="Arbitrary time" style="margin-left: 20px;width: 240px" /> -->
      </div>

      <div class="inputs">
        <span>休憩時間(夕方)</span>
        <el-select v-model="breaknight" class="diInputbox" placeholder="Select" style="width: 115px">
          <el-option label="0:00" value="0:00" />
          <el-option label="1:00" value="1:00" />
          <el-option label="2:00" value="2:00" />
          <el-option label="3:00" value="3:00" />
        </el-select>

      </div>
      <div class="inputs">
        <span>休憩時間(昼間)</span>
        <el-select v-model="breakday" class="diInputbox" placeholder="Select" style="width: 115px">
          <el-option label="0:00" value="0:00" />
          <el-option label="1:00" value="1:00" />
          <el-option label="2:00" value="2:00" />
          <el-option label="3:00" value="3:00" />
        </el-select>

      </div>
      <div class="inputs">
        <span>備考&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <el-input v-model="note" class="diInputbox" placeholder="Please input" />
      </div>
      <div class="inputs">
        <div>作業内容</div>
        <el-input
            v-model="workcontent"
            style="width: 400px"
            :rows="10"
            type="textarea"
            placeholder="Please input"
        />

      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible=false;">戻る</el-button>
          <el-button type="primary" @click="workInput">
            入力する
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
  <div>
    <el-dialog
        v-model="contentdialogVisible"
        title=""
        width="500"
        :show-close="false"

    >
      <el-card style="max-width: 480px">
        <template #header>
          <div class="card-header">
            <span>作業内容</span>
          </div>
        </template>
        <div style="white-space:normal; word-break:break-all;overflow:hidden;height: 200px">
          {{workText}}
        </div>
        <template #footer>
          備考
          <span>
         {{noteText}}
          </span>
        </template>
      </el-card>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="contentdialogVisible = false">OK</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
  <div>
    <div class="container">
      <h4 class="my-title" style="margin-left: 100px; margin-top:10px;"> 案件名:&nbsp;{{caseName}} </h4>
      <h4 class="my-title" style="margin-left: 100px; margin-top:40px;"> 社員No:&nbsp;{{employeeNumber}} </h4>
      <h4 class="my-title" style="margin-left: 400px; margin-top:40px;"> 社員名:&nbsp;{{username}} </h4>
      <h4 class="my-title" style="margin-left: 100px; margin-top:70px;"> 総勤務時間:&nbsp; {{ totalTime }}</h4>
    </div>
  </div>
　
<!--  <button :disabled="isButtonDisabled" @click="toWorkRecord" class="custom-button">戻る</button>-->

<!--  <button class="green" @click="dialogVisible = true">勤務入力</button>-->
<!--  <button class="blue">月末提出</button>-->
  <!--//年月选择项-->
  <div class="history-content"> 
    <div class="month">
        <input type="month" v-model="selectedDate" @change="setMonthAndYear"  style="color:deepskyblue;margin-right:-5000%;background:whitesmoke;width: 100px;"/>
    </div>
  </div>
<!--  <el-button plain @click="dialogVisible = true">-->
<!--    Click to open the Dialog-->
<!--  </el-button>-->



  <div class="mat-elevation-z8" >
    <el-table :data="dataSource" stripe style="width: 100%;border-radius: 15px;" border="true" max-height="250" :header-cell-style="{'background-color':'#d9e2f9','border':'1px solid #b2bbea'}" :cell-style="{'border':'1px solid #b2bbea'}"  >
      <el-table-column prop="date" label="日付">
        <template #default="scope">
         <a @click="inputWorkbox(scope.row)"  style="text-decoration: underline;color: #3960d0;cursor: pointer;">{{ scope.row.date }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="division" label="勤務区分" />
      <el-table-column prop="begin" label="出勤時間"  />
      <el-table-column prop="end" label="退勤時間" />
      <el-table-column prop="breakday" label="休憩時間(昼間)" />
      <el-table-column prop="breaknight" label="休憩時間(夕方)" />
      <el-table-column prop="workhour" label="実働時間" />
      <!-- <el-table-column  label="作業内容">
        <template #default="scope" >
          <el-button  size="small" style="width: 100px;margin-left: 0px;margin-top: -12px;position: absolute;"  @click="workContents(scope.row)">
            詳細を見る
          </el-button>
        </template>
      </el-table-column> -->
<!--      <el-table-column prop="note" label="備考" />-->
      <!-- <el-table-column label="操作"    >
        <template #default="scope" >
          <el-button  size="small" style="width: 100px;margin-left: 0px;margin-top: -12px;position: absolute;" type="primary" @click="inputWorkbox(scope.row)">
            勤務入力
          </el-button>
        </template>
      </el-table-column> -->

    </el-table>
    <paginator :page-size-options="[5, 10, 20]"></paginator>
  </div>
</template>

<script>
import axios from 'axios';
import login from '../login/login.vue'
import { h } from 'vue'
import { ElNotification } from 'element-plus'
export default {
  data() {
    return {
      options:[
      {
          value: 'gozenhankyu',
          label: '午前半休'
        }, {
          value: 'gougohankyu',
          label: '午後半休'
        }, {
          value: 'kenkin',
          label: '欠勤'
        }, {
          value: 'kyujitsusyukin',
          label: '休日出勤'
        }, {
          value: 'kaigaisyuchyo',
          label: '海外出張'
        }
      ],
      begin:"",
      end:"",
      contentdialogVisible:false,
      dialogVisible: false,
      showList: false,
      showSingleDays: false,
      selectedMonth: null,
      yearMonths: [],
      isButtonDisabled: false,
      selectedDate: '',
      dataSource: [],
      caseName:"",
      employeeNumber:"",
      username:"",
      date:new Date().toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit'}),
      division:"",
      breaknight:"0:00",
      breakday:"0:00",
      workcontent:"",
      note:"",
      recordNumber:"",
      workText:"",
      noteText:"",
      syukinjikan:"",
      taikinjikan:"",
      // workday:""
      factTime:"",
      row:null,
      totalTime:""
    };
  },

  methods: {
    workContents(content){

       this.workText=content.workcontent;
       this.noteText=content.note;
      this.contentdialogVisible=true;

    },

    inputWorkbox(workNumber){


      this.row=workNumber;
      if (workNumber.kinmuid!=this.recordNumber){
        this.recordNumber=workNumber.kinmuid
            this.division=this.row.division;
            this.breaknight=this.row.breaknight||"0:00";
           this.breakday=this.row.breakday||"0:00";
            this.workcontent=this.row.workcontent;
            this.note=this.row.note;
            this.begin=this.row.begin;
            this.end=this.row.end;

      }


      this.dialogVisible=true;

    },

    subtractTimes(time1, time2) {
      // 将时间字符串转换为 Date 对象
      const date1 = new Date(`1970-01-01T${time1}`);
      const date2 = new Date(`1970-01-01T${time2}`);
      const breakTime=Number(this.breakday[0])+Number(this.breaknight[0]);

      // 获取毫秒数并相减
      const diffMilliseconds = date1 - date2-(1000*breakTime*3600);
      if (diffMilliseconds<=0){
        console.log(Number(this.breakday[0]+this.breaknight[0]));
        ElNotification({
          title: '警告',
          message: h('i', { style: 'color: red' }, 'この時間は不法時間です'),
        })
        return null;
      }
      // 将毫秒数转换为小时、分钟和秒
      const diffHours = Math.floor(diffMilliseconds / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMilliseconds % (1000 * 60 * 60)) / (1000 * 60));

      const diffSeconds = Math.floor((diffMilliseconds % (1000 * 60)) / 1000);

      // 格式化输出结果
      return `${diffHours.toString().padStart(2, '0')}:${diffMinutes.toString().padStart(2, '0')}:${diffSeconds.toString().padStart(2, '0')}`;
    },



    async workInput(){


        try{
          const time1 = this.end;
          const time2 = this.begin;
          const result = this.subtractTimes(time1, time2);
          if (result!=null){
            let res=await axios.post(this.$server+'/attendance/updateworkrecord',{
              division:this.division,
              breaknight:this.breaknight,
              breakday:this.breakday,
              workcontent:this.workcontent,
              note:this.note,
              kinmuid:this.recordNumber,
              workhour:result,
              begin:this.begin,
              end:this.end
            })
            this.dialogVisible=false;
            this.fetchData();
          }
          }



        catch (error){
          console.error('Error fetching data:', error);
        }


    },
    addTimes(timeList) {
      let totalSeconds = 0;

      for (const timeStr of timeList) {
        const [hours, minutes, seconds] = timeStr.split(':').map(Number);
        totalSeconds += hours * 3600 + minutes * 60 + seconds;
      }

      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    },

    async fetchData() {
      let formattedDate = new Date(this.date);

      let originalStyleDate = formattedDate.toLocaleDateString().substring(0,6);
      console.log(originalStyleDate);
      try {
        this.caseName = (await axios.get(this.$server + '/anken/getAnkenName?userId=' + this.employeeNumber)).data;
        //this.dataSource = response.data;

        let response=await axios.post(this.$server+'/attendance/getAttendance',{
          userId:this.employeeNumber,
          date:originalStyleDate
        })
        let timeList=[];
        this.dataSource=response.data.data;
        if (this.dataSource.length>0){
          this.dataSource.forEach((time)=>{
                if (time.workhour!=null){
                  timeList.push(time.workhour)
                }
          })
        }
      this.totalTime= this.addTimes(timeList);
        console.log(this.totalTime)

      } catch (error) {
        console.error('Error fetching data:', error);
      }

    },
    async setMonthAndYear() {


      try{
        let changeDate = new Date(this.selectedDate);
        let changeMonth=changeDate.getMonth()+1;
        //let setDate=changeMonth<10?changeDate.toLocaleDateString().substring(0,6):changeDate.toLocaleDateString().substring(0,7);
        //上述代码被更改如下
        let setDate=`${changeDate.getFullYear()}/${changeMonth}`
        console.log("ths is setDate "+setDate)

        const response = await axios.post(this.$server+'/attendance/getAttendance',{
          userId: this.employeeNumber,
          date: setDate
          // isAttendance: true,
        });
        this.dataSource=response.data.data;

        }
      catch (error) {
        // 异常处理
        console.error('Error fetching data:', error);
      }
    },
    toWorkRecord() {
    }
  },

  computed: {
    // totalWorkHour() {
    //   return this.dataSource.reduce((total, item) => total + parseFloat(item.workhour || 0), 0);
    // }
  },

  async mounted() {

    this.username=sessionStorage.getItem('username');
    this.employeeNumber=sessionStorage.getItem('userId');
    await this.fetchData();
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const formattedYear = currentYear.toString();
    const formattedMonth = currentMonth < 10 ? '0' + currentMonth.toString() : currentMonth.toString();
    this.selectedDate = `${formattedYear}/${formattedMonth}`;

  }
};
</script>

<style scoped>
h4{ 
  margin-left: 60px;
  color: rgb(114, 104, 104);
}

.my-title {
  color: rgb(123, 118, 118); 
  position: absolute; 
}

.data-table {
  width: 100%;
  border-collapse: collapse; 
}

.data-table th, .data-table td {
  padding: 8px;
  border: 1px solid #551919;
}

.data-table th {
  background-color: #b6e2f4;
  font-weight: bold;
}

.data-table tbody tr:nth-child(even) {
  background-color: #a55050;
}

.green{
  position: fixed;
  margin-top: 180px;
  margin-left: 35%;
  /* transform: translateX(-50%);  */
  font-size: 10px;
  color: white;
  background-color: rgb(74, 176, 51);
  border: 2px solid #f3f6f9;
  padding: 8px 20px; 
  border-radius: 20px
}

.blue{
  position: fixed;
  margin-top: 830px; 
  margin-left: 40%;
  /* transform: translateX(-50%);  */
  font-size: 10px;
  color: white;
  background-color: rgb(22, 22, 239);
  border: 2px solid #f3f6f9;
  padding: 8px 20px; 
  border-radius: 20px;
}

.custom-button {
  position: fixed;
  margin-top: 850px;
  font-size: 10px;
  color: white;
  background-color: #f5d107;
  border: 1px solid #f3f6f9;
  padding: 1px 20px;
  border-radius: 10px;
  width: 70px
}
.center-bottom {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 100vh; 
}
  
.history-content{
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
  flex-direction: column;
  margin-top: 100px;
}

.mat-elevation-z8{
  width: 95%;
  margin: 30px auto;
  border-radius: 15px;
 
}
.inputs{
margin-left: 150px;
  margin-top: 20px;
}
.diInputbox{
  width: 240px;
  margin-left: 20px
}
</style>
