<template>
<Card :bordered="false" shadow>
    <p slot="title">编辑微课</p>
    <Form :model="course_info" :label-width="80" ref="courseForm" :rules="ruleValidate">
                <FormItem label="课程类型">
                    <i-switch v-model="course_info.type" size="large">
                        <span slot="open">线上</span>
                        <span slot="close">精品</span>
                    </i-switch>
                </FormItem>
        <Row :gutter="18">
            <Col :sm="24" :md="12">
                <FormItem label="课程封面">
                    <div class="demo-upload-list cover" v-for="(item,index) in uploadList" :key="index">
                        <template v-if="item.status === 'finished'">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                <Icon type="ios-trash-outline" @click.native="handleRemove(item.url)"></Icon>
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
                    <!-- {{course_info.lecturer_id}} -->
                </FormItem>
                <FormItem label="小封面">
                    <div class="demo-upload-list img_list" v-for="(item,index) in d_uploadList" :key="index">
                        <template v-if="item.status === 'finished'">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="d_handleView(item.url)"></Icon>
                                <Icon type="ios-trash-outline" @click.native="d_handleRemove(item.url)"></Icon>
                            </div>
                        </template>
                        <template v-else>
                            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                        </template>
                    </div>

                        <!-- multiple -->
                    <Upload
                        ref="d_upload"
                        multiple
                        :show-upload-list="false"
                        :default-file-list="d_defaultList"
                        :on-success="d_handleSuccess"
                        :format="['jpg','jpeg','png']"
                        :max-size="2048"
                        :on-format-error="d_handleFormatError"
                        :on-exceeded-size="d_handleMaxSize"
                        :before-upload="d_handleBeforeUpload"
                        type="drag"
                        :action="api_url+'/admin/upload/'"
                        style="display: inline-block;width:58px;">
                        <div style="width: 58px;height:58px;line-height: 58px;">
                            <Icon type="camera" size="20"></Icon>
                        </div>
                    </Upload>
                    <Modal title="View Image" v-model="d_imgview_visible">
                        <img :src="d_imgName" v-if="d_imgview_visible" style="width: 100%">
                    </Modal>
                </FormItem>
                <FormItem label="课程名称" prop="title">
                    <Input v-model="course_info.title" placeholder="请输入课程标题" size="large" type="text"></Input>
                </FormItem>
                <FormItem label="课程分类" prop="c_id">
                    <Cascader :data="category_list" v-model="course_info.c_ids" trigger="hover"></Cascader>
                </FormItem>
                <FormItem label="选择讲师" prop="lecturer_id">
                    <Select v-model="course_info.lecturer_id" size="large">
                        <Option :value="t.user_id+''" v-for="(t,index) in lecturers" :key="index" :label="(t.real_name==undefined || t.real_name=='')?t.nick_name:t.real_name">
                            <span>{{(t.real_name==undefined || t.real_name=='')?t.nick_name:t.real_name}}</span>
                            <span style="float:right;color:#ccc">{{t.user_title.length>20?t.user_title.substring(0,20)+'...':t.user_title}}</span>
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="开课时间" v-if="course_info.type">
                    <Row>
                        <Col span="11">
                            <FormItem  prop="opened_at_date">
                                <DatePicker type="date" placeholder="选择开课日期" format="yyyy/MM/dd" v-model="course_info.opened_at_date" size="large"></DatePicker>
                            </FormItem>
                        </Col>
                        <Col span="2" style="text-align: center">-</Col>
                        <Col span="11">
                            <FormItem  prop="opened_at_time">
                                <TimePicker type="time" placeholder="选择开课时间" format="HH:mm" v-model="course_info.opened_at_time" size="large"></TimePicker>
                            </FormItem>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label="结束时间" v-if="course_info.type">
                    <Row>
                        <Col span="11">
                            <FormItem  prop="closed_at_date">
                                <DatePicker type="date" placeholder="选择结束日期" format="yyyy/MM/dd" v-model="course_info.closed_at_date" size="large"></DatePicker>
                            </FormItem>
                        </Col>
                        <Col span="2" style="text-align: center">-</Col>
                        <Col span="11">
                            <FormItem  prop="closed_at_time">
                                <TimePicker type="time" placeholder="选择结束时间" format="HH:mm" v-model="course_info.closed_at_time" size="large"></TimePicker>
                            </FormItem>
                        </Col>
                    </Row>
                </FormItem>
                <Row>
                    <Col :sm="24" :md="6">
                        <FormItem label="试听">
                            <i-switch v-model="course_info.is_try" size="large" :true-value="1" :false-value="0">
                                <span slot="open">On</span>
                                <span slot="close">Off</span>
                            </i-switch>
                        </FormItem>
                    </Col>
                    <!-- <Col :sm="24" :md="6">
                        <FormItem label="精品">
                            <i-switch v-model="course_info.is_good" size="large">
                                <span slot="open">On</span>
                                <span slot="close">Off</span>
                            </i-switch>
                        </FormItem>
                    </Col> -->
                    <Col :sm="24" :md="6">
                        <FormItem label="推荐">
                            <i-switch v-model="course_info.is_home" size="large" :true-value="1" :false-value="0">
                                <span slot="open">On</span>
                                <span slot="close">Off</span>
                            </i-switch>
                        </FormItem>
                    </Col>
                    <Col :sm="24" :md="6">
                        <FormItem label="免费">
                            <i-switch v-model="course_info.is_oa" size="large" :true-value="1" :false-value="0">
                                <span slot="open">On</span>
                                <span slot="close">Off</span>
                            </i-switch>
                        </FormItem>
                    </Col>
                </Row>
                <!-- <FormItem label="视频地址">
                    <Input v-model="course_info.video_url" placeholder="请输入视频地址，若是直播课程，请输入直播地址"></Input>
                </FormItem> -->
                <Row>
                    <Col :sm="24" :md="6">
                        <FormItem label="原价">
                            <Input v-model="course_info.coin_price" 
                            placeholder="请输入原价" size="large" style="width: 80px" :number="true">
                                <span slot="prepend">¥</span>
                            </Input>
                        </FormItem>
                    </Col>
                    <Col :sm="24" :md="6">
                        <FormItem label="现价" prop="now_price">
                            <Input v-model="course_info.now_price" 
                            placeholder="请输入现价" size="large" style="width: 80px" :number="true">
                                <span slot="prepend">¥</span>
                            </Input>
                            <!-- <InputNumber
                                v-model="course_info.now_price"
                                :formatter="value => `¥ ${value}`.replace(/B(?=(d{3})+(?!d))/g, ',')"
                                :parser="value => value.replace(/$s?|(,*)/g, '')"></InputNumber> -->
                        </FormItem>
                    </Col>
                    <Col :sm="24" :md="12">
                        <FormItem label="等级">
                            <InputNumber size="large" :max="100" :min="0" v-model="course_info.view_level"></InputNumber>
                            "0":代表所有人都可以查看
                        </FormItem>
                    </Col>
                </Row>
            </Col>
        </Row>
        <Row :gutter="18">
            <Col :sm="24" :md="24">
                <FormItem label="课程描述">
                    <div id="editorElem" style="text-align:left"></div>
                    <!-- <Input v-model="course_info.description" size="large" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入课程描述"></Input> -->
                </FormItem>
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
import E from 'wangeditor'
export default {
    data(){
        // const validateNumber = (rule, value, callback) => {
        //     if (value !=0 && (value=='' || value==undefined)) {
        //         console.log(value)
        //         return callback(new Error('请填写微课现价'));
        //     }
        //     if(value<0){
        //         console.log('eee')
        //         return callback(new Error('微课现价不可 < 0'));
        //     }
        //     // 模拟异步验证效果
        //     // setTimeout(() => {
        //         if (!Number.isFinite(value)) {
        //             callback(new Error('请输入数字'));
        //         } else {
        //             callback();
        //         }
        //     // }, 500);
        // };
        return{
            course_id:undefined,
            api_url:util.ajax.api_url,
            title:'新增微课',
            course_info:{
                course_id:undefined,
                title:'',
                description:'',
                lecturer_id:'',
                lecturer_name:'',
                cover:undefined,
                img_list:undefined,
                coin_price:0,
                now_price:0,
                is_good:false,
                is_home:false,
                is_oa:false,
                is_try:false,
                view_level:0,
                opened_at:undefined,
                closed_at:undefined,
                c_ids:[],
                opened_at_date:new Date(),
                opened_at_time:new Date(),
                closed_at_date:new Date((new Date()/1000+86400)*1000),
                closed_at_time:new Date()
            },
            ruleValidate: {
                title: [
                    { required: true, message: '请填写微课标题', trigger: 'blur' }
                ],
                lecturer_id: [
                    { required: true, type: 'string',message: '请选择讲师', trigger: 'change' }
                ],
                // now_price:[
                //     { required: true,message: '请填写微课现价', trigger: 'blur' },
                // //    { validator: validateNumber, trigger: 'blur' }
                // ],
                description: [
                    { required: true, message: '请填写微课表述', trigger: 'blur' },
                    { type: 'string', min: 20, message: 'Introduce no less than 20 words', trigger: 'blur' }
                ]
            },
            imgview_visible:false,
            defaultList: [],
            uploadList:[],
            lecturers:[],
            category_list:[],
            d_imgview_visible:false,
            d_defaultList: [],
            d_uploadList:[],
            editor:undefined
        }
    },
    methods:{
        init(){
            this.editor = new E('#editorElem')
            this.editor.customConfig.uploadImgServer = 'http://jl.cn/upload_pic'
            this.editor.customConfig.debug = false;
            this.editor.customConfig.pasteFilterStyle = false;
            this.editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024;
            this.editor.customConfig.uploadImgMaxLength = 1;
            this.editor.customConfig.uploadFileName = 'pics';
            this.editor.customConfig.uploadImgParams = {
                save_path: 'editor'   // 属性值会自动进行 encode ，此处无需 encode
            }
            this.editor.customConfig.onchange = (html) => {
                this.course_info.description = html
            }
            this.editor.create()
            util.ajax.get('/admin/lecturer/list',{params:{page_index:1,page_number:10000}}).then(response=>{
                var res = response.data
                if(res.dec.code=='000000'){
                    this.lecturers = res.data
                    util.ajax.get('/admin/category/all').then(response=>{
                        var res = response.data
                        if(res.dec.code=='000000'){
                            this.category_list = res.data
                            this.getDetail()
                        }else{
                            this.$Notice.error({
                                title: '提示信息',
                                desc: res.dec.msg
                            });
                        }
                    })
                }else{
                    this.$Notice.error({
                        title: '提示信息',
                        desc: res.dec.msg
                    });
                }
            })
        },
        getDetail(){
            util.ajax.get('/admin/courses/detail',{params:{course_id:this.course_id}}).then(response=>{
                var res = response.data
                if(res.dec.code=='000000'){
                    this.course_info = res.data
                    if(this.course_info.is_live==1){
                        this.course_info.type=true
                    }else{
                        this.course_info.type=false
                    }
                    // this.uploadList.push(
                    //     {
                    //         status:'finished',
                    //         url:util.ajax.api_url+'/'+this.course_info.cover
                    //     })
                        var covers = this.course_info.cover.split(",")
                        covers.forEach(c => {
                            this.uploadList.push(
                            {
                                status:'finished',
                                url:util.ajax.api_url+'/'+c
                            })
                        });
                        console.log(this.uploadList)
                        var img_list = this.course_info.img_list.split(",")
                        img_list.forEach(img => {
                            this.d_uploadList.push(
                            {
                                status:'finished',
                                url:util.ajax.api_url+'/'+img
                            })
                        });

                        console.log(this.d_uploadList)
                    this.course_info.lecturer_id = ''+this.course_info.lecturer_id
                    this.course_info.opened_at_date = this.formatDate(this.course_info.opened_at_date*1000)
                    this.course_info.opened_at_time = this.formatDate(this.course_info.opened_at_time*1000)
                    this.course_info.closed_at_date = this.formatDate(this.course_info.closed_at_date*1000)
                    this.course_info.closed_at_time = this.formatDate(this.course_info.closed_at_time*1000)
                    this.editor.txt.html(this.course_info.description)
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
            const fileList = this.$refs.upload.fileList;
            let index = fileList.findIndex(element => {
                return element.url == file
            });
            this.$refs.upload.fileList.splice(index, 1);
            const uplist = this.uploadList;
            index = uplist.findIndex(element => {
                return element.url == file
            });
            this.uploadList.splice(index, 1)
            console.log(this.uploadList)
            // console.log(file)
            // util.ajax.delete('/admin/removefile',{params:{file_path:file}}).then(response=>{
            //     var res = response.data
            //     if(res.dec.code == '000000'){
                    
            //     }else{
            //         this.$Notice.error({
            //             title: '提示信息',
            //             desc: '服务器图片删除失败'
            //         });
            //     }
            // })
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
        d_handleView (name) {
            this.d_imgName = name;
            this.d_imgview_visible = true;
        },
        d_handleRemove (file) {
            const fileList = this.$refs.d_upload.fileList;
            var index = fileList.findIndex(element => {
                return element.url == file
            });
            this.$refs.d_upload.fileList.splice(index, 1);
            const duplist = this.d_uploadList;
            index = duplist.findIndex(element => {
                return element.url == file
            });
            this.d_uploadList.splice(index, 1);
            console.log(this.d_uploadList)
            // console.log(file)
            // util.ajax.delete('/admin/removefile',{params:{file_path:file}}).then(response=>{
            //     var res = response.data
            //     if(res.dec.code == '000000'){
                    
            //         // this.$refs.d_upload.fileList.splice(fileList.indexOf(file), 1);
            //     }else{
            //         this.$Notice.error({
            //             title: '提示信息',
            //             desc: '服务器图片删除失败'
            //         });
            //     }
            // })
        },
        d_handleSuccess (res, file) {
            if(res.dec.code=="000000"){
                file.url = util.ajax.api_url+'/'+res.data
                file.name = res.data
            }
            // file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
            // file.name = '7eb99afb9d5f317c912f08b5212fd69a';
        },
        d_handleFormatError (file) {
            this.$Notice.warning({
                title: '错误提示',
                desc: '文件' + file.name + ' 格式错误, 请上传 jpg 或 png 格式的图片文件'
            });
        },
        d_handleMaxSize (file) {
            this.$Notice.warning({
                title: '错误提示',
                desc: '文件  ' + file.name + ' 过大, 不可超过 2M.'
            });
        },
        d_handleBeforeUpload () {
            const check = this.d_uploadList.length < 5;
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
                            desc: '请上传微课封面'
                        });
                        return
                    }
                    this.uploadList.forEach(element => {
                        if(element!=undefined && element.name!=undefined){
                            this.course_info.cover = ''
                            this.course_info.cover +=element.name+','
                        }
                    });
                    this.course_info.cover = (this.course_info.cover.substring(this.course_info.cover.length-1)==',')?this.course_info.cover.substring(0,this.course_info.cover.length-1):this.course_info.cover;
                    if(this.course_info.cover!=undefined && this.course_info.cover!=''){
                        this.course_info.cover = this.course_info.cover.replace('undefined','');
                    }
                    this.d_uploadList.forEach(element => {
                        if(element!=undefined && element.name!=undefined){
                            this.course_info.img_list = ''
                            this.course_info.img_list +=element.name+','
                        }
                    });
                    this.course_info.img_list = (this.course_info.img_list.substring(this.course_info.img_list.length-1)==',')?this.course_info.img_list.substring(0,this.course_info.img_list.length-1):this.course_info.img_list;
                    if(this.course_info.img_list!=undefined && this.course_info.img_list!=''){
                        this.course_info.img_list = this.course_info.img_list.replace('undefined','');
                    }
                    //2、组合时间
                    var start_str = this.formatDate(this.course_info.opened_at_date)+' '+this.course_info.opened_at_time;
                    this.course_info.opened_at = this.getTimestamp(start_str)/1000;
                    var end_str = this.formatDate(this.course_info.closed_at_date)+' '+this.course_info.closed_at_time;
                    this.course_info.closed_at = this.getTimestamp(end_str)/1000;
                    if(this.course_info.closed_at<=this.course_info.opened_at){
                        this.$Notice.error({
                            title: '错误提示',
                            desc: '结束时间必须大于开课时间'
                        });
                        return false;
                    }else{
                        if(this.course_info.closed_at-this.course_info.opened_at<600){
                            this.$Notice.error({
                                title: '错误提示',
                                desc: '微课时间至少需要10分钟'
                            });
                            return false;
                        }
                    }
                    //处理课程类型
                    if(this.course_info.type){
                        this.course_info.is_live = 1
                        this.course_info.is_good = 0
                    }else{
                        this.course_info.is_live = 0
                        this.course_info.is_good = 1
                    }
                    //处理讲师
                    this.lecturers.forEach(element => {
                        if(element.user_id==this.course_info.lecturer_id){
                            this.course_info.lecturer_name = (element.real_name==undefined || element.real_name=='')?element.nick_name:element.real_name
                        }
                    },this);
                    if(this.course_info.c_ids.length==0){
                        this.$Notice.error({
                            title: '错误提示',
                            desc: '请选择课程分类'
                        });
                        return;
                    }
                    this.course_info.c_id = this.course_info.c_ids[this.course_info.c_ids.length-1]
                    let params = this.course_info
                    // console.log(params);return;
                    //开始保存
                    util.ajax.post('/admin/courses/save',params).then(response=>{
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
        this.course_id = this.$route.params.course_id;
        this.init()
        this.uploadList = this.$refs.upload.fileList;
        this.d_uploadList = this.$refs.d_upload.fileList;
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
        width:128px;
        height: 128px!important;
        line-height: 128px!important;
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
    .cover{
        width: 355px!important;
        height: 137px!important;
        line-height: 137px!important;
    }
    .img_list{
        width: 259px!important;
        height: 255px!important;
        line-height: 255px!important;
    }
</style>
