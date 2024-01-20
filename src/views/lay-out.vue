<script setup>
import {computed, ref} from "vue"
import axios from "axios"
import {ElLoading, ElMessage} from "element-plus"
import {useStore} from 'vuex'

let loading = null

const store = useStore()
const video = ref('')
const identifier = ref('')
const existedIdetifiers = ref([])
const is_analyzed = computed(() => store.state.is_analyzed)
const tipClass = ref('info')
const tipTitle = ref('Tips')
const tipInfo = ref('1.请先点击左侧‘UpLoad’按钮上传视频<br>2.然后点击左侧‘Analysis’按钮进行分析')
const isVisible = ref(true)

// 上传视频前调用
const beforeUpload = () => {
  startLoading('视频上传中......')
}

// 上传视频成功后调用
const uploadVideoSuccessed = (response, file) => {
  endLoading()
  video.value = file.name
  identifier.value = response.identifier
  store.commit('setVideoName', video.value)
  store.commit('setIdentifier', identifier.value)
  existedIdetifiers.value.push(identifier.value)
  console.log(file.name)
  console.log(response.identifier)
  console.log(existedIdetifiers.value)
  store.commit('setIsAnalyzed', false)
  tipClass.value = "success"
  tipInfo.value = "视频上传成功！<br>1.请点击左侧‘Analysis’按钮进行分析<br>2.或者可点击左侧‘UpLoad’按钮重新上传视频分析"
  promptMes('上传视频成功', 'success')
}

// 上传视频失败后调用
const uploadVideoFailed = () => {
  endLoading()
  promptMes('上传视频失败，请重新上传', 'error')
  tipClass.value = "error"
  tipInfo.value = "视频上传失败！<br>1.请先点击左侧‘UpLoad’按钮重新上传视频<br>2.然后点击左侧‘Analysis’按钮进行分析"
}

// 开启loading提示
const startLoading = (text) => {
  loading = ElLoading.service({fullscreen: true, text: text})
}

// 关闭loading提示
const endLoading = () => {
  loading.close()//关闭遮罩层
}

// 提示
const promptMes = (mes, type) => {
  ElMessage({
    message: mes,
    type: type,
  })
}

const showTable = () => {
  if (is_analyzed.value) {
    let requestData = {'identifier': identifier.value, 'video_name': video.value}
    //   let requestData = {'identifier': '20231207160249', 'video_name': '2021_10_11_21_49_59_ch01.avi'}
    axios.post('http://127.0.0.1:5000/showTable', JSON.stringify(requestData), {headers: {'Content-Type': 'application/json'}})
        .then(response => {
          console.log('请求表格成功', response.data)
          store.commit('setTableHeader', response.data.header)
          store.commit('setTableData', response.data.datas)
        }).catch(error => {
      console.log('请求表格失败', error)
    })
  } else {
    promptMes('视频还未分析', 'warning')
  }
}

const analysis = async () => {
  //判断是否上传了视频
  if (video.value === '') {
    promptMes('请先上传视频', 'warning')
  } else if (is_analyzed.value) {
    promptMes('视频已经分析完成', 'warning')
  } else {
    startLoading('视频正在分析中......')
    let requestData = {'identifier': identifier.value, 'video_name': video.value}
    await axios.post('http://127.0.0.1:5000/analysis',
        JSON.stringify(requestData),
        {headers: {'Content-Type': 'application/json'}})
        .then(response => {
          endLoading()
          if (response.data.code === 200) {
            promptMes('视频分析完成', 'success')
            store.commit('setIsAnalyzed', true)
            store.commit('setIndexLine', response.data.indexLine)
            tipClass.value = "success"
            tipInfo.value = "视频分析成功！<br>1.请点击右上方导航栏进入相应模块查看结果<br>2.可点击左侧‘UpLoad’按钮重新上传新视频分析"
            // 请求数据
            showTable()
          } else {
            promptMes('视频处理过程中出现错误', 'error')
            tipClass.value = "error"
            tipInfo.value = "视频处理过程中出现错误！<br>1.请先点击左侧‘UpLoad’按钮重新上传视频<br>2.然后点击左侧‘Analysis’按钮进行分析"
          }
        }).catch(err => {
          endLoading()
          promptMes('视频处理过程中出现错误', 'error')
          console.log(err)
          tipClass.value = "error"
          tipInfo.value = "视频处理过程中出现错误！<br>1.请先点击左侧‘UpLoad’按钮重新上传视频<br>2.然后点击左侧‘Analysis’按钮进行分析"
        })
  }
}

const closeTip = () => {
  isVisible.value = false
}

const openTip = () => {
  isVisible.value = true
}

</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header style="background-color: #545c64">
        <el-menu
            active-text-color="#ffd04b"
            background-color="#545c64"
            class="el-menu-demo"
            mode="horizontal"
            :ellipsis="false"
            text-color="#fff"
            router
        >
          <el-menu-item  id="theme_icon">
                <span class="iconfont icon-Fish"></span>鱼类行为分析系统
          </el-menu-item>

          <el-menu-item index="/" id="home" @click="openTip">
            <span class="iconfont icon-shouye"></span>&nbsp;Home
          </el-menu-item>

          <div class="flex-grow"/>
          <el-menu-item index="/video" @click="closeTip"><span class="iconfont icon-shipinbofang"></span><span>&nbsp;Video</span>
          </el-menu-item>
          <el-menu-item index="/charts" @click="closeTip"><span class="iconfont icon-fenxi"></span><span>&nbsp;Charts</span>
          </el-menu-item>
          <el-menu-item index="/table" @click="closeTip"><span class="iconfont icon-biaodanzujian-biaoge"></span><span>&nbsp;Table</span>
          </el-menu-item>
        </el-menu>

      </el-header>

      <el-container>
        <el-aside>
          <el-menu
              active-text-color="#ffd04b"
              background-color="#545c64"
              class="el-menu-vertical-demo"
              text-color="#fff"
              style="height: 100%"
          >
            <!--Function Pannel-->
            <el-menu-item>
              <template #title>
                <span class="menu-title"><span class="iconfont icon-gongnengdingyi"></span> &nbsp;Function Pannel</span>
              </template>
            </el-menu-item>

            <div style="display: flex; flex-direction: column;">
              <div style="display: flex; flex-direction: column; align-items: center;margin-top: 20px">
                <el-upload accept="video/*"
                           action="http://127.0.0.1:5000/upLoadVideo"
                           :on-success="uploadVideoSuccessed"
                           :before-upload="beforeUpload"
                           :on-error="uploadVideoFailed"
                           :show-file-list=false>
                  <el-button><span class="iconfont icon-shipinshangchuan"></span> &nbsp;&nbsp;&nbsp;Upload</el-button>
                </el-upload>
              </div>
              <div
                  style="display: flex; flex-direction: column; align-items: center;margin-top: 20px;margin-bottom: 40px;padding-bottom: 20px;">
                <el-button @click="analysis"><span class="iconfont icon-shujufenxi-liuliangfenxi"></span> &nbsp;Analysis
                </el-button>
              </div>

            </div>
          </el-menu>
        </el-aside>
        <el-main style="background-color: #E6E8EB">
           <el-result :icon="tipClass" :title="tipTitle" v-show="isVisible">
             <template #sub-title>
              <p v-html="tipInfo"></p>
            </template>
           </el-result>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.common-layout {
  .el-container {
    height: 100vh;

    .el-aside {
      width: 185px;
    }
  }
}

.el-menu-demo{
  border-bottom: none;
}

#theme_icon{
  pointer-events: none;
  width: 185px;
  font-family: "Daoliti";
  font-size: x-large;
  margin: 0 25px;
}
.icon-Fish{
  font-size: xx-large;
}
.iconfont{
  margin-right: 3px;
}
.flex-grow {
  flex-grow: 1;
}
</style>