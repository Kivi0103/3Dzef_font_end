<template>
  <el-row style="height:50%">
    <el-col :span="24">
      <div id="chartFir" style="height: 100%;width: 100%">No Chart</div>
    </el-col>
  </el-row>
  <el-row style="height:50%">
    <el-col :span="24">
      <div class="grid-content ep-bg-purple" id="chartSec" style="height: 100%;width: 100%">No Chart</div>
    </el-col>
  </el-row>

  <el-row style="height:50%">
    <el-col :span="24">
      <div class="grid-content ep-bg-purple-light" id="chartThi" style="height: 100%;width: 100%">No Chart</div>
    </el-col>
  </el-row>

</template>

<script setup>
import {useStore} from "vuex";
import {computed, onMounted} from "vue";
import * as echarts from 'echarts'
import {ElMessage} from "element-plus";

const store = useStore()

const is_analyzed = computed(() => store.state.is_analyzed)

const table_data = computed(() => store.state.table_data)

let lineNum = 0
let totalDuration
let indexLine = []
// 提示
const promptMes = (mes, type) => {
  ElMessage({
    message: mes,
    type: type,
  })
}

const drawChart = () => {
  if(is_analyzed.value){
  drawChart1()
  drawChart2()
  drawChart3()
    promptMes('图表加载成功', 'success')
  }else{
    promptMes('视频还未分析', 'warning')
  }
}

onMounted(() => {
  drawChart()
})

const drawChart1 = () => {
  let chart = document.getElementById("chartFir")
  if (chart.getAttribute('_echarts_instance_') != null) {
    chart.removeAttribute('_echarts_instance_')
  }
  let chart1 = echarts.init(chart)
  let seriesList = []
  let velocityData = {'1_6PPD1ppm': [], '2_6PPD1ppm': [], '3_6PPD1ppm': [], '4_6PPD1ppm': []}
  // 生成数据
  let x
  for (x in table_data.value) {
    velocityData[table_data.value[x].region_name].push(table_data.value[x].velocity)
  }

  let v
  for (v in velocityData) {
    if (!(velocityData[v].length === 0)) {
      indexLine.push(v)
      seriesList.push(
          {
            name: v,
            data: velocityData[v],
            type: 'line'
          }
      )
      lineNum += 1
    }
  }

  totalDuration = (Number(x) + 1) / lineNum
  let option = {
    title: {
      text: '速度/时间变化'
    },
    legend: {
      data: indexLine
    },
    grid: {
      left: '3%',
      right: '10%',
      bottom: '5%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    tooltip: {
      trigger: 'axis',
      show: true
    },
    xAxis: {
      name: 'time(s)',
      type: 'category',
      boundaryGap: false,
      data: Array.from({length: totalDuration}, (_, i) => i)
    },
    yAxis: {
      name: 'velocity(m/s)',
      type: 'value'
    },
    series: seriesList
  }
  chart1.setOption(option)
}
const drawChart2 = () => {
  let chart = document.getElementById("chartSec")
  if (chart.getAttribute('_echarts_instance_') != null) {
    chart.removeAttribute('_echarts_instance_')
  }
  let chart2 = echarts.init(chart)
  let seriesList = []
  let topTimeData = {'1_6PPD1ppm': [], '2_6PPD1ppm': [], '3_6PPD1ppm': [], '4_6PPD1ppm': []}
  // 生成数据
  // console.log(table_data.value)
  let x
  for (x in table_data.value) {
    // console.log(table_data.value[x].region_name)
    topTimeData[table_data.value[x].region_name].push(table_data.value[x].top_time)
  }
  // console.log(topTimeData)
  let v
  for (v in topTimeData) {
    // console.log(typeof (v))
    if (!(topTimeData[v].length === 0)) {
      let a = topTimeData[v]
      for (let i = 0; i < a.length; i++) {
        a[i] = Number(a[i]) * 2
        if (!(i === 0)) {
          // console.log('i:::', i)
          a[i] = a[i - 1] + a[i] * 2
        }
        // console.log('a[' + i + ']:' + a[i])
      }
      seriesList.push(
          {
            name: v,
            data: topTimeData[v],
            type: 'line'
          }
      )
    }
  }

  let option = {
    title: {
      text: '鱼上层分布时间变化'
    },
    legend: {
      data: indexLine
    },
    grid: {
      left: '3%',
      right: '10%',
      bottom: '5%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    tooltip: {
      trigger: 'axis',
      show: true
    },
    xAxis: {
      name: 'time(s)',
      type: 'category',
      boundaryGap: false,
      data: Array.from({length: totalDuration}, (_, i) => i)
    },
    yAxis: {
      name: 'time(s)',
      type: 'value'
    },
    series: seriesList
  }
  chart2.setOption(option)
}
const drawChart3 = () => {
  let chart = document.getElementById("chartThi")
  if (chart.getAttribute('_echarts_instance_') != null) {
    chart.removeAttribute('_echarts_instance_')
  }
  let chart3 = echarts.init(chart)
  let angleData = {
    '1_6PPD1ppm': {'up_down_angle_0_15': 0, 'up_down_angle_15_45': 0, 'up_down_angle_45_91': 0, 'other': 0},
    '2_6PPD1ppm': {'up_down_angle_0_15': 0, 'up_down_angle_15_45': 0, 'up_down_angle_45_91': 0, 'other': 0},
    '3_6PPD1ppm': {'up_down_angle_0_15': 0, 'up_down_angle_15_45': 0, 'up_down_angle_45_91': 0, 'other': 0},
    '4_6PPD1ppm': {'up_down_angle_0_15': 0, 'up_down_angle_15_45': 0, 'up_down_angle_45_91': 0, 'other': 0},
  }
  // 生成数据
  console.log(table_data.value)
  let x
  for (x in table_data.value) {
    console.log(table_data.value[x].region_name)
    angleData[table_data.value[x].region_name]['up_down_angle_0_15'] += Number(table_data.value[x].up_down_angle_0_15)
    angleData[table_data.value[x].region_name]['up_down_angle_15_45'] += Number(table_data.value[x].up_down_angle_15_45)
    angleData[table_data.value[x].region_name]['up_down_angle_45_91'] += Number(table_data.value[x].up_down_angle_45_91)
  }
  console.log(angleData)
  let angle0_15 = []
  let angle15_45 = []
  let angle45_91 = []
  let other = []
  let v
  for (v in indexLine) {
    console.log(indexLine[v])
    let a = angleData[indexLine[v]]['up_down_angle_0_15']
    angle0_15.push(a)
    let b = angleData[indexLine[v]]['up_down_angle_15_45']
    angle15_45.push(b)
    let c = angleData[indexLine[v]]['up_down_angle_45_91']
    angle45_91.push(c)
    angleData[indexLine[v]]['other'] = totalDuration - a.toFixed(3) - b.toFixed(3) - c.toFixed(3)
    other.push(angleData[indexLine[v]]['other'])
  }

  console.log('angle0_15', angle0_15)
  console.log('angle15_45', angle15_45)
  console.log('angle45_91', angle45_91)
  console.log('other', other)

  let option = {
    title: {
      text: '上浮下潜角度时间占比'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // Use axis to trigger tooltip
        type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
      }
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    legend: {},
    grid: {
      left: '3%',
      right: '10%',
      bottom: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: indexLine
    },
    series: [
      {
        name: 'up_down_angle_0_15',
        type: 'bar',
        stack: 'total',

        emphasis: {
          focus: 'series'
        },
        data: angle0_15
      },
      {
        name: 'up_down_angle_15_45',
        type: 'bar',
        stack: 'total',

        emphasis: {
          focus: 'series'
        },
        data: angle15_45
      },
      {
        name: 'up_down_angle_45_91',
        type: 'bar',
        stack: 'total',

        emphasis: {
          focus: 'series'
        },
        data: angle45_91
      },
      {
        name: 'other',
        type: 'bar',
        stack: 'total',

        emphasis: {
          focus: 'series'
        },
        data: other
      }
    ]
  };
  chart3.setOption(option)
}
</script>

<style scoped>

</style>