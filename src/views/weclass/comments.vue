<template>
    <!-- <Card :bordered="false" shadow> -->
        <Row>
            <Col span="8" style="padding:10px;">
                <Card :bordered="true" shadow>
                    <p slot="title">
                        待审评论
                    </p>
                    <Alert type="warning" v-for="(item,key) in stayData" :key="key">
                        {{item.from_user_name==undefined?"匿名":item.from_user_name}}
                        <template slot="desc">
                             <Tag checkable color="blue" v-if="item.to_user!=undefined">@{{item.to_user_name}}</Tag>
                            {{item.content}}
                            <br/>
                            <div style="text-align:right">
                                <Button type="success" shape="circle" icon="checkmark-round" @click="pass(item.comment_id)"></Button>
                                <Button type="error" shape="circle" icon="close-round" @click="reject(item.comment_id)"></Button>
                            </div>
                        </template>
                    </Alert>
                    <!--分页-->
                    <Page :total="none_pager.total" showTotal :current.sync="none_pager.current" :page-size="none_pager.pagesize" @on-change="none_pageChange"></Page>
                </Card>
            </Col>
            <Col span="8" style="padding:10px;">
                <Card :bordered="true" shadow>
                    <p slot="title">
                        通过
                    </p>
                    <Alert type="success" show-icon  v-for="(item,key) in passData" :key="key">
                        <Tag checkable color="blue" v-if="item.to_user!=undefined">@{{item.to_user_name}}</Tag>
                        {{item.from_user_name==undefined?"匿名":item.from_user_name}}
                        <span slot="desc">{{item.content}}</span>
                    </Alert>
                    <!--分页-->
                    <Page :total="pass_pager.total" showTotal :current.sync="pass_pager.current" :page-size="pass_pager.pagesize" @on-change="pass_pageChange"></Page>
                </Card>
            </Col>
            <Col span="8" style="padding:10px;">
                <Card :bordered="true" shadow>
                    <p slot="title">
                        拒绝
                    </p>
                    <Alert type="error" show-icon  v-for="(item,key) in refuseData" :key="key">
                        <Tag checkable color="blue" v-if="item.to_user!=undefined">@{{item.to_user_name}}</Tag>
                        {{item.from_user_name==undefined?"匿名":item.from_user_name}}
                        <span slot="desc">{{item.content}}</span>
                    </Alert>
                    <!--分页-->
                    <Page :total="refuse_pager.total" showTotal :current.sync="refuse_pager.current" :page-size="refuse_pager.pagesize" @on-change="refuse_pageChange"></Page>
                </Card>
            </Col>
        </Row>
        <!-- <Table border :columns="columns" :data="data" class="m-b-10" ></Table>
        <Spin size="large" fix v-if="spinShow"></Spin>
        <Page :total="total" show-total show-sizer :current.sync="current" :page-size="pagesize" @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page> -->
    <!-- </Card> -->
</template>
<script>
import util from '@/libs/util.js';
export default {
    components: {
    },
    data () {
        return {
            course_id:undefined,
            api_url:util.ajax.api_url,
            none_pager:{
                total:0,
                current:1,
                pagesize:10,
            },
            pass_pager:{
                total:0,
                current:1,
                pagesize:10,
            },
            refuse_pager:{
                total:0,
                current:1,
                pagesize:10,
            },
            stayData:[],
            refuseData:[],
            passData:[]
        }
    },
    methods:{
        getStayData(){
            let params = {
                course_id:this.course_id,
                page_index:this.none_pager.current,
                page_number:this.none_pager.pagesize
            }
            util.ajax.get('/admin/comment/stay',{params:params}).then(response=>{
                var res = response.data
                if(res.dec.code=='000000'){
                    this.stayData = res.data
                    this.none_pager.total = res.total
                }else{
                    this.$Notice.error({
                        title: '提示信息',
                        desc: res.dec.msg
                    });
                }
            })
        },
        getPassData(){
            let params = {
                course_id:this.course_id,
                page_index:this.pass_pager.current,
                page_number:this.pass_pager.pagesize
            }
            util.ajax.get('/admin/comment/pass',{params:params}).then(response=>{
                var res = response.data
                if(res.dec.code=='000000'){
                    this.passData = res.data
                    this.pass_pager.total = res.total
                }else{
                    this.$Notice.error({
                        title: '提示信息',
                        desc: res.dec.msg
                    });
                }
            })
        },
        getRefuseData(){
            let params = {
                course_id:this.course_id,
                page_index:this.refuse_pager.current,
                page_number:this.refuse_pager.pagesize
            }
            util.ajax.get('/admin/comment/refuse',{params:params}).then(response=>{
                var res = response.data
                if(res.dec.code=='000000'){
                    this.refuseData = res.data
                    this.refuse_pager.total = res.total
                }else{
                    this.$Notice.error({
                        title: '提示信息',
                        desc: res.dec.msg
                    });
                }
            })
        },
        none_pageChange(val){
            this.current = val
            this.getStayData()
        },
        pass_pageChange(val){
            this.current = val
            this.getPassData()
        },
        refuse_pageChange(val){
            this.current = val
            this.getRefuseData()
        },
        pass(val){
            let params = {
                comment_id:val,
                verify:1
            }
            util.ajax.post('/admin/comment/verify',params).then(response=>{
                var res = response.data
                if(res.dec.code=='000000'){
                    this.$Notice.success({
                        title: '提示信息',
                        desc: "审批通过"
                    });
                    setTimeout(() => {
                        this.$router.go(0)
                    }, 1000);
                }else{
                    this.$Notice.error({
                        title: '提示信息',
                        desc: res.dec.msg
                    });
                }
            })
        },
        reject(val){
            let params = {
                comment_id:val,
                verify:-1
            }
            util.ajax.post('/admin/comment/verify',params).then(response=>{
                var res = response.data
                if(res.dec.code=='000000'){
                    this.$Notice.success({
                        title: '提示信息',
                        desc: "拒绝审批"
                    });
                    setTimeout(() => {
                        this.$router.go(0)
                    }, 1000);
                }else{
                    this.$Notice.error({
                        title: '提示信息',
                        desc: res.dec.msg
                    });
                }
            })
        }
    },
    mounted () {
        this.course_id = this.$route.params.course_id;
        this.getStayData();
        this.getPassData();
        this.getRefuseData();
    }
}
</script>

