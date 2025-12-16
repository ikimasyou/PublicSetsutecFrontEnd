<template>
    <div class="resume-container">
        <h1>経歴書管理</h1>
        <div>
            <el-form-item label="履歴書（複数選択可）">
                <el-select v-model="selectedTemplates" multiple placeholder="履歴書選択...">
                    <el-option v-for="file in templateFiles" :key="file" :label="file" :value="file" />
                </el-select>
            </el-form-item>

        </div>
        <div class="btn">
            <el-button type="primary" @click="downloadTemplates">経歴書テンプレート</el-button>

            <el-upload :show-file-list="false" :before-upload="beforeUpload" :http-request="uploadFile" multiple>
                <el-button type="primary">アップロード</el-button>
            </el-upload>
        </div>

        <div class="resumeTable">
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column label="ファイル名">
                    <template #default="scope">
                        <el-link type="primary" :underline="false" @click="handleDownload(scope.row)">
                            {{ scope.row.fileName }}
                        </el-link>
                    </template>
                </el-table-column>
                <el-table-column prop="updatedAt" label="アップロード日" />
                <el-table-column label="操作" align="left">
                    <template #default="scope">
                        <el-button type="danger" size="small" @click="handleDelete(scope.row)">
                            削除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script setup>
import { ref, getCurrentInstance, reactive, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const { proxy } = getCurrentInstance()


const templateFiles = [
    "template1.xls",
    "template2.xlsx"
];

//下载指定履历书
function handleDownload(row) {
    axios.post(proxy.$server + '/resume/download', null, {
        params: {
            userId: sessionStorage.getItem('userId'),
            fileName: row.fileName,
            updatedAt: row.updatedAt
        },
        responseType: 'blob'
    }).then(res => {
        const blob = new Blob([res.data])
        const url = window.URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = url
        a.download = row.fileName
        a.click()

        window.URL.revokeObjectURL(url)
    }).catch(() => {
        ElMessage.error('ダウンロード失敗')
    })
}

const selectedTemplates = ref([]);

const downloadTemplates = () => {
    selectedTemplates.value.forEach(file => {
        const link = document.createElement("a");
        link.href = `/resume-templates/${file}`;
        link.download = file;
        link.click();
    });
};


// 条件设置
function beforeUpload(file) {
    const isXls = file.name.endsWith('.xls') || file.name.endsWith('.xlsx')
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
        getTableData()
    }).catch(() => {
        ElMessage.error('アップロード失敗')
    })
}

// 仅仅负责拿到显示到table的内容
const tableData = reactive([])
function getTableData() {
    axios.get(proxy.$server + "/resume/getResumes", {
        params: {
            userId: sessionStorage.getItem("userId")
        }
    }).then(res => {
        console.log(res.data)
        tableData.length = 0
        const data = res.data.map(resumeInfo => ({
            fileName: resumeInfo.filepath.split(/[/\\]/).pop(),
            updatedAt: resumeInfo.updatedAt
        }))
        Object.assign(tableData, data)
    }).catch(eror => console.log(eror))
}
//负责删除当前行的内容
function handleDelete(row) {
    axios.delete(proxy.$server + "/resume/deleteResume", {
        params: {
            userId: sessionStorage.getItem("userId"),
            fileName: row.fileName
        }
    }).then(res => {
        console.log(res.data)
        getTableData()
    }).catch(error => console.log(error))
}
onMounted(() => getTableData())
</script>

<style scoped>
.btn {
    display: flex;
    justify-content: space-evenly;
    gap: 12px;
    margin-bottom: 20px;
}
</style>
