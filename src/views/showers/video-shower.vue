<template style="background-color: lightgray">
  <el-row :gutter="20">
    <el-col :span="19" style="height: 85vh;border-right: 2px solid #d4d5d9;padding-right: 10px">
      <el-row>
        <el-select v-model="selectID" class="m-2" :placeholder="selectID" @change="selectFish">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>

        <div class="flex-grow"/>
        <el-button @click="downloadVideo"><span class="iconfont icon-video-download-line"></span> &nbsp;Download Video</el-button>
      </el-row>
      <div class="video_box">
        <video id="videoDom" style="width: 100%;margin-top: 20px" controls :src="video_src">
        </video>
      </div>
    </el-col>
    <el-col :span="5" style="height: 100%">
      <el-row><span style="color:#73767a;margin-top: 2px;background-color: white;padding: 5px;border-radius:3px">Real-time Data</span></el-row>
      <el-table :data="indexData" border style="width: 100%;margin-top: 20px">
        <el-table-column prop="index" label="index"/>
        <el-table-column prop="value" label="value" sortable/>
      </el-table>
    </el-col>
  </el-row>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import {useStore} from 'vuex'
import axios from "axios";
import {ElLoading, ElMessage} from "element-plus";

const indexData = ref([])

let loading = null
const store = useStore()
const identifier = computed(() => store.state.identifier)
const is_analyzed = computed(() => store.state.is_analyzed)
const video_name = computed(() => store.state.video_name)
const table_data = computed(() => store.state.table_data)
const video_src = ref('')
const selectID = ref('')
const indexLine = computed(() => store.state.indexLine)
const options = []
selectID.value = indexLine.value[0]

for (let i in indexLine.value) {
  console.log(indexLine.value[i])
  let option = {value: indexLine.value[i], label: indexLine.value[i]}
  options.push(option)
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

onMounted(() => {
  selectFish()
  let videoDom = document.getElementById('videoDom')
  videoDom.addEventListener('timeupdate', () => {
    refreshIndexData(selectID.value, Math.floor(videoDom.currentTime))
  })
})

// 选择指定鱼后播放视频和数据
const selectFish = () => {
  if (identifier.value === '') {
    promptMes('您还未上传视频', 'warning')
  } else if (is_analyzed.value === false) {
    promptMes('您上传的视频还未分析', 'warning')
  } else if (selectID.value === '') {
    promptMes('请先选择一个视频', 'waring')
  } else {
    startLoading('正在请求后台数据中......')
    console.log('selectID:', selectID.value)
    let requestData = {'identifier': identifier.value, 'selectedID': selectID.value, 'video_name': video_name.value}
    axios.post('http://127.0.0.1:5000/selectFish', JSON.stringify(requestData), {headers: {'Content-Type': 'application/json'}})
        .then(response => {
          endLoading()
          if (response.data.code === 200) {
            console.log('视频请求成功', response)
            video_src.value = 'http://127.0.0.1:5000/static/3D-ZeF/data/' + identifier.value + '/D1_T1/bg_processed/' + selectID.value + '/' + video_name.value.slice(0, -4) + '.mp4'
            console.log('请求后的视频路径：', video_src.value)
            // console.log(videoBlob)'
            promptMes('视频数据请求成功', 'success')
            refreshIndexData(selectID.value, 0)
          }
        }).catch(error => {
      endLoading()
      promptMes('视频数据请求失败', 'error')
      console.log(error)
    })
  }
}

const refreshIndexData = (fishID, vTime) => {
  console.log('table_data.value:', table_data.value)
  console.log('fishID:', fishID)
  console.log('vTime:', vTime)
  let oneData = (table_data.value.filter(function (item) {
    return item.region_name === fishID && item.timestamp_min_id === vTime;
  }))[0]
  console.log(oneData)
  indexData.value = []
  for (let i in oneData) {
    console.log('oneData i:', i)
    console.log('oneData[i]:', oneData[i])
    let a = {
      index: i,
      value: oneData[i]
    }
    indexData.value.push(a)
  }
  // indexData.value = [
  // ]
}

const downloadVideo = () => {
  if (identifier.value === '') {
    promptMes('您还未上传视频', 'warning')
  } else if (is_analyzed.value === false) {
    promptMes('您上传的视频还未分析', 'warning')
  } else {
    startLoading('正在请求后台数据中......')
    console.log('selectID:', selectID.value)
    let requestData = {'identifier': identifier.value, 'selectedID': selectID.value, 'video_name': video_name.value}
    axios.post('http://127.0.0.1:5000/downloadVideo', JSON.stringify(requestData), {
      headers: {'Content-Type': 'application/json'},
      responseType: 'blob'
    })
        .then(response => {
              endLoading()
              if (response.data.code === 400) {
                promptMes('下载请求失败' + response.data.message, 'success')
              } else {
                console.log('下载视频时返回的数据：')
                const blobUrl = window.URL.createObjectURL(response.data)
                const a = document.createElement('a')
                a.style.display = 'none'
                a.download = selectID.value + video_name.value
                a.href = blobUrl
                a.click()
              }
            }
        ).catch(error => {
      endLoading()
      promptMes('视频数据请求失败', 'error')
      console.log(error)
    })
  }
}
</script>

<style scoped>
.video_box {
  padding-bottom: 56.25%;
  width: 100%;
  position: relative;
}

.video_box video {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  object-fit: cover;
}


.flex-grow {
  flex-grow: 1;
}
</style>