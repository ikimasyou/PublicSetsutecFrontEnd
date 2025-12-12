<template>
    <div class="demo-collapse">
        <el-collapse style="padding: 0;" v-model="activeNames" @change="handleChange">
            <el-collapse-item v-for="(skill, index) in skillCatogries" :key="index" :title="skill.skillCatogry"
                :name="index">
                <div style="margin-left: 100px;" v-for="(item, index) in skill.skills" :key="index">
                    <div style="display: inline-block;width: 240px;">{{ item.skillName }}</div>
                    <el-select @change="updateSkilLevel(skill.skillCatogry, item.skillName, item.selectedLevel)"
                        v-model="item.selectedLevel" placeholder="Select" style="width: 240px;display: inline-block;">
                        <el-option v-for="level in defaultLevels" :key="level.value" :label="level.label"
                            :value="level.value" />
                    </el-select>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script setup>
import { ref, watch, reactive, onMounted, getCurrentInstance } from 'vue'
import axios from 'axios'

const activeNames = ref([0])
const handleChange = (val) => {
    console.log(val)
}
//更新熟练度信息
function updateSkilLevel(skillCatogry, skillName, selectedLevel) {
    axios.post(proxy.$server + "/skill/updateSkillCatogry", {
        userId: sessionStorage.getItem("userId"),
        skillCatogry,
        skillName,
        selectedLevel
    }).then(res => {
        console.log("this is res.data ", res.data)
    }).catch(error => console.log(error))
}
//skillCatogries对象
const skillCatogries = reactive([])
//根据Id获得全部信息
const defaultLevels = [
    { value: 0, label: '全くできない' },
    { value: 1, label: '少しできる' },
    { value: 2, label: '普通にできる' },
    { value: 3, label: 'よくできる' },
    { value: 4, label: '非常に得意' }
]
const { proxy } = getCurrentInstance()
function fetchSkillCatogriesByUserId() {
    axios.get(proxy.$server + "/skill/getAllSkillCategriesByUserId", {
        params: {
            userId: sessionStorage.getItem("userId")
        }
    }).then(res => {
        console.log("this is res.data ", res.data)
        Object.assign(skillCatogries, res.data)
    }).catch(error => console.log(error))
}
onMounted(() => fetchSkillCatogriesByUserId())
</script>

<style lang="css" scoped>
.demo-collapse {
    max-height: 80vh;
    overflow-y: auto;
    padding-right: 8px;
    /* 防止滚动条遮住内容 */
}

</style>