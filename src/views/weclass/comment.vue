<template>
    <Card :bordered="false" shadow>
        <p slot="title">
            <Icon type="ios-analytics"></Icon>
            评论列表
        </p>
        <Form ref="formInline" :model="filter" inline>
            <FormItem prop="type" label="类型">
                <Select v-model="filter.type" style="width:150px" @on-change="getData">
                    <Option value="0" >待审</Option>
                    <Option value="1" >已通过</Option>
                    <Option value="-1" >未通过</Option>
                </Select>
            </FormItem>
            <!-- <FormItem label="搜索">
                <Button type="primary" @click="getData">搜索</Button>
            </FormItem> -->
        </Form>
        <Table border :columns="columns" :data="data" class="m-b-10" :row-class-name="rowClassName" v-if="filter.type==0"></Table>
        <Table border :columns="columns1" :data="data1" class="m-b-10" :row-class-name="rowClassName" v-else></Table>
        <Spin size="large" fix v-if="spinShow"></Spin>
        <Page :total="total" show-total show-sizer :current.sync="current" :page-size="pagesize" @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
    </Card>
</template>
<script>
import util from "@/libs/util.js";
export default {
  components: {},
  data() {
    return {
      course_id:undefined,
      filter: {
        type: "0",
        prev_type:"0"
      },
      showTip:false,
      tipMsg:'',
      spinShow: true,
      search_text: "",
      search_type: "0",
      total: 0,
      current: 1,
      pagesize: 20,
      current_course_id:undefined,
      columns1:[
        {
          title: "用户",
          width: 150,
          render: (h, params) => {
              return h('div',[
                h("span",params.row.from_user_name==undefined?"匿名":params.row.from_user_name),
                h("tag",{
                    props:{
                        checkable:false,
                        color:"blue"
                    },
                    style:{
                        display:params.row.to_user==undefined?"none":"",
                        marginLeft:'10px'
                    }
                },'@'+params.row.to_user_name)
              ])
          }
        },
        {
          title: "内容",
          key: "content"
        },
        {
          title: "评论时间",
          key: "created_at",
          align: 'center',
          width: 160,
          render: (h, params) => {
            return h(
              "tag",
              {},
              this.formatFullTime(params.row.created_at * 1000)
            );
          }
        }
      ],
      columns: [
        {
          title: "用户",
          width: 150,
          render: (h, params) => {
              return h('div',[
                h("span",params.row.from_user_name==undefined?"匿名":params.row.from_user_name),
                h("tag",{
                    props:{
                        checkable:false,
                        color:"blue"
                    },
                    style:{
                        display:params.row.to_user==undefined?"none":"",
                        marginLeft:'10px'
                    }
                },'@'+params.row.to_user_name)
              ])
          }
        },
        {
          title: "内容",
          key: "content"
        },
        {
          title: "评论时间",
          key: "created_at",
          align: 'center',
          width: 160,
          render: (h, params) => {
            return h(
              "tag",
              {},
              this.formatFullTime(params.row.created_at * 1000)
            );
          }
        },
        {
          title: "审核",
          key: "action",
          align: 'center',
          width: 180,
          render: (h, params) => {
              return h('div', [
                  h('Button', {
                      props: {
                          type: 'success',
                      },
                      on: {
                          click: () => {
                              this.pass(params.row.comment_id)
                          }
                      }
                  },'同意'),
                  h('Button', {
                      props: {
                          type: 'error',
                      },
                      style: {
                          margin: '0 5px'
                      },
                      on: {
                          click: () => {
                              this.reject(params.row.comment_id)
                          }
                      }
                  },'拒绝')
              ])
            }
        }

      ],
      data: [],
      data1: []
    };
  },
  methods: {
    getData() {
      this.spinShow = true;
      if(this.filter.type!=this.filter.prev_type){
          this.current = 1;
      }

      switch(this.filter.type){
          case "0":
            this.getStayData()
            break;
          case "1":
            this.getPassData()
            break;
          case "-1":
            this.getRefuseData()
            break;
      }
      this.filter.prev_type = this.filter.type
    },

    getStayData(){
            let params = {
                course_id:this.course_id,
                page_index:this.current,
                page_number:this.pagesize
            }
            util.ajax.get('/admin/comment/stay',{params:params}).then(response=>{
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
                this.spinShow=false
            })
        },
        getPassData(){
            let params = {
                course_id:this.course_id,
                page_index:this.current,
                page_number:this.pagesize
            }
            util.ajax.get('/admin/comment/pass',{params:params}).then(response=>{
                var res = response.data
                if(res.dec.code=='000000'){
                    this.data1 = res.data
                    this.total = res.total
                }else{
                    this.$Notice.error({
                        title: '提示信息',
                        desc: res.dec.msg
                    });
                }
                this.spinShow=false
            })
        },
        getRefuseData(){
            let params = {
                course_id:this.course_id,
                page_index:this.current,
                page_number:this.pagesize
            }
            util.ajax.get('/admin/comment/refuse',{params:params}).then(response=>{
                var res = response.data
                if(res.dec.code=='000000'){
                    this.data1 = res.data
                    this.total = res.total
                }else{
                    this.$Notice.error({
                        title: '提示信息',
                        desc: res.dec.msg
                    });
                }
            })
            this.spinShow=false
        },
    pageChange(val) {
      this.current = val;
      this.getData();
    },
    pageSizeChange(val) {
      this.current = 1;
      this.pagesize = val;
      this.getData();
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
        },
        rowClassName (row, index) {
            if(this.filter.type==-1){
                return 'table-reject-row';
            }else if(this.filter.type==1){
                return 'table-pass-row';
            }
            return ''
        }
  },
  mounted() {
    this.course_id = this.$route.params.course_id;
    this.getData();
  }
};
</script>
<style>
.no-radius{
    border-radius: 0;
}
.ivu-table .table-pass-row td{
    background-color: #00be674f;
}
.ivu-table .table-reject-row td{
    background-color: #f03d004f;
}
.c-show{
    display: inline-table;
}
.c-hide{
    display: none;
}
</style>

