<template>
    <div class="menu-text" @click="extendSubMenu" ref="dropdownButton" @mousemove="barMouseMoveHandler(0)"
        @mouseleave="barMouseLeaveHandler(0)">
        <div class="attendence-menu">勤務メニュー</div>
        <div v-if="showSubMenu" class="floating-box" ref="dropdownContainer">
            <span class="sub-menu-text" @click="toAttendance" v-show="showSubMenu"> 勤務登録 </span>
            <span class="sub-menu-text" @click="toWorkTimeSetup" v-show="showSubMenu"> 勤務時間初期設定 </span>
            <span class="sub-menu-text" @click="toWorkManual" v-show="showSubMenu"> 作業システムマニュアル </span>
        </div>
    </div>

    <div class="menu-text" @click="toSkillSubmit" @mousemove="barMouseMoveHandler(1)"
        @mouseleave="barMouseLeaveHandler(1)"> スキル登録 </div>
    <!-- <div class="menu-text" @click="toTransportationFeeSubmit" @mousemove="barMouseMoveHandler(1)" @mouseleave="barMouseLeaveHandler(1)" > 交通費登録 </div> -->
    <div class="menu-text" @click="toSendMessage" @mousemove="barMouseMoveHandler(2)"
        @mouseleave="barMouseLeaveHandler(2)"> 勤務への連絡 </div>
    <div class="menu-text" @click="toTransportationFeeList" @mousemove="barMouseMoveHandler(3)"
        @mouseleave="barMouseLeaveHandler(3)"> 交通費 </div>
    <div class="menu-text" @mousemove="barMouseMoveHandler(4)" @mouseleave="barMouseLeaveHandler(4)">
        <div class="attendence-menu">BP社要員情報管理</div>
        <div v-if="showBPSubMenu" class="floating-box">
            <span class="sub-menu-text" @click="toBPManager">BP社要員情報更新</span>
            <span class="sub-menu-text" @click="toBPResume">経歴書管理</span>
        </div>
    </div>


</template>

<script>
export default {
    data() {
        return {
            showSubMenu: false,
            showBPSubMenu: false
        }
    },
    methods: {
        barMouseMoveHandler(i) {
            let elements = document.getElementsByClassName("menu-text")
            let currentElement = elements[i];
            currentElement.style.backgroundColor = '#f1f0f5';
            if (i == 0) {
                this.showSubMenu = true;
                //document.addEventListener('click', this.handleClickOutside);
            }
            if (i == 4) {
                this.showBPSubMenu = true;
            }

        },
        barMouseLeaveHandler(i) {
            let elements = document.getElementsByClassName("menu-text")
            let currentElement = elements[i];
            currentElement.style.backgroundColor = 'white';
            if (i == 0) {
                this.showSubMenu = false;
                //document.addEventListener('click', this.handleClickOutside);
            }
            if (i == 4) {
                this.showBPSubMenu = false;
            }
        },
        changePageHandle(pageName) {
            this.$emit('changePage', pageName);
        },
        toAttendance() {
            this.changePageHandle("Attendance");
        },
        toWorkTimeSetup() {
            this.changePageHandle("WorkTimeSetup");
        },
        toWorkManual() {
            this.changePageHandle("WorkManual");
        },
        toSkillSubmit() {
            console.log("toSkillSubmit");
            this.changePageHandle("SkillSubmit");
        },
        toTransportationFeeSubmit() {
            console.log("toTransportationFeeSubmit");
            this.changePageHandle("TransportationFeeSubmit");
        },
        toSendMessage() {
            this.changePageHandle("SendMessage");
        },
        toTransportationFeeList() {
            //this.changePageHandle("TransportationFeeList");
            this.changePageHandle("MyTransportationFeeList");
        },
        toBPManager() {
            this.changePageHandle("BPInfo");
        },
        toBPResume(){
            this.changePageHandle("BPResume");
        }
    }

}
</script>

<style>
.attendence-menu {
    width: 100%;
}

.attendence-menu:hover {
    width: 100%;
    cursor: pointer;

}

.menu-text {

    justify-content: flex-end;
    white-space: nowrap;
    line-height: 50px;
    /* 高度 */
    display: flex;
    width: 100%;
    /* justify-content: flex-start; 水平居中 */
    flex-direction: column;
    align-items: flex-start;
    /* 垂直居中 */
    padding-left: 20px;
    z-index: 2;
    overflow: visible;
}

.sub-menu-text {
    background-color: white;
    text-align: left;
    display: flex;
    align-items: center;
    /* 垂直居中 */
    padding-left: 10px;
    padding-right: 10px;
    width: auto;
    font-size: 15px;
    white-space: nowrap;
    z-index: 2;
    overflow: visible;
}

.sub-menu-text:hover {
    cursor: pointer;
}

.menu-text:hover {
    cursor: pointer;
}

.floating-box {
    z-index: 2;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    margin-right: 0;
    margin-left: auto;
    background-color: #f1f0f5;
}
</style>