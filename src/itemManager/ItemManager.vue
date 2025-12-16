<template>
    <div class="topClass">
        <h1>設備管理一覧</h1>
        <div style="display: flex; justify-content: flex-start;">
            <el-button type="success" style="margin: 0; margin-right: 10px;">照合結果OK</el-button>
            <el-button type="danger" style="margin: 0;">照合結果NG</el-button>
        </div>

        <div style="display: flex; justify-content:flex-start;">
            <span>
                <el-icon :size="20">
                    <SwitchButton />
                </el-icon>
                対象設備持っている
            </span>
            <span>
                <el-icon :size="20">
                    <Close />
                </el-icon>
                対象設備持っていない
            </span>
            <span>
                <el-icon :size="20">
                    <QuestionFilled />
                </el-icon>
                未登録設備
            </span>
        </div>
        <div style="display: flex;justify-content: center;align-items: center;">
            <el-button type="primary">結果提出</el-button>
        </div>
    </div>

    <div class="itemManager">
        <!-- 件数选择 -->
        <div class="selectClass">
            <el-select size="small" style="width: 50px;" v-model="pageSize" @change="handleSizeChange"
                placeholder="件表示">
                <el-option v-for="size in pageSizes" :key="size" :label="size + '件表示'" :value="size" />
            </el-select>
        </div>

        <!-- 表格 -->
        <div class="tableClass">
            <el-table :data="pagedData" style="width: 100%">
                <el-table-column prop="p1" label="直近照合完了月" />
                <el-table-column prop="p2" label="今月対応状態" />
                <el-table-column prop="p3" label="操作" />
                <el-table-column prop="p4" label="状態確認" />
                <el-table-column prop="p5" label="設備種類" />
                <el-table-column prop="p6" label="管理番号" />
                <el-table-column prop="p7" label="貸出開始日" />
                <el-table-column prop="p8" label="返却予定日" />
            </el-table>
        </div>

        <!-- 翻页 -->
        <div class="paginationClass">
            <span>前</span>
            <span>次</span>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Close, SwitchButton, QuestionFilled } from '@element-plus/icons-vue'

const tableData = ref([])

const pageSizes = [10, 50, 100, 500]
const pageSize = ref(10)
const currentPage = ref(1)

const pagedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return tableData.value.slice(start, start + pageSize.value)
})

const handleSizeChange = (val) => {
    currentPage.value = 1 // 切换件数时重置页码
}

const handlePageChange = (val) => {
    currentPage.value = val
}
</script>

<style scoped>
.itemManager {
    display: grid;
    grid-template-rows: auto auto auto;
    grid-template-columns: auto;
}

.paginationClass {
    justify-self: end;
    width: auto;
}

span{
    background-color: aliceblue;
    margin: 0 10px;
}
</style>
