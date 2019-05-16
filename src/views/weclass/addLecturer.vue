<template>
<Card :bordered="false" shadow>
    <p slot="title">添加讲师</p>
    <Form :model="lecturer_info" :label-width="80" ref="lecturerForm" :rules="ruleValidate">
        <Row :gutter="18">
            <Col :sm="24" :md="12">
                <FormItem label="头像">
                    <div class="demo-upload-list" v-for="(item,index) in uploadList" :key="index">
                        <template v-if="item.status === 'finished'">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                            </div>
                        </template>
                        <template v-else>
                            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                        </template>
                    </div>

                        <!-- multiple -->
                    <Upload
                        ref="upload"
                        multiple
                        :show-upload-list="false"
                        :default-file-list="defaultList"
                        :on-success="handleSuccess"
                        :format="['jpg','jpeg','png']"
                        :max-size="2048"
                        :on-format-error="handleFormatError"
                        :on-exceeded-size="handleMaxSize"
                        :before-upload="handleBeforeUpload"
                        type="drag"
                        :action="api_url+'/admin/upload/'"
                        style="display: inline-block;width:58px;">
                        <div style="width: 58px;height:58px;line-height: 58px;">
                            <Icon type="camera" size="20"></Icon>
                        </div>
                    </Upload>
                    <Modal title="View Image" v-model="imgview_visible">
                        <img :src="imgName" v-if="imgview_visible" style="width: 100%">
                    </Modal>
                    <!-- {{lecturer_info.lecturer_id}} -->
                </FormItem>
                <FormItem label="讲师姓名" prop="title">
                    <Input v-model="lecturer_info.lecturer_name" placeholder="请输入讲师姓名" size="large" type="text"></Input>
                </FormItem>
                <FormItem label="讲师职称" prop="title">
                    <Input v-model="lecturer_info.lecturer_title" placeholder="请输入题讲师职称" size="large" type="text"></Input>
                </FormItem>
                <FormItem label="讲师简介">
                    <Input v-model="lecturer_info.description" size="large" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入讲师简介"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="save('lecturerForm')">保存</Button>
                    <Button type="ghost" style="margin-left: 8px" @click="$router.go(-1)">取消</Button>
                </FormItem>
            </Col>
        </Row>
    </Form>
</Card>
</template>
<script>
import util from '@/libs/util.js';
export default {
    data(){
        const validateNumber = (rule, value, callback) => {
            if (value !=0 && (value=='' || value==undefined)) {
                console.log(value)
                return callback(new Error('请填写微课现价'));
            }
            if(value<0){
                console.log('eee')
                return callback(new Error('微课现价不可 < 0'));
            }
            // 模拟异步验证效果
            // setTimeout(() => {
                if (!Number.isFinite(value)) {
                    callback(new Error('请输入数字'));
                } else {
                    callback();
                }
            // }, 500);
        };
        return{
            api_url:util.ajax.api_url,
            title:'新增讲师',
            lecturer_info:{
                lecturer_id:undefined,
                lecturer_name:'',
                lecturer_title:'',
                lecturer_avator:undefined,
                description:undefined
            },
            ruleValidate: {
                lecturer_name: [
                    { required: true, message: '请填写讲师姓名', trigger: 'blur' }
                ],
                lecturer_title: [
                    { required: true, message: '请填写讲师职称', trigger: 'change' }
                ],
                description: [
                    { required: true, message: '请填写讲师简介', trigger: 'blur' },
                    { type: 'string', min: 20, message: '最少输入20个字符', trigger: 'blur' }
                ]
            },
            imgview_visible:false,
            defaultList: [],
            uploadList:[],
            lecturers:[]
        }
    },
    methods:{
        init(){
            util.ajax.get('/admin/lecturer/list',{params:{page_index:1,page_number:10000}}).then(response=>{
                var res = response.data
                if(res.dec.code=='000000'){
                    this.lecturers = res.data
                }else{
                    this.$Notice.error({
                        title: '提示信息',
                        desc: res.dec.msg
                    });
                }
            })
        },
        handleView (name) {
            this.imgName = name;
            this.imgview_visible = true;
        },
        handleRemove (file) {
            util.ajax.delete('/admin/removefile',{params:{file_path:file.name}}).then(response=>{
                var res = response.data
                if(res.dec.code == '000000'){
                    const fileList = this.$refs.upload.fileList;
                    this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
                }else{
                    this.$Notice.error({
                        title: '提示信息',
                        desc: '服务器图片删除失败'
                    });
                }
            })
        },
        handleSuccess (res, file) {
            if(res.dec.code=="000000"){
                file.url = util.ajax.api_url+'/'+res.data
                file.name = res.data
            }
            // file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
            // file.name = '7eb99afb9d5f317c912f08b5212fd69a';
        },
        handleFormatError (file) {
            this.$Notice.warning({
                title: '错误提示',
                desc: '文件' + file.name + ' 格式错误, 请上传 jpg 或 png 格式的图片文件'
            });
        },
        handleMaxSize (file) {
            this.$Notice.warning({
                title: '错误提示',
                desc: '文件  ' + file.name + ' 过大, 不可超过 2M.'
            });
        },
        handleBeforeUpload () {
            const check = this.uploadList.length < 5;
            if (!check) {
                this.$Notice.warning({
                    title: 'Up to five pictures can be uploaded.'
                });
            }
            return check;
        },
        save(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    //组合参数
                    //1、调整图片地址
                    if(this.uploadList.length==0){
                        this.$Notice.error({
                            title: '错误提示',
                            desc: '请上传讲师头像'
                        });
                        return
                    }
                    this.uploadList.forEach(element => {
                        if(element!=undefined && element.name!=undefined){
                        this.lecturer_info.lecturer_avator =element.name
                        }
                    });

                    let params = this.lecturer_info
                    //开始保存
                    util.ajax.post('/admin/lecturer/save',params).then(response=>{
                        var res = response.data
                        if(res.dec.code=='000000'){
                            this.$Message.success('保存成功');
                            this.reset(name)
                        }else{
                            this.$Notice.error({
                                title: '提示信息',
                                desc: res.dec.msg
                            });
                        }
                    })
                }else{
                    return false;
                }
            });
        },
        reset(name){
            this.$refs[name].resetFields();
        }
    },
    mounted(){
        this.init()
        this.uploadList = this.$refs.upload.fileList;
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
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
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
