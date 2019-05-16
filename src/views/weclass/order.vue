<template>
    <Card :bordered="false" shadow>
        <p slot="title">
            <Icon type="ios-analytics"></Icon>
            订单列表
        </p>
        <Form ref="formInline" :model="filter" inline>
            <FormItem prop="type" label="类型">
                <Select v-model="filter.type" style="width:150px" @on-change="getData">
                    <Option value="-1" >全部</Option>
                    <Option value="0" >微信支付</Option>
                    <Option value="1" >支付宝支付</Option>
                    <Option value="2" >天鹅币支付</Option>
                </Select>
            </FormItem>
        </Form>
        <Table border stripe :columns="columns" :data="data" class="m-b-10"></Table>
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
        type: "-1",
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
      columns: [
        {
          title: "用户",
          width: 150,
          key:"nick_name"
        },
        {
          title: "订单标题",
          key: "order_title"
        },
        {
          title: "订单号",
          key: "order_no"
        },
        {
          title: "金额",
          key: "order_amount",
          align:"center"
        },
        {
          title: "支付类型",
          key: "order_plat",
          align:"center",
          render: (h, params) => {
              return h("tag",{
                    props:{
                        checkable:false,
                        color:this.getFlatColor(params.row.order_plat)
                    }
                },this.getFlatName(params.row.order_plat)
            );
          }
        },
        {
          title: "平台交易号",
          key: "transaction_no"
        },
        {
          title: "创建时间",
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
          title: "支付完成时间",
          key: "completed_at",
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
      data: [],
      data1: []
    };
  },
  methods: {

    getData(){
        let params = {
            type:this.filter.type,
            page_index:this.current,
            page_number:this.pagesize
        }
        util.ajax.get('/admin/order/list',{params:params}).then(response=>{
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
    pageChange(val) {
      this.current = val;
      this.getData();
    },
    pageSizeChange(val) {
      this.current = 1;
      this.pagesize = val;
      this.getData();
    },
    getFlatName(val){
        if(val==0){
            return "微信支付"
        }else if(val==1){
            return "支付宝"
        }else if(val==2){
            return "天鹅币"
        }
        return '未知'
    },
    getFlatColor(val){
        if(val==0){
            return "green"
        }else if(val==1){
            return "blue"
        }else if(val==2){
            return "yellow"
        }
        return 'yellow'
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

