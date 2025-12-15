<template>
    <div class="resume-container">
        <h1>経歴書管理</h1>
        <div class="btn">
            <el-button type="primary">経歴書テンプレート</el-button>

            <el-upload :show-file-list="false" :before-upload="beforeUpload" :http-request="uploadFile" multiple>
                <el-button type="primary">アップロード</el-button>
            </el-upload>
        </div>

        <div class="resumeTable">
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column prop="date" label="ファイル名" min-width="60%" />
                <el-table-column prop="name" label="アップロード日" min-width="30%" />
                <el-table-column prop="address" label="操作" min-width="10%" />
            </el-table>
        </div>
    </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const { proxy } = getCurrentInstance()

// 条件设置
function beforeUpload(file) {
    const isXls = file.name.endsWith('.xls')
    if (!isXls) {
        ElMessage.error('xls形式のみアップロード可能です')
    }
    return isXls
}

// 自定义上传
function uploadFile(option) {
    const formData = new FormData()
    formData.append('file', option.file)
    formData.append('userId', sessionStorage.getItem('userId'))

    axios.post(proxy.$server + '/resume/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(() => {
        ElMessage.success('アップロード成功')
    }).catch(() => {
        ElMessage.error('アップロード失敗')
    })
}

</script>

<style scoped>
.btn {
    display: flex;
    justify-content: space-evenly;
    gap: 12px;
    margin-bottom: 20px;
}
</style>
