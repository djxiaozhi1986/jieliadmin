<template>
    <Card :bordered="false" shadow>
        <p slot="title">
            <Icon type="ios-analytics"></Icon>
            讲师列表
        </p>
        <a href="#" slot="extra" @click.prevent="add">
            <Icon type="plus-circled"></Icon>
            新增
        </a>
        <!-- <Row class="m-b-10">
             <Col span="12">
                <Input v-model="search_text" size="large" placeholder="筛选条件，请入课程名称或讲师">
                    <Button slot="append" icon="ios-search" @click="getData"></Button>
                </Input>
            </Col>
        </Row> -->
        <Table border :columns="columns" :data="data" class="m-b-10" ></Table>
        <Spin size="large" fix v-if="spinShow"></Spin>
        <Page :total="total" show-total show-sizer :current.sync="current" :page-size="pagesize" @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
    </Card>
</template>
<script>
import util from '@/libs/util.js';
export default {
    components: {
    },
    data () {
        return {
            spinShow:true,
            search_text:'',
            search_type:'0',
            total:0,
            current:1,
            pagesize:20,
            columns: [
                    {
                        title: '头像',
                        key: 'user_face',
                        render:(h,params)=>{
                            return h('div',[
                                h('Avatar',{
                                    props:{src:params.row.user_face}
                                })
                            ])
                        }
                    },
                    {
                        title: '讲师姓名',
                        key: 'real_name',
                        width: 150,
                    },
                    {
                        title: '昵称',
                        key: 'nick_name',
                        width: 150
                    },
                    {
                        title:'问答',
                        key:'answers'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        fixed: 'right',
                        width: 120,
                        render: (h, params) => {
                            return h('div', [
                                h('Poptip', {
                                    props: {
                                        confirm: true,
                                        title: '您确定要删除这条数据吗?',
                                        transfer: true
                                    },
                                    on: {
                                        'on-ok': () => {
                                            this.delete(params.row.course_id)
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
                data: []
        }
    },
    methods:{
        getData(){
            this.spinShow = true
            let params = {
                page_index:this.current,
                // page_number:this.pagesize,
                // keyword:this.search_text,
            }
            util.ajax.get('/admin/lecturer/list',{params:params}).then(response=>{
                var res = response.data
                if(res.dec.code=='000000'){
                    this.data = res.data
                    this.total = res.total
                }else{
                    this.$Notice.error({
                        title: '提示信息',
                        desc: res.dec.msg
                    });
                }
                this.spinShow = false
            })
        },
        pageChange(val){
            this.current = val
            this.getData()
        },
        pageSizeChange(val){
            this.current = 1
            this.pagesize = val
            this.getData()
        },
        add(){
            this.$router.push({
                name: 'lecturer_add'
            });
        },
        
    },
    mounted () {
        this.getData();
    }
}
</script>

