<template>
<Card :bordered="false" shadow>
    <p slot="title">添加问答</p>
    <Form :model="savedata" :label-width="80" ref="courseForm">
        <Row :gutter="18">
            <Col :sm="24" :md="12">
                <FormItem label="标题">
                    <Input v-model="savedata.qa_title" placeholder="请输入标题" size="large" type="text"></Input>
                </FormItem>
                <FormItem label="分类">
                    <Cascader :data="category_list" multiple v-model="selected_cids" trigger="hover" @on-change="category_change"></Cascader>
                    <Tag type="dot" closable color="green" v-for="(item,index) in selected_category" :key="index" @on-close="del_cagegory(item)">{{item.label}}</Tag>
                </FormItem>
                <FormItem label="内容">
                    <Input v-model="savedata.content" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
                </FormItem>
                <FormItem label="用户">
                    <Select
                        v-model="savedata.user_id"
                        filterable
                        remote
                        :remote-method="searchUser"
                        :loading="loading">
                        <Option v-for="(option, index) in options" :value="option.value" :key="index">{{option.label}}</Option>
                    </Select>
                </FormItem>
            </Col>
        </Row>
        <Row :gutter="18">
            <Col :sm="24" :md="24">
                <FormItem>
                    <Button type="primary" @click="save('courseForm')">保存</Button>
                    <Button type="ghost" style="margin-left: 8px" @click="$router.go(-1)">取消</Button>
                </FormItem>
            </Col>
        </Row>
        
        <!-- <FormItem label="Radio">
            <RadioGroup v-model="formItem.radio">
                <Radio label="male">Male</Radio>
                <Radio label="female">Female</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="Checkbox">
            <CheckboxGroup v-model="formItem.checkbox">
                <Checkbox label="Eat"></Checkbox>
                <Checkbox label="Sleep"></Checkbox>
                <Checkbox label="Run"></Checkbox>
                <Checkbox label="Movie"></Checkbox>
            </CheckboxGroup>
        </FormItem> -->
    </Form>
</Card>
</template>
<script>
import util from '@/libs/util.js';
export default {
    data(){
        return{
            api_url:util.ajax.api_url,
            java_api_url:util.ajax.java_api_url,
            course_info:{
            },
            childrens:[],
            category_list:[],
            selected_cids:[],
            selected_category:[],
            savedata:{
                qa_title:undefined,
                content:undefined,
                courses_id:undefined,
                user_id:undefined
            },
            loading:false,
            options:[]
        }
    },
    methods:{
        category_change(val){
            if(val.length>1){
                //有二级分类
                let it = this.childrens.find(item=>{
                    return item.value == val[1]
                })
                this.selected_category.push(it)
            }
        },
        del_cagegory(val){
            //从已选中移除
            this.selected_category.splice(this.selected_category.indexOf(val), 1);
        },
        searchUser(query){
            if (query !== '') {
                    this.loading = true;
                    util.ajax.get('/admin/users/query',{params:{key:query}}).then(response=>{
                        this.options = response.data.data
                        this.loading=false
                    })
                } else {
                    this.options = [];
                }
        },
        init(){
            util.ajax.get('/classify/all').then(response=>{
                var res = response.data
                if(res.dec.code=='000000'){
                    var clist = res.data
                    clist.forEach(element => {
                        var new_et = {
                            value:element.c_id,
                            label:element.c_name,
                            children:[]
                        }
                        util.ajax.get('/classify/secondary',{params:{c_id:new_et.value}}).then(result=>{
                            var r = result.data
                            if(r.dec.code == '000000'){
                                r.data.forEach(it => {
                                    var item = {
                                        value:it.forum_id,
                                        label:it.forum_name
                                    }
                                    this.childrens.push(item)
                                    new_et.children.push(item)
                                });
                                this.category_list.push(new_et)
                            }
                        })
                    });
                }else{
                    this.$Notice.error({
                        title: '提示信息',
                        desc: res.dec.msg
                    });
                }
            })
        },
        
        save(name){
            // this.$refs[name].validate((valid) => {
                // if (valid) {
                    var params = this.savedata
                    params.forum_ids = ''
                    this.selected_category.forEach(item=>{
                        params.forum_ids+=item.value+','
                    })
                    params.forum_ids = params.forum_ids.substr(0, params.forum_ids.length - 1)
                    // console.log(params);return;
                    //开始保存
                    util.ajax.post('/admin/answer/add',params).then(response=>{
                        var res = response.data
                        if(res.dec.code=='000000'){
                            this.$Message.success('保存成功');
                            setTimeout(() => {
                                this.$router.go(0)
                            }, 2000);
                        }else{
                            this.$Notice.error({
                                title: '提示信息',
                                desc: res.dec.msg
                            });
                        }
                    })
                // }else{
                    // return false;
                // }
            // });
        },
        reset(name){
            this.$refs[name].resetFields();
        }
    },
    mounted(){
        this.savedata.courses_id = this.$route.params.course_id;
        this.init()
    }
}
</script>
<style scoped>
/* .demo-upload-list{
    display: inline-block;
    max-width: 100%;
    height: 320px;
    text-align: center;
    line-height: 320px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
} 

.demo-upload-list img{
    width: 100%;
    height: 100%;
}
.demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
}
.demo-upload-list:hover .demo-upload-list-cover{
    display: block;
}
.demo-upload-list-cover i{
    color: #fff;
    font-size: 32px;
    cursor: pointer;
    margin: 0 10px;
}*/
.demo-upload-list{
        display: inline-block;
        text-align: center;
        height: 320px;
        line-height: 320px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>
