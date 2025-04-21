<template>
    <div>
      <div class="chart-container">
        <canvas ref="chart"></canvas>
      </div>
    </div>
  </template>
  
  <script>
  import { Chart, registerables } from 'chart.js'
  import { ref, onMounted, onBeforeUnmount } from 'vue'

  export default {
    name: 'PieChart',
    props: {
      chartData: {
        type: Object,
        required: true
      },
      chartOptions: {
        type: Object,
        default: () => ({})
      }
    },
    setup(props) {
      const chart = ref(null)
      let chartInstance = null
  
      onMounted(() => {
        Chart.register(...registerables)
        
        if (chart.value) {
          chartInstance = new Chart(chart.value, {
            type: 'pie',
            data: props.chartData,
            options: {
              responsive: true,
              maintainAspectRatio: false,
              ...props.chartOptions
            }
          })
        }
      })
  
      onBeforeUnmount(() => {
        if (chartInstance) {
          chartInstance.destroy()
        }
      })
  
      return { chart }
    }
  }
  </script>
  
  <style scoped>
  .chart-container {
    position: relative;
    height: 400px;
    width: 100%;
  }
  </style>