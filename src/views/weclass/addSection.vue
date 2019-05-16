<template>
<Card :bordered="false" shadow>
    <p slot="title">章节列表</p>

    <Table border :columns="columns" :data="sctions" class="m-b-10" ></Table>
    <Spin size="large" fix v-if="spinShow"></Spin>
    <Page :total="total" show-total show-sizer :current.sync="current" :page-size="pagesize" @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>

<Card :bordered="true" style="margin-top:20px"><p slot="title">新增章节</p>
    <Form :model="info" :label-width="80" ref="sectionForm" :rules="ruleValidate">
        <Row :gutter="18">
            <Col :sm="24" :md="12">
                <FormItem label="音频文件">
                    <span v-if="info.audio_url!='' && info.audio_url!=null">{{info.audio_url}}</span>
                    <Upload :action="api_url+'admin/upload/audio'" :on-success="handleSuccess">
                        <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
                    </Upload>
                    <!-- {{info.lecturer_id}} -->
                </FormItem>
                <FormItem label="章节标题" prop="title">
                    <Input v-model="info.title" placeholder="请输入章节标题" size="large" type="text"></Input>
                </FormItem>
                <FormItem label="价格" prop="price">
                    <InputNumber :min="0" v-model="info.price"></InputNumber>
                </FormItem>
                <FormItem label="天鹅币" prop="cion">
                    <InputNumber :min="0" v-model="info.cion"></InputNumber>
                </FormItem>
                <FormItem label="是否免费" prop="is_free">
                    <Checkbox v-model="info.is_free"></Checkbox>
                </FormItem>
                <FormItem label="是否试听" prop="is_try">
                    <Checkbox v-model="info.is_try"></Checkbox>
                </FormItem>
                <FormItem label="顺序">
                    <InputNumber :min="0" v-model="info.order_index"></InputNumber>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="save('sectionForm')">保存</Button>
                </FormItem>
            </Col>
        </Row>
    </Form>
    </Card>
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
            course_id:undefined,
            api_url:util.ajax.api_url,
            title:'新增讲师',
            info:{
                course_id:undefined,
                audio_url:'',
                title:0,
                price:0,
                cion:0,
                is_free:false,
                is_try:false,
                order_index:0
            },
            ruleValidate: {
                title: [
                    { required: true, message: '请输入章节标题', trigger: 'blur' }
                ]
            },
            imgview_visible:false,
            defaultList: [],
            uploadList:[],
            sctions:[],
            total:0,
            current:1,
            pagesize:20,
            spinShow:true,
            columns: [
                    {
                        title: '序号',
                        key: 'order_index',
                        align:'center',
                        width: 80
                    },
                    {
                        title: '章节名称',
                        key: 'title',
                        width: 350
                    },
                    {
                        title: '文件地址',
                        key: 'audio_url',
                        width:500
                    },
                    {
                        title: '是否免费',
                        key: 'is_free',
                        align:'center',
                        width: 150,
                        render:(h,params)=>{
                            return h('tag',{},params.row.is_free==1?'是':'否')
                        }
                    },
                    {
                        title: '试听',
                        key: 'is_try',
                        align:'center',
                        width: 150,
                        render:(h,params)=>{
                            return h('tag',{},params.row.is_try?'是':'否')
                        }
                    },
                    {
                        title: '价格',
                        key: 'price',
                        align:'center',
                        width: 100
                    },
                    {
                        title: '天鹅币',
                        key: 'cion',
                        align:'center',
                        width: 100
                    },
                    {
                        title: '创建时间',
                        key: 'created_at',
                        align:'center',
                        width: 180,
                        render:(h,params)=>{
                            return h('tag',{},this.formatFullTime(params.row.created_at*1000))
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        fixed: 'right',
                        align:"center",
                        width: 200,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'success',
                                    },
                                    style: {
                                        margin: '0 5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.edit(params.row)
                                        }
                                    }
                                },'编辑'),//编辑
                                h('Poptip', {
                                    props: {
                                        confirm: true,
                                        title: '您确定要删除这条数据吗?',
                                        transfer: true
                                    },
                                    on: {
                                        'on-ok': () => {
                                            this.delete(params.row.section_id)
                                        }
                                    }
                                }, [
                                    h('Button', {
                                        style: {
                                            margin: '0 5px'
                                        },
                                        props: {
                                            type: 'error',
                                            placement: 'top'
                                        }
                                    }, '删除')
                                ])
                            ]);
                        }
                    }
                ],
        }
    },
    methods:{
        init(){
            this.spinShow = true
            let params = {
                page_index:this.current,
                page_number:this.pagesize,
                course_id:this.course_id
            }
            util.ajax.get('/admin/courses/sections',{params:params}).then(response=>{
                var res = response.data
                if(res.dec.code=='000000'){
                    this.sctions = res.data
                    this.total = res.total
                }else{
                    this.$Notice.error({
                        title: '提示信息',
                        desc: res.dec.msg+'111'
                    });
                }
                this.spinShow = false
            })
        },
        pageChange(val){
            this.current = val
            this.init()
        },
        pageSizeChange(val){
            this.current = 1
            this.pagesize = val
            this.init()
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
                this.info.audio_url = util.ajax.api_url+'/'+res.data
                // file.name = res.data
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
        edit(info){
            info.is_try = info.is_try==1?true:false
            info.is_free = info.is_free==1?true:false
            this.info = info
        },
        save(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    //组合参数
                    //1、调整图片地址
                    if(this.info.audio_url!=undefined && this.info.audio_url!=''){
                        this.info.audio_url = this.info.audio_url.replace('undefined','');
                    }else{
                        this.$Notice.error({
                            title: '错误提示',
                            desc: '请上传章节音频文件'
                        });
                        return
                    }
                    let params = this.info
                    params.course_id = Number(this.course_id)
                    if(params.section_id==undefined){
                        //开始保存
                        util.ajax.post('/admin/courses/sections/add',params).then(response=>{
                            var res = response.data
                            if(res.dec.code=='000000'){
                                this.$Message.success('保存成功');
                                this.$router.go(0)
                            }else{
                                this.$Notice.error({
                                    title: '提示信息',
                                    desc: res.dec.msg
                                });
                            }
                        })
                    }else{
                        //开始保存
                        util.ajax.post('/admin/courses/sections/edit',params).then(response=>{
                            var res = response.data
                            if(res.dec.code=='000000'){
                                this.$Message.success('保存成功');
                                this.$router.go(0)
                            }else{
                                this.$Notice.error({
                                    title: '提示信息',
                                    desc: res.dec.msg
                                });
                            }
                        })
                    }
                }else{
                    return false;
                }
            });
        },
        reset(name){
            this.$refs[name].resetFields();
        },
        delete(id){
            util.ajax.delete('/admin/courses/sections/del',{params:{id:id}}).then(response=>{
                var res = response.data
                if(res.dec.code=='000000'){
                    this.$Message.success('保存成功');
                    this.$router.go(0)
                }else{
                    this.$Notice.error({
                        title: '提示信息',
                        desc: res.dec.msg
                    });
                }
            })
        }
    },
    mounted(){
        this.course_id = this.$route.params.course_id;
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
