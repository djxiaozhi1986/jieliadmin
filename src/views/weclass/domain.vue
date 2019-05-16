<template>
    <Card :bordered="false" shadow>
        <p slot="title">
            <Icon type="ios-analytics"></Icon>
            域名检查
        </p>
        <Form :model="filter" inline>
            <FormItem><span>域名长度</span></FormItem>
            <FormItem>
                <InputNumber :max="10" :min="2" :step="1" v-model="filter.length"></InputNumber>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="startCheckDomain" v-if="interval==undefined">开始检查</Button>
                <Button type="error" @click="stopCheckDomain" v-else>停止检查</Button>
            </FormItem>
        </Form>
        <Row :gutter="20">
            <Col span="12">
                <div class="result">
                    <Alert v-if="index==0" :type="item.premium==true?'success':'error'" show-icon v-for="(item,index) in results" :key="index">
                        {{item.domain}}
                        <span slot="desc">{{item.premium==true?'域名可以注册':'域名已经被注册'}}</span>
                    </Alert>
                    <Alert v-if="index!=0" :type="item.premium==true?'success':'error'" show-icon v-for="(item,index) in results" :key="index">
                        域名《{{item.domain}}》{{item.premium==true?'可以注册':'已经被注册'}}
                    </Alert>
                </div>
            </Col>
            <Col span="12">
            <div style="padding:20px">
                <Alert type="success" show-icon v-for="(item,index) in succes_list" :key="index">
                    域名《{{item.domain}}》
                </Alert></div>
            </Col>
        </Row>
        
    </Card>
</template>
<script>
import util from '@/libs/util.js';
export default {
    data () {
        return {
            filter: {
                length: 2,
            },
            results:[],
            interval:undefined,
            succes_list:[]
        }
    },
    methods:{
        apiRequest(){
            let params = {
                length:this.filter.length
            }
            util.ajax.get('domain/check',{params:params}).then(response=>{
                var res = response.data
                if(res.dec.code=='000000'){
                    if(this.results.length>=10){
                        this.results=[]
                    }
                    if(res.data.premium){
                        this.succes_list.push(res.data)
                    }
                    this.results.unshift(res.data)
                }else{
                    this.$Notice.error({
                        title: '提示信息',
                        desc: res.dec.msg
                    });
                }
                this.spinShow = false
            })
        },
        startCheckDomain(){
            // while(true){
                this.interval = setInterval(() => {
                    this.apiRequest()
                },2000)
            // }
        },
        stopCheckDomain(){
            clearInterval(this.interval)
            this.interval = undefined
        }
    }
}
</script>
<style scoped>
.result{
    width: 100%;
    min-height: 100px;
    background: #1f1f1f;
    font-size: 16px;
    line-height: 45px;
    max-height: 800px;
    overflow-y: scroll;
    padding: 20px;
}
.success{
    color:green;
}
.error{
    color:red;
}
</style>
