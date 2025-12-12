<template>
<nav class="mat-toolbar primary-color">

    <div class="container">
        <div class="left-box">
            <img class="setsuImg" src = "\src\const-resource\setsuIcon.png">
        </div>
        <div class="right-box user-menu">
            <button @click="showMenu" @mousemove="showMenu" @mouseleave="hideMenu">{{username}}</button>
                <div class="menu-content" v-show="isMenuVisible" @mousemove="showMenu" @mouseleave="hideMenu">
                    <button @click="changePassword">修改密码</button>
                    <button id="last1" @click="logout">退出登录</button>
                </div>
        </div>
    </div>
    </nav>
</template>

<script>
    import EventBus from '../../eventBus.js';
    export default {
        data() {
            return {
                isMenuVisible: false,
                hideTimeout: null,
                username: "ログイン"
            };
    },
    mounted(){
        this.$data.username = sessionStorage.getItem("username");
    },
    methods: {
            // 发布一个自定义事件
            logout() {
                console.log("logging out");
                EventBus.emit('LogOut');
            },

            changePassword(){
                console.log("before ChangePassword")
                EventBus.emit('ChangePassword');
                console.log("after ChangePassword")
            },

            // 处理事件
            handleEvent(data) {
            // 处理接收到的数据
                },

            showMenu() {
                // console.log("show menu");
                clearTimeout(this.hideTimeout); // 清除之前的计时器
                this.isMenuVisible = true; // 显示菜单
                },
            hideMenu() {
                // 设置计时器，在 2 秒后隐藏菜单
                this.hideTimeout = setTimeout(() => {
                    this.isMenuVisible = false;
                }, 2000);
            }
        }
    }
</script>

<style>
.mat-toolbar {
  /* background-color: #003366; 深蓝色背景 */
  margin: none;
}

.container {
  display: flex;
  justify-content: space-between;
}

.left-box {
    width: 400px;
    height: 90px;

    display: flex;
    align-items: center; /* 垂直居中 */
    
}

.right-box {
    width: 300px;
    height: 70px;
   
    display: flex;
    align-items: center; /* 垂直居中 */
}

#company-name{
    color: white;
    font-size: 30px;
    margin-left: 20px;
}

.right-box > button{
    margin: 0;
    margin-left: 80px;
    width: 140px; 
    border: 1px solid #ccc; /* 添加边框 */
    background: none;
    padding: 5px 0px; /* 可以根据需要调整内边距 */
    cursor: pointer; /* 将鼠标样式改为手指形状 */
    /* 其他你需要的样式 */
}

.user-menu {
    position: relative;
}

.user-menu .menu-content {
    display: block;
    position: absolute;
    top: 100%; /* 使菜单出现在用户名按钮下方 */
    left: 0; /* 与用户名按钮左对齐 */
    width: 300px; 
    /* 可以根据需要调整宽度、背景颜色等 */
    background-color: hsl(0, 65%, 61%); /* 举例背景颜色 */
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2); /* 可选的阴影效果 */
    z-index: 1; /* 确保菜单在其他元素之上 */
}

.user-menu button:hover + .menu-content {
    display: block;
}

.user-menu .menu-content:hover{
    display: block;
}


.menu-content > button{
    width: 140px; 
    margin-top: 10px;
    margin-bottom: 0px; 
    margin-left: 80px;
    margin-right: 80px; 
    border: 1px solid #ccc; /* 添加边框 */
    background: none;
    padding: 5px 0px; /* 可以根据需要调整内边距 */
    cursor: pointer; /* 将鼠标样式改为手指形状 */
}

.menu-content > button:last-child{
    margin-bottom: 10px;
}

</style>