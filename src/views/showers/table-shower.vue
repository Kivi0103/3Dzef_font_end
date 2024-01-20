<template>
  <el-row justify="end">
    <el-button @click="downloadCSV"><span class="iconfont icon-accept"></span> &nbsp;Download File</el-button>
  </el-row>
  <el-row style="margin-top: 10px">
    <el-table :data="table_data" border stripe style="width: 100%">
    <el-table-column v-for="(item,index) in header" :key="index" :prop="item.prop" :label="item.label" sortable/>
  </el-table>
  </el-row>
</template>

<script setup>

import {useStore} from "vuex";
import {computed, onMounted} from "vue";
import {ElLoading, ElMessage} from "element-plus";
import axios from "axios";

const store = useStore()

const video_name = computed(() => store.state.video_name)
const identifier = computed(() => store.state.identifier)
const is_analyzed = computed(() => store.state.is_analyzed)

const header = computed(() => store.state.table_header)
const table_data = computed(() => store.state.table_data)

// 提示
const promptMes = (mes, type) => {
  ElMessage({
    message: mes,
    type: type,
  })
}

onMounted(()=>{
  showTable()
})

const showTable = () => {
  // header.value = []
  // table_data.value = []
  if(is_analyzed.value){
  //   let requestData = {'identifier': identifier.value, 'video_name': video_name.value}
  // //   let requestData = {'identifier': '20231207160249', 'video_name': '2021_10_11_21_49_59_ch01.avi'}
  //   axios.post('http://127.0.0.1:5000/showTable', JSON.stringify(requestData), {headers: {'Content-Type': 'application/json'}})
  //     .then(response=>{
  //       console.log('请求表格成功',response.data)
  //       // let headers = response.data.header
  //       // for (let headersKey in headers) {
  //       //   let h = {
  //       //     prop: headers[headersKey],
  //       //     label: headers[headersKey]
  //       //   }
  //       //   header.value.push(h)
  //       // }
  //       store.commit('setTableHeader', response.data.header)
  //       // tableData.value = response.data.datas
  //       store.commit('setTableData', response.data.datas)
  //       // console.log(header.value)
  //       // console.log(table_data.value)
  //
  //     }).catch(error=>{
  //       console.log('请求表格失败',error)
  //   })
    promptMes('表格加载成功', 'success')
  }else{
    promptMes('视频还未分析', 'warning')
  }
}

let loading = null
// 开启loading提示
const startLoading = (text) => {
  loading = ElLoading.service({fullscreen: true, text: text})
}

// 关闭loading提示
const endLoading = () => {
  loading.close()//关闭遮罩层
}

const downloadCSV = () => {
  if (identifier.value === '') {
    promptMes('您还未上传视频', 'warning')
  } else if (is_analyzed.value === false) {
    promptMes('您上传的视频还未分析', 'warning')
  } else {
    startLoading('正在请求后台数据中......')
    let requestData = {'identifier': identifier.value, 'video_name': video_name.value}
    axios.post('http://127.0.0.1:5000/downloadCSV', JSON.stringify(requestData), {headers: {'Content-Type': 'application/json'}, responseType: 'blob'})
        .then(response => {
              endLoading()
              if (response.data.code === 400) {
                promptMes('下载请求失败' + response.data.message, 'success')
              } else {
                console.log('下载数据时返回的数据：')
                const blobUrl = window.URL.createObjectURL(response.data)
                const a = document.createElement('a')
                a.style.display = 'none'
                a.download = 'datas.csv'
                a.href = blobUrl
                a.click()
              }
            }
        ).catch(error => {
      endLoading()
      promptMes('数据请求失败', 'error')
      console.log(error)
    })
  }
}

</script>

<style scoped>

</style>