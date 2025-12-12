<template>
  <link href="./src/slidercaptcha.css">
  <TopBar />
  <div class="bg">
    <div class="loginArea">
      <img src="\src\const-resource\setsuIcon.png">
      <div class="card">
        <p>勤務管理システム</p>
        <span class="loginFlag" v-if="loginFlag">ログイン情報が正しくありません。再度お試しください。</span><br>
        <el-input v-model="personalID" placeholder="个人ID" id="personalID" />
        <el-input v-model="password" placeholder="パスワード" id="password" type="password" show-password="true" />
        <!--          <el-input v-model="authenticCode" placeholder="認証コード" id="authenticCode"/>-->
        <el-button class='el-button' plain @click="onSuccess">ログイン</el-button>
        <!--          <el-dialog v-model="dialogTableVisible" title="请验证" width="400">-->
        <!--              <slide-verify :key="reinputCount" ref="block" :slider-text="text" :accuracy="accuracy" @again="onAgain" @success="onSuccess" @fail="onSuccess" @refresh="onRefresh" ></slide-verify>-->
        <!--              <div>{{ msg }}</div>-->
        <!--          </el-dialog>-->
        <!--          <button class='el-button' @click="login">ログイン</button>-->
      </div>

    </div>
  </div>
  <div>

  </div>

</template>

<script>
import axios from 'axios';
import TopBar from "../topbar/topbar-before-login.vue";

import { ElMessage, ElMessageBox } from 'element-plus'

//import sliderCaptcha from '@fortawesome/fontawesome-free/js/all.js'; // 引入 Font Awesome JS（包含 sliderCaptcha）



import SlideVerify from "vue3-slide-verify";



import forge from 'node-forge';
import { defineComponent, ref } from "vue";
import "vue3-slide-verify/dist/style.css";

import Attendance from '../attendance/attendance.vue';
// @ts-ignore

//const NodeRSA = require('node-rsa');

export default {
  props: ['server'],
  data() {
    return {
      loginFlag: false,
      personalID: '',
      password: '',
      authenticCode: '',
      responseData: "",
      text: "请滑动按钮",
      msg: "请滑动按钮",
      dialogTableVisible: false,
      reinputCount: 0
    };
  },
  components: {
    TopBar,
    Attendance,
    SlideVerify
  },
  methods: {



    loginSuccessHandle() {
      console.log("登录成功了");
      this.$emit('logInSuccessMsg');
    },


    async keyExchange() {

    },
    // 生成RSA密钥对
    async generateRSAKeyPair() {
      try {
        const keyPair = await crypto.subtle.generateKey(
          {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: "SHA-256"
          },
          true,
          ["encrypt", "decrypt"]
        );

        return keyPair;
      } catch (error) {
        console.error("Error generating RSA key pair:", error);
      }
    },
    /* generateRSAKeyPairUseForge() {
      const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
      let publicKeyPem = forge.pki.publicKeyToPem(keyPair.publicKey);
      let privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey);
      publicKeyPem = this.removePEMHeaderFooter(publicKeyPem)
      privateKeyPem = this.removePEMHeaderFooter(privateKeyPem)
      return { publicKey: publicKeyPem, privateKey: privateKeyPem }; 这里面的内容被更改为了后续
    } 暂时测试后续这个*/
    generateRSAKeyPairUseForge() {
      const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 });

      // 公钥（本来就是 PKCS8，没问题）
      const publicKeyPem = forge.pki.publicKeyToPem(keyPair.publicKey);

      // ① 先得到 PKCS1 的私钥 ASN.1
      const rsaPrivateKeyAsn1 = forge.pki.privateKeyToAsn1(keyPair.privateKey);

      // ② 转成 PKCS8 的 PrivateKeyInfo ASN.1
      const privateKeyInfo = forge.pki.wrapRsaPrivateKey(rsaPrivateKeyAsn1);

      // ③ 转成 PEM（最终给 Java）
      const privateKeyPkcs8 = forge.pki.privateKeyInfoToPem(privateKeyInfo);

      return {
        publicKey: publicKeyPem,
        privateKey: privateKeyPkcs8
      };
    },

    removePEMHeaderFooter(pemKey) {
      // 使用正则表达式匹配并替换页眉和页脚
      return pemKey.replaceAll('\r', '').replaceAll('\n', '').replace('-----BEGIN PUBLIC KEY-----', '').replace('-----END PUBLIC KEY-----', '').replace('-----BEGIN RSA PRIVATE KEY-----', '').replace('-----END RSA PRIVATE KEY-----', '');

    },
    // generateRSAKeyPairWithNodeRSA(){
    //   const NodeRSA = require('node-rsa');

    //   const key = new NodeRSA({ b: 2048 }); //生成512, 1024, 2048位的密钥
    //   var publicKey = key.exportKey("pkcs8-public"); //公钥
    //   var privateKey = key.exportKey('pkcs8-private');//私钥
    //   console.log('Public Key:', publicKey);
    //   console.log('Private Key:', privateKey);
    // },


    // 获取RSA公钥
    async exportRSAPublicKey(keyPair) {
      try {
        const exportedKey = await crypto.subtle.exportKey("spki", keyPair.publicKey);
        const exportedKeyArray = new Uint8Array(exportedKey);

        return exportedKeyArray;
      } catch (error) {
        console.error("Error exporting RSA public key:", error);
      }
    },

    // 获取RSA私钥
    async exportRSAPrivateKey(keyPair) {
      try {
        const exportedKey = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
        const exportedKeyArray = new Uint8Array(exportedKey);

        return exportedKeyArray;
      } catch (error) {
        console.error("Error exporting RSA private key:", error);
      }
    },

    // 示例用法
    async generateAndExportKeys() {
      const keyPair = await this.generateRSAKeyPair();
      console.log(keyPair);
      if (keyPair) {
        let publicKey = await this.exportRSAPublicKey(keyPair);
        let privateKey = await this.exportRSAPrivateKey(keyPair);
        sessionStorage.setItem('publicKey', btoa(String.fromCharCode.apply(null, publicKey)))
        sessionStorage.setItem('privateKey', btoa(String.fromCharCode.apply(null, privateKey)))
        console.log("RSA Public Key:", btoa(String.fromCharCode.apply(null, publicKey)));
        console.log("RSA Private Key:", btoa(String.fromCharCode.apply(null, privateKey)));
      }
    },


    str2ab(str) {
      const buf = new ArrayBuffer(str.length);
      const bufView = new Uint8Array(buf);
      for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
      }
      return buf;
    },

    encryptTextWithRSAOAEP(text, publicKey) {
      const publicKeyObj = forge.pki.publicKeyFromPem(publicKey);
      const encrypted = publicKeyObj.encrypt(text, 'RSA-OAEP', {
        md: forge.md.sha1.create(), // 使用 SHA-1 哈希算法
      });
      return forge.util.encode64(encrypted);
    },

    async encryptDataWithPublicKey(data, publicKey) {

      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(JSON.stringify(data));

      // Convert Base64 public key to ArrayBuffer
      const binaryDerString = window.atob(publicKey);
      // convert from a binary string to an ArrayBuffer
      const binaryDer = this.str2ab(binaryDerString);

      // Import the public key
      const importedKey = await crypto.subtle.importKey(
        'spki',
        binaryDer,
        { name: 'RSA-OAEP', hash: 'SHA-1', mgf: 'SHA-1' },
        true,
        ['encrypt']
      );

      // Encrypt the data
      const encryptedData = await crypto.subtle.encrypt(
        { name: 'RSA-OAEP', hash: 'SHA-1', mgf: 'SHA-1' },
        importedKey,
        dataBuffer
      );

      // Convert the encrypted data to Base64
      const encryptedDataArray = Array.from(new Uint8Array(encryptedData));
      const encryptedDataString = btoa(String.fromCharCode(...encryptedDataArray));

      return encryptedDataString;
    },

    encryptTextWithRSAOAEPUseForge(text, publicKey) {
      publicKey = `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`;
      const publicKeyObj = forge.pki.publicKeyFromPem(publicKey);
      const encrypted = publicKeyObj.encrypt(text, 'RSA-OAEP', {
        md: forge.md.sha1.create(), // 使用 SHA-1 哈希算法
      });
      return forge.util.encode64(encrypted);
    },


    onAgain() {
      let block = ref("block")
      this.msg = "检测到非人为操作的哦！ try again";
      // 刷新
      block.value?.refresh();
    },

    async onSuccess() {
      this.msg = 'login success';
      console.log(this.personalID, this.password, this.authenticCode);
      let keyPair = this.generateRSAKeyPairUseForge();
      sessionStorage.setItem('publicKey', keyPair.publicKey)
      sessionStorage.setItem('privateKey', keyPair.privateKey)
      //await this.generateAndExportKeys();               使用crypto的时候开启（仅支持HTTPS）
      try {
        //console.log(this.$server);
        let response = await axios.post(this.$server + "/user/exchange", {
          clientPublicKey: sessionStorage.getItem('publicKey'),
        });
        console.log("this is response.data.data ", response.data.data)

        sessionStorage.setItem('serverPublicKey', response.data.data.serverPublicKey)
      } catch (error) {
        console.error(error);
        alert("予期せぬエラーが発生しました。システム管理者に連絡してください。")
      }

      try {
        let sendMessage = JSON.stringify({
          userId: this.personalID,
          password: this.password
        })
        let em = this.encryptTextWithRSAOAEPUseForge(sendMessage, sessionStorage.getItem('serverPublicKey'))
        //let em = await this.encryptDataWithPublicKey(sendMessage,sessionStorage.getItem('serverPublicKey'))               使用crypto的时候开启（仅支持HTTPS）

        //console.log(em)
        //  this.$server
        let response = await axios.post(this.$server + "/user/login", {
          clientPublicKey: sessionStorage.getItem('publicKey'),
          token: em,
          // userId: this.personalID,
          // password: this.password
        });
        this.responseData = response.data;
        //console.log("response body")
        //console.log(this.responseData)
        if (this.responseData.state === 200) {
          this.loginSuccessHandle();
          console.log(this.responseData.data.username)
          sessionStorage.setItem("username", this.responseData.data.username)
          sessionStorage.setItem("userId", this.responseData.data.userId)
          this.dialogTableVisible = false
        }
        else {
          this.reinputCount += 1;
          this.dialogTableVisible = false
          this.loginFlag = true;

        }
      } catch (error) {
        console.error(error); // 处理错误
      }

    },

    onFail() {
      let block = ref("block")
      this.msg = "验证不通过";
      setTimeout(() => { this.msg = "请滑动按钮"; }, 1000)
    },

    async onRefresh() {
      //let block = ref("block")
      this.msg = "请滑动按钮";

    },

    handleClick() {
      // 刷新
      let block = ref("block")

      block.value?.refresh();

    },



    // async confirmValid(){

    //   let result = await ElMessageBox.confirm(
    //     '<slide-verify ref="block" :slider-text="text" :accuracy="accuracy" @again="onAgain" @success="onSuccess" @fail="onFail" @refresh="onRefresh" ></slide-verify><div>{{ msg }}</div>',
    //     '検証して、お願いします。',
    //     {
    //       confirmButtonText: '続ける',
    //       cancelButtonText: '取消',
    //       type: 'info',
    //       center: true,
    //       dangerouslyUseHTMLString: true,
    //     }
    //   )
    //   .then(() => {
    //       ElMessage({
    //         type: 'success',
    //         message: 'Delete completed',
    //       })
    //       return true;
    //     })
    //   .catch(() => {
    //       ElMessage({
    //         type: 'info',
    //         message: 'Delete canceled',
    //       })
    //       return false;
    //     })
    //   return result;
    // },

    async login() {

      this.dialogTableVisible = true

      //后续逻辑已移动到onSuccess函数

    },
  }
};
</script>

<style>
body,
html {
  background-image: url('/src/const-resource/background.jpg');

  background-size: 100% 100%;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.loginFlag {
  color: #FF0000;
  font-size: smaller;

  display: inline-block;
  width: 85%;
  /* 设置你想要的宽度 */

}

#app {
  height: 100%;
}

.el-dialog {
  align-items: center;
}

.bg {
  position: fixed;



  height: 100%;

  padding-top: 50px;
  padding-bottom: 50px;
  display: flex;
  justify-content: flex-end;
  /* 设置 .loginArea 内的元素右对齐 */
  align-items: flex-start;
  ;



  width: 100%;

  .loginArea {
    display: flex;
    margin-top: 5%;
    justify-content: flex-end;
    /* 设置 .loginArea 内的元素右对齐 */
    align-items: center;
    flex-direction: column;
    margin-right: 200px;
  }

  .card {
    padding-bottom: 20px;
    border-radius: 10px;
    margin-top: 20px;
    width: 300px;
    /* display: flex; */
    /* flex-direction: column; */
    text-align: center;
    background-color: white;

    p {
      margin-top: 5%;
      margin-bottom: 5%;
      font-size: 18px;
      font-weight: 700;
    }

    .el-input {
      width: 85%;
      margin: 10px 10px;
      color: gray;
      border-color: lightgray;

    }

    .el-button {
      border-radius: 20px;
      padding: 7px 78px;
      color: white;
      margin: 15px 10px;
      background-color: #4D7BAF;
      font-size: 16px;
    }
  }
}
</style>