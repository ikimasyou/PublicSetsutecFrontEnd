<template>
<!--    <h1>-->
<!--        交通費一覧-->
<!--    </h1>-->

  <div class="content">
    <h1>
      交通費一覧
    </h1>
    <div class="info">
      <span>社員No：{{personalNumber}}　</span>
      <span>社員名：{{username}}　</span>
      <span>個別交通費(合計)：　</span>
      <span>総額：</span>
    </div>
    <div class="hijichi"><a href="#">sadsadsad</a></div>
    <div class="buttonSpace">
      <el-button type="primary" style="width: 150px;background-color: #071b75">個別交通費登録</el-button>
      <el-button type="primary" style="width: 100px;background-color: #d8d80f">行追加</el-button>
      <el-button type="primary" style="width: 100px;background-color: #ff2700">行削除</el-button>
      <el-button type="primary" style="width: 100px;background-color: #00ce1f">行貼付</el-button>
    </div>
    <div class="tableZone">
      <el-table :data="tableData" style="width: 80%" class="feeList"  :header-cell-style="{'background-color':'aqua'}" border >
        <el-table-column prop="data" label="日付" width="180" />
        <el-table-column prop="category" label="交通区分" width="180" />
        <el-table-column prop="tripType" label="片道／往復" />
        <el-table-column prop="line" label="線路" />
        <el-table-column prop="fare" label="料金" />
        <el-table-column prop="note" label="備考" />
      </el-table>
    </div>
  </div>

</template>

<script>
export default {
  data(){
    return{
      personalNumber:"",
      username:""
    }
  },
  mounted() {
    this.personalNumber=sessionStorage.getItem('userId');
    this.username=sessionStorage.getItem('username');
  }
}

</script>

<style scoped>
.content{
  margin-left: 60px;
  background-color: transparent;
}
span{
  margin-right: 100px;
}
.hijichi{
  text-align: center;
  margin-top: 20px;
}
.buttonSpace{
  position: absolute;
  right: 1%;

}
.tableZone{
margin-top: 120px;



}
.feeList{
  border-radius: 10px;


}

</style>