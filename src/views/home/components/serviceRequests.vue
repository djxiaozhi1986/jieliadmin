<template>
    <div style="height:400px">
        <time-select :bindModal="timeSelected" v-model="timeSelected" @change="dateChange"></time-select>
        <div style="width:100%;height:100%;" id="service_request_con"></div>
    </div>
</template>

<script>
var xData = function() {
    var data = [];
    for (var i =1; i < 15; i++) {
        data.push(i + "");
    }
    return data;
}();
import timeSelect from './timeSelect'
import echarts from 'echarts';
import util from "@/libs/util.js";
export default {
    components:{
        timeSelect
    },
    data(){
        return {
            timeSelected:'本周'
        }
    },
    name: 'serviceRequests',
    mounted () {
    },
    methods:{
        init(params){
            util.ajax
                .get("/admin/ds/order",{params:params})
                .then(response => {
                var res = response.data;
                if (res.dec.code == "000000") {
                    var op = res.data;

                    const option = {
                        "tooltip": {
                            "trigger": "axis",
                            "axisPointer": {
                                "type": "shadow",
                                textStyle: {
                                    color: "#fff"
                                }

                            },
                        },
                        "grid": {
                            "borderWidth": 0,
                            "top": 110,
                            "bottom": 95,
                            textStyle: {
                                color: "#fff"
                            }
                        },
                        "xAxis": [{
                            "type": "category",
                            "axisLine": {
                                lineStyle: {
                                    color: '#90979c'
                                }
                            },
                            "splitLine": {
                                "show": false
                            },
                            "axisTick": {
                                "show": false
                            },
                            "splitArea": {
                                "show": false
                            },
                            "axisLabel": {
                                "interval": 0,

                            },
                            "data": op.timearr,
                        }],
                        "yAxis": [{
                            "type": "value",
                            "splitLine": {
                                "show": false
                            },
                            "axisLine": {
                                lineStyle: {
                                    color: '#90979c'
                                }
                            },
                            "axisTick": {
                                "show": false
                            },
                            "axisLabel": {
                                "interval": 0,

                            },
                            "splitArea": {
                                "show": false
                            },

                        }],
                        "dataZoom": [{
                            "show": true,
                            "height": 30,
                            "xAxisIndex": [
                                0
                            ],
                            bottom: 30,
                            "start": 30,
                            "end": 60,
                            handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
                            handleSize: '110%',
                            handleStyle:{
                                color:"#d3dee5",
                                
                            },
                            textStyle:{
                                color:"#fff"},
                            borderColor:"#90979c"
                            
                            
                        }, {
                            "type": "inside",
                            "show": true,
                            "height": 15,
                            "start": 1,
                            "end": 10
                        }],
                        "series": [
                            {
                                "name": "订单量",
                                "type": "line",
                                "stack": "总量",
                                symbolSize:20,
                                symbol:'circle',
                                "itemStyle": {
                                    "normal": {
                                        "color": "#0077ff",
                                        "barBorderRadius": 0,
                                        "label": {
                                            "show": true,
                                            "position": "top",
                                            formatter: function(p) {
                                                return p.value > 0 ? (p.value) : '';
                                            }
                                        }
                                    }
                                },
                                "data": op.ydata
                            },
                        ]
                    };
                    const serviceRequestCharts = echarts.init(document.getElementById('service_request_con'));
                    serviceRequestCharts.setOption(option);

                    window.addEventListener('resize', function () {
                        serviceRequestCharts.resize();
                    });
                } else {
                    this.$Notice.error({
                    title: "提示信息",
                    desc: res.dec.msg
                    });
                }
                this.spinShow = false;
            });
        },
        dateChange(val){
            var params = {
                start:new Date(val.range.start).getTime()/1000,
                end:new Date(val.range.end).getTime()/1000,
                flag:val.flag
            }
            console.log(params)
            this.init(params)
        }
    }
};
</script>