<template>
    <div class="content">
        <Teleport to="body">
            <TransportationInputTable @fetchAllTransportationInfo="fetchAllTransportationInfo"
                @changeInputTable="changeInputTable" v-if="transationInputTableShow"></TransportationInputTable>
        </Teleport>
        <h1>
            交通費一覧ccc
        </h1>
        <div class="info">
            <span>社員No：{{ userId }}　</span>
            <span>社員名：{{ username }}　</span>
            <span>個別交通費(合計)：　</span>
            <span>総額：{{ fares }}</span>
        </div>
        <div class="hijichi"><a href="#">{{ yearAndMonth }}</a></div>
        <div class="buttonSpace">
            <el-button type="primary" style="width: 150px;background-color: #071b75">個別交通費登録</el-button>
            <el-button type="primary" style="width: 100px;background-color: #d8d80f">行追加</el-button>
            <el-button @click="deleteSelectedRow" type="primary" style="width: 100px;background-color: #ff2700">行削除</el-button>
            <el-button @click="copySelectedRow" type="primary"
                style="width: 100px;background-color: #00ce1f">行コピー</el-button>
            <el-button @click="insertCopiedData" type="primary"
                style="width: 100px;background-color: #00ce1f">行貼付</el-button>
        </div>
        <div class="tableZone">
            <el-table highlight-current-row @current-change="handleCurrentChange" :data="tableData"
                style="min-width: 500px;" class="feeList" height="300px"
                :header-cell-style="{ 'background-color': 'aqua' }" border>
                <el-table-column prop="date" label="日付" width="180">
                    <template #default="scope">
                        <span class="date-cell" @click="showInputTable(scope.row)">
                            {{ scope.row.date }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="category" label="交通区分" width="180" />
                <el-table-column prop="tripType" label="片道／往復" />
                <el-table-column prop="line" label="線路" />
                <el-table-column prop="fare" label="料金" />
                <el-table-column prop="note" label="備考" />
            </el-table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive, provide, getCurrentInstance, computed } from 'vue';
import axios from 'axios';
import TransportationInputTable from './TransportationInputTable.vue';
let userId = ref("")
let username = ref("")
onMounted(() => {
    userId.value = sessionStorage.getItem("userId")
    username.value = sessionStorage.getItem("username")
    fetchAllTransportationInfo()
})
let userMessage = reactive({
    userId: userId
})
//目前选中的table哪行的相关设定
const selectedRow = ref()
function handleCurrentChange(val) {
    selectedRow.value = val
    console.log("selected val is ", val)
}
//实现粘贴和复制行的效果
let copiedData = ref()
function copySelectedRow() {
    copiedData.value = selectedRow.value
    console.log("copiedData is ",copiedData)
}
//实现删除选中行的效果
function deleteSelectedRow(){
    console.log("entered deleteSelectedRow")
    //由于我是通过Object.assgin来将后端返回的数据给前端的，这个就会导致，明明数据库数据已经没有了，但是前端还有数据，就不能正确更新，所以这里处理一下tableData
    const tempRow=tableData.value.find(row=>row.date===selectedRow.value.date)
    Object.keys(tempRow).forEach(key=>key!=="date"&&(tempRow[key]=""))
    console.log("this is tempRow ",tempRow)
    //由于前端是line，后端分了起点和终点，所以这里重新组织一下结构
    let [startStation,endStation]=selectedRow.value.line.split("-")
    axios.post(proxy.$server + '/transportation/deleteTransportationInfo',
        {
            date: selectedRow.value.date,
            category: selectedRow.value.category,
            tripType: selectedRow.value.tripType,
            startStation: startStation,
            endStation: endStation,
            fare: selectedRow.value.fare,
            note: selectedRow.value.note
        },
        { headers: { 'Content-Type': 'application/json' } }
    ).then(res => {
        fetchAllTransportationInfo()
    }).catch(error => console.log(error))
}
function insertCopiedData() {
    let [startStation,endStation]=copiedData.value.line.split("-")
    axios.post(proxy.$server + '/transportation/submit2',
        {
            date: selectedRow.value.date,
            category: copiedData.value.category,
            tripType: copiedData.value.tripType,
            startStation: startStation,
            endStation: endStation,
            fare: copiedData.value.fare,
            note: copiedData.value.note
        },
        { headers: { 'Content-Type': 'application/json' } }
    ).then(res => {
        fetchAllTransportationInfo()
    }).catch(error => console.log(error))
}

//窗口偏向右上角的时间设定
let yearAndMonth = computed(() => new Date().getFullYear() + "年" + (new Date().getMonth() + 1) + "月")
//取得当前是几月以及这个月的全部日期
function getDaysOfCurrentMonth() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0 表示 1 月
    // 获取这个月的总天数
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // 生成日数组
    const days = [];
    for (let d = 1; d <= daysInMonth; d++) {
        days.push(d); // 只存日数字
    }
    return [month + 1, days];
}
const tableData = ref([]);
const [month, days] = getDaysOfCurrentMonth();
tableData.value = days.map(day => ({
    date: `${month}/${day}`, // 月/日格式
    category: '',
    tripType: '',
    line: '',
    fare: '',
    note: ''
}));

//获取总额
let fares = computed(() => {
    let temp = 0;
    tableData.value.forEach(item => {
        temp += Number(item.fare) || 0
    })
    return temp
})

//日付的点击事件
function showInputTable(row) {
    transationInputTableShow.value = !transationInputTableShow.value
    selectedDate.value = row.date
}
//单纯是否显示输入框
function changeInputTable() {
    transationInputTableShow.value = !transationInputTableShow.value
}

//transationInputTable控制
let transationInputTableShow = ref(false)

//提供当前date给TransportationInputTable
let selectedDate = ref("")
provide("date", selectedDate)

//获取后端数据
const { proxy } = getCurrentInstance()
async function fetchAllTransportationInfo() {
    console.log("url is ", proxy.$server + '/transportation/getAllTransportationInfo')
    axios.get(proxy.$server + '/transportation/getAllTransportationInfo').then(res => {
        const backendData = res.data; // 后端返回的数组

        // 遍历后端数据，找到对应日期行并更新
        backendData.forEach(item => {
            const target = tableData.value.find(row => row.date === item.date);
            if (target) {
                Object.assign(target, item); // 覆盖已有字段
                item.category === "oufuku" ? target.category = "往復" : target.category = "片道"
                item.tripType === "tsuukin" ? target.tripType = "通勤" : target.tripType = "出張"
                // 再额外生成 line 字段
                if (item.startStation && item.endStation) {
                    target.line = `${item.startStation} - ${item.endStation}`;
                } else {
                    target.line = ""; // 没有值时保持空字符串
                }
            }
        });

        console.log("merged tableData is ", tableData.value);
    }).catch(error => console.log(error))
}
</script>

<style scoped>
.content {
    margin-left: 60px;
    background-color: transparent;
}

span {
    margin-right: 100px;
}

.hijichi {
    text-align: center;
    margin-top: 20px;
}

.buttonSpace {
    position: absolute;
    right: 1%;

}

.tableZone {
    margin-top: 120px;

}

.feeList {
    border-radius: 10px;


}

/* 添加的日付的样式 */
.date-cell {
    text-decoration: underline;
    /* 添加下划线 */
    color: blue;
    /* 可选：让它更像链接 */
    cursor: pointer;
    /* 鼠标悬停时显示手型 */
}
</style>