<template>
    <h1>修改密码</h1>
    <div>
        旧密码<input v-model="oldPassword" type="password"/>
    </div>
    <div>
        新密码<input v-model="newPassword" type="password"/>
    </div>
    <button @click="changePassword">
        修改密码
    </button>
    <button @click="cancelChangePassword">
        取消修改
    </button>
</template>

<script>
    import EventBus from '../../eventBus.js';
    export default {
        data(){
            return {
                oldPassword: '',
                newPassword: ''
            };
        },
        methods:{
            changePassword() {
                // 添加修改密码的逻辑
                EventBus.emit('LogOut');
            },
            changePageHandle(pageName){
                this.$emit('changePage', pageName);
            },
            cancelChangePassword() {
                // 处理返回登录页面的逻辑
                this.changePageHandle("last");
            }
        }
    }
</script>

<style>
/* 添加一些CSS样式 */
</style>
