<template>
    <h1>BP要員基本情報更新</h1>
    <div class="div0">
        <div>
            <h2>BP要員基本情報</h2>
        </div>
        <div class="div1">
            <el-form :model="form" label-width="120px">
                <!-- 社員姓 / 社員名 -->
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="社員姓">
                            <el-input v-model="form.surname" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="社員名">
                            <el-input v-model="form.givenName" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <!-- ひらがな（姓） / ひらがな（名） -->
                <el-row :gutter="15">
                    <el-col :span="12">
                        <el-form-item label="ひらがな（姓）">
                            <el-input v-model="form.surnameKana" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="ひらがな（名）">
                            <el-input v-model="form.givenNameKana" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <!-- 英文字（姓） / 英文字（名） -->
                <el-row :gutter="15">
                    <el-col :span="12">
                        <el-form-item label="英文字（姓）">
                            <el-input v-model="form.surnameEn" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="英文字（名）">
                            <el-input v-model="form.givenNameEn" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <!-- 性別 / 国籍 -->
                <el-row :gutter="15">
                    <el-col :span="12">
                        <el-form-item label="性別">
                            <el-radio-group v-model="form.gender">
                                <el-radio label="男">男</el-radio>
                                <el-radio label="女">女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="国籍">
                            <el-select v-model="form.nationality" placeholder="選択してください">
                                <el-option label="中国" value="中国" />
                                <el-option label="日本" value="日本" />
                                <el-option label="韓国" value="韓国" />
                                <el-option label="その他" value="その他" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <!-- 連絡先 / 最寄り駅 -->
                <el-row :gutter="15">
                    <el-col :span="12">
                        <el-form-item label="連絡先">
                            <el-input v-model="form.contact" placeholder="xx-xxxx-xxxx 又は xxx-xxxx-xxxx" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="最寄り駅">
                            <el-input v-model="form.station" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="div2">
            <h2>BP要員契約情報</h2>
            <el-form :model="form2" label-width="120px">
                <!-- 所属会社 / 本人要望 -->
                <el-row :gutter="15">
                    <el-col :span="12">
                        <el-form-item label="所属会社" prop="company" required>
                            <el-select v-model="form.company" placeholder="選択してください" clearable>
                                <el-option label="出通" value="出通" />
                                <el-option label="世通" value="世通" />
                                <el-option label="その他" value="その他" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="本人要望">
                            <el-input type="textarea" v-model="form.request" :rows="1" placeholder="ご要望があればご記入ください"
                                resize="vertical" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="action-bar">
            <el-button type="primary" round @click="updateForm">
                変更
            </el-button>
        </div>
    </div>
</template>

<script setup>
import { reactive, getCurrentInstance } from 'vue';
import axios from 'axios';
const form = reactive({
    surname: '',
    surnameKana: '',
    surnameEn: '',
    givenName: '',
    givenNameKana: '',
    givenNameEn: '',
    gender: '',
    nationality: '',
    contact: '',
    station: ''
})
const form2 = reactive({
    company: '',
    request: ''
})
const { proxy } = getCurrentInstance()
function updateForm() {
    axios.post(proxy.$server + "/personal/update", { userId: sessionStorage.getItem("userId"), ...form, ...form2 }).then(res => {
        for(key in form){
            from[key]=""
        }
        for(key in form2){
            from2[key]=""
        }
    }).catch(error => console.log(error)).finally(() => console.log("updated"))
}
</script>

<style scoped>
.action-bar {
    display: flex;
    justify-content: center;
    margin-top: 0px;
}
</style>