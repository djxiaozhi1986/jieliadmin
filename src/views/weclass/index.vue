<template>
    <Card :bordered="false" shadow>
        <p slot="title">
            <Icon type="ios-analytics"></Icon>
            课程列表
        </p>
        <a href="#" slot="extra" @click.prevent="add">
            <Icon type="plus-circled"></Icon>
            新增
        </a>
        <Form ref="formInline" :model="filter"  inline>
            <FormItem prop="user" label="课程名称或讲师">
                <Input type="text" v-model="filter.search_text" placeholder="请入课程名称或讲师" style="width:500px"></Input>
            </FormItem>
            <FormItem prop="type" label="类型">
                <Select v-model="filter.type" style="width:150px">
                    <Option value="-1">全部</Option>
                    <Option value="0" >精品</Option>
                    <Option value="1" >线上</Option>
                </Select>
            </FormItem>
            <FormItem prop="type" label="课程状态">
                <Select v-model="filter.status" style="width:150px">
                    <Option value="-1">全部</Option>
                    <Option value="0" >未开始</Option>
                    <Option value="1" >进行中</Option>
                    <Option value="2" >已结束</Option>
                </Select>
            </FormItem>
            <FormItem prop="type" label="发布状态">
                <Select v-model="filter.is_publish" style="width:150px">
                    <Option value="-1">全部</Option>
                    <Option value="0" >下架</Option>
                    <Option value="1" >在线</Option>
                </Select>
            </FormItem>
            <FormItem label="搜索">
                <Button type="primary" @click="getData">搜索</Button>
            </FormItem>
        </Form>
        <!-- <Row class="m-b-10">
             <Col span="12">
                <Input v-model="search_text" size="large" placeholder="筛选条件，请入课程名称或讲师">
                    <Button slot="append" icon="ios-search" @click="getData"></Button>
                </Input>
            </Col>
        </Row> -->
        <Table border stripe :columns="columns" :data="data" class="m-b-10" ></Table>
        <Spin size="large" fix v-if="spinShow"></Spin>
        <Page :total="total" show-total show-sizer :current.sync="current" :page-size="pagesize" @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
        <Modal
            v-model="showTip"
            title="提示信息"
            width="300"
            ok-text="确定"
            @on-cancel="modal_cancel"
            @on-ok="modal_ok()">
            <p>{{tipMsg}}</p>
        </Modal>
    </Card>
</template>
<script>
import util from "@/libs/util.js";
export default {
  components: {},
  data() {
    return {
      filter: {
        search_text: "",
        type: "-1",
        status:"-1",
        is_publish:"-1"
      },
      can_talk_data:true,
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
          title: "封皮",
          width: 200,
          render: (h, params) => {
            // console.log(params.row.cover)
            if (params.row.cover != undefined) {
                return h("div",[
                    h("div",{
                        style:{
                            position:"absolute",
                            left:0,
                            marginTop:0,
                        }
                    },[
                        h("tag",{
                            props:{
                                // type:"dot",
                                color:"blue",
                                size: "samll",
                                className:"no-radius"
                            },
                            style:{
                                borderRadius:0,
                                opacity:0.7,
                                marginRight:0,
                                display:params.row.is_live==1 && params.row.is_publish==1 && (params.row.im_group_id==undefined || params.row.im_group_id=='')?"none":"inline-block"
                            }
                        },"IM"),
                        h("tag",{
                            props:{
                                // type:"dot",
                                color:"green",
                                size: "samll",
                                className:"no-radius"
                            },
                            style:{
                                borderRadius:0,
                                opacity:0.7,
                                marginRight:0,
                                display:params.row.is_publish==0?"none":"inline-block"
                            }
                        },"已发布"),
                    ]),
                    
                    h("img", {
                        attrs: {
                            width: 170,
                            src: util.ajax.api_url + "/" + params.row.cover
                        },
                        style: {
                            margin: "5px 0"
                        }
                    })
                ])
            } else {
              return "无";
            }
          }
        },
        {
          title: "课程名称",
          // key: 'title',
        //   width: 150,
          render: (h, params) => {
              return h('div',[
                h("a",{
                    attrs: {
                    name: params.row.course_id,
                    href: "#/detail/" + params.row.course_id
                    }
                },params.row.title),
              ])
            
          }
        },
        {
          title: "类型",
          width: 90,
          align: 'center',
          render: (h, params) => {
            if (params.row.is_live == 1) {
              return h(
                "tag",
                {
                  props: {
                    color: "green",
                    size: "samll"
                  }
                },
                "线上"
              );
            }
            if (params.row.is_good == 1) {
              return h(
                "tag",
                {
                  props: {
                    color: "blue",
                    size: "samll"
                  }
                },
                "精品"
              );
            }
          }
          // filters: [
          //     {
          //         label: '线上',
          //         value: 1
          //     },
          //     {
          //         label: '精品',
          //         value: 0
          //     }
          // ],
          // filterMultiple: false,
          // filterMethod (value, row) {
          //     if (value === 1) {
          //         return row.is_live==1;
          //     } else if (value === 0) {
          //         return row.is_good==1 && row.is_live==0;
          //     }
          // }
        },
        {
          title: "讲师",
          key: "lecturer_name",
          width: 120
        },
        {
          title: "币值",
          key: "coin_price",
          align: 'center',
          width: 100
        },
        {
          title: "现价",
          key: "now_price",
          align: 'center',
          width: 100
        },
        {
          title: "课程状态",
          key: "status",
          align: 'center',
          width: 100
        },
        {
          title: "发布状态",
          width: 90,
          align: 'center',
          render: (h, params) => {
            if (params.row.is_publish == 1) {
              return h(
                "tag",
                {
                  props: {
                    color: "green",
                    size: "samll"
                  }
                },
                "在线"
              );
            }else{
              return h(
                "tag",
                {
                  props: {
                    color: "red",
                    size: "samll"
                  }
                },
                "下架"
              );
            }
          }
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
          title: "操作",
          key: "action",
        //   fixed: "right",
          align: 'center',
          width: 120,
          render: (h, params) => {
            return h("Dropdown",{
                props:{
                    // placement:"bottom-end"
                },
                on: {
                  "on-click": value => {
                    switch(value){
                        case "edit":
                            this.edit(params.row.course_id)
                            break;
                        case "resourse":
                            this.section(params.row.course_id)
                            break;
                        case "publish":
                            this.tipMsg="您确定发布本课程吗?"
                            // this.publish(params.row.course_id)
                            this.confirm(params.row.course_id,'publish',0)
                            break;
                        case "down":
                            this.tipMsg="您确定下架本课程吗?"
                            // this.down(params.row.course_id)
                            this.confirm(params.row.course_id,'down',0)
                            break;
                        case "check":
                            this.comments(params.row.course_id)
                            break;
                        case "answer":
                            this.addAnswer(params.row.course_id)
                            break;
                        case "im":
                            this.tipMsg="您确定创建本课程的聊天群组吗?"
                            // this.create_im(params.row.course_id)
                            this.confirm(params.row.course_id,'im',0)
                            break;
                        case "delete":
                            this.tipMsg="您确定删除本课程吗?"
                            // this.delete(params.row.course_id)
                            this.confirm(params.row.course_id,'delete',0)
                            break;
                        case "can_talk":
                            if(params.row.can_talk==1){
                              this.tipMsg="您确定对本课程进行禁言操作吗?"
                            }else{
                              this.tipMsg="您确定对本课程进行解禁操作吗?"
                            }
                            
                            // this.delete(params.row.course_id)
                            this.confirm(params.row.course_id,'can_talk',params.row.can_talk)
                            break;
                        case "add_zip":
                            this.tipMsg="您确定对本课程进行打包操作吗?"
                            this.confirm(params.row.course_id,'add_zip',params.row.im_group_id)
                            break;
                        case "get_zip":
                            this.download(params.row.im_group_id)
                            break;
                    }
                  }
                }
              },
              [
                h("div",{
                    class: {
                      member_operate_div: true
                    }
                },
                [
                    h("Badge",{
                      props:{
                        dot:params.row.check_count>0
                      }
                    },[
                      h(
                      "Button",
                      {
                        props: {
                          type: "primary"
                        }
                      },
                      [
                        h("span", "操作"),
                        h("Icon", {
                          props: {
                            type: "arrow-down-b"
                          },
                          style: {
                            marginLeft: "5px"
                          }
                        })
                      ]
                    )
                    ]),
                  ]
            ),
            h("DropdownMenu",{
                slot: "list"
            },
            [
                h("DropdownItem",{
                    props: {
                        name: "edit",
                        disabled:params.row.is_publish==0?false:true
                    },
                },"编辑"),
                h("DropdownItem",{
                    props: {
                        name: "resourse"
                    }
                },"线下资源"),
                h("DropdownItem",{
                    props: {
                        name: "publish",
                        disabled:params.row.is_publish==0?false:true
                    }
                },"发布"),
                h("DropdownItem",{
                    props: {
                        name: "down",
                        disabled:params.row.is_publish==1?false:true
                    }
                },"下架"),
                h("DropdownItem",{
                    props: {
                        name: "check",
                        disabled:params.row.is_publish==1?false:true
                    }
                },"评论审核"),
                h("DropdownItem",{
                    props: {
                        name: "answer",
                        disabled:params.row.is_publish==1?false:true
                    }
                },"添加问答"),
                h("DropdownItem",{
                    props: {
                        name: "im",
                        disabled:params.row.is_live==1 && params.row.is_publish==1 && (params.row.im_group_id==undefined || params.row.im_group_id=='')?false:true
                    }
                },"IM"),
                h("DropdownItem",{
                    props: {
                        name: "add_zip",
                        disabled:params.row.is_live==1 && params.row.is_publish==1 && (params.row.im_group_id==undefined || params.row.im_group_id=='')?true:false
                    }
                },params.row.is_zip==0?"打包":"重新打包"),
                h("DropdownItem",{
                    props: {
                        name: "get_zip",
                        disabled:params.row.is_zip==1?false:true
                    }
                },"下载"),
                h("DropdownItem",{
                    props: {
                        name: "delete",
                        // disabled:params.row.is_live==1 && params.row.is_publish==1 && (params.row.im_group_id==undefined || params.row.im_group_id=='')?false:true
                    },
                },"删除"),
                h("DropdownItem",{
                    props: {
                        name: "can_talk",
                        // disabled:params.row.is_live==1 && params.row.is_publish==1 && (params.row.im_group_id==undefined || params.row.im_group_id=='')?false:true
                    },
                },params.row.can_talk==1?'禁言':'解禁'),
            ])
            ]);
        }
          // render: (h, params) => {
          //     return h('div', [
          //         h('Button', {
          //             props: {
          //                 type: 'primary',
          //             },
          //             style: {
          //                 display:params.row.is_publish==0?"inline-block":"none",
          //                 margin: '0 5px'
          //             },
          //             on: {
          //                 click: () => {
          //                     this.edit(params.row.course_id)
          //                 }
          //             }
          //         },'编辑'),
          //         h('Button', {
          //             props: {
          //                 type: 'primary',
          //             },
          //             style: {
          //                 margin: '0 5px'
          //             },
          //             on: {
          //                 click: () => {
          //                     this.section(params.row.course_id)
          //                 }
          //             }
          //         },'线下资源'),
          //         h('Poptip', {
          //             props: {
          //                 confirm: true,
          //                 title: '您确定要删除这条数据吗?',
          //                 transfer: true
          //             },
          //             on: {
          //                 'on-ok': () => {
          //                     this.delete(params.row.course_id)
          //                 }
          //             }
          //         }, [
          //             h('Button', {
          //                 style: {
          //                     margin: '0 5px'
          //                 },
          //                 props: {
          //                     type: 'error',
          //                     placement: 'top'
          //                 }
          //             }, '删除')
          //         ]),
          //         h('Poptip', {
          //             props: {
          //                 confirm: true,
          //                 title: '您确定发布本课程吗?',
          //                 transfer: true
          //             },
          //             on: {
          //                 'on-ok': () => {
          //                     this.publish(params.row.course_id)
          //                 }
          //             }
          //         }, [
          //             h('Button', {
          //                 style: {
          //                     margin: '0 5px',
          //                     display:params.row.is_publish==0?"inline-block":"none"
          //                 },
          //                 props: {
          //                     type: 'success',
          //                     placement: 'top'
          //                 }
          //             }, '发布')
          //         ]),
          //         h('Poptip', {
          //             props: {
          //                 confirm: true,
          //                 title: '您确定下架该课程吗?',
          //                 transfer: true
          //             },
          //             on: {
          //                 'on-ok': () => {
          //                     this.down(params.row.course_id)
          //                 }
          //             }
          //         }, [
          //             h('Button', {
          //                 style: {
          //                     margin: '0 5px',
          //                     display:params.row.is_publish==1?"inline-block":"none"
          //                 },
          //                 props: {
          //                     type: 'error',
          //                     placement: 'top'
          //                 }
          //             }, '下架')
          //         ]),
          //         h('Button', {
          //             props: {
          //                 type: 'primary',
          //             },
          //             style: {
          //                 margin: '0 5px',
          //                 display:params.row.is_publish==1?"inline-block":"none"
          //             },
          //             on: {
          //                 click: () => {
          //                     this.comments(params.row.course_id)
          //                 }
          //             }
          //         },'评论审核'),
          //         h('Button', {
          //             props: {
          //                 type: 'success',
          //             },
          //             style: {
          //                 margin: '0 5px',
          //                 display:params.row.is_publish==1?"inline-block":"none"
          //             },
          //             on: {
          //                 click: () => {
          //                     this.addAnswer(params.row.course_id)
          //                 }
          //             }
          //         },'添加问答'),,
          //         h('Button', {
          //             props: {
          //                 type: 'success',
          //             },
          //             style: {
          //                 margin: '0 5px',
          //                 display:params.row.is_live==1 && params.row.is_publish==1 && (params.row.im_group_id==undefined || params.row.im_group_id=='')?"inline-block":"none"
          //             },
          //             on: {
          //                 click: () => {
          //                     this.create_im(params.row.course_id)
          //                 }
          //             }
          //         },'IM'),
          //     ]);
          // }
        }
      ],
      data: []
    };
  },
  methods: {
    getData() {
      this.spinShow = true;
      let params = {
        page_index: this.current,
        page_number: this.pagesize,
        keyword: this.filter.search_text
      };
      if (this.filter.type != -1) {
        params.type = this.filter.type;
      }
      if (this.filter.status != -1) {
        params.status = this.filter.status;
      }
      if(this.filter.is_publish != -1){
        params.is_publish = this.filter.is_publish
      }

      util.ajax
        .get("/admin/courses/list", { params: params })
        .then(response => {
          var res = response.data;
          if (res.dec.code == "000000") {
            this.data = res.data;
            this.total = res.total;
          } else {
            this.$Notice.error({
              title: "提示信息",
              desc: res.dec.msg
            });
          }
          this.spinShow = false;
        });
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
    add() {
      this.$router.push({
        name: "weclass_add"
      });
    },
    section(course_id, title) {
      this.$router.push({
        name: "section_add",
        params: { course_id: course_id, title: title }
      });
    },
    comments(course_id) {
      this.$router.push({
        name: "comments",
        params: { course_id: course_id }
      });
    },
    publish(course_id) {
      util.ajax
        .post("/admin/courses/publish", { course_id: course_id })
        .then(response => {
          var res = response.data;
          if (res.dec.code == "000000") {
            this.$Notice.success({
              title: "提示信息",
              desc: "发布成功"
            });
            setTimeout(() => {
              this.$router.go(0);
            }, 1000);
            // this.$router.go(0)
          } else {
            this.$Notice.error({
              title: "提示信息",
              desc: res.dec.msg
            });
          }
        });
    },
    down(course_id) {
      util.ajax
        .post("/admin/courses/down", { course_id: course_id })
        .then(response => {
          var res = response.data;
          if (res.dec.code == "000000") {
            this.$Notice.success({
              title: "提示信息",
              desc: "下架成功"
            });
            setTimeout(() => {
              this.$router.go(0);
            }, 1000);
            // this.$router.go(0)
          } else {
            this.$Notice.error({
              title: "提示信息",
              desc: res.dec.msg
            });
          }
        });
    },
    delete(course_id) {
      util.ajax
        .delete("/admin/courses/del", { params: { course_id: course_id } })
        .then(response => {
          var res = response.data;
          if (res.dec.code == "000000") {
            this.$Notice.success({
              title: "提示信息",
              desc: "删除成功"
            });
            setTimeout(() => {
              this.$router.go(0);
            }, 1000);
          } else {
            this.$Notice.error({
              title: "提示信息",
              desc: res.dec.msg
            });
          }
        });
    },
    edit(course_id) {
      this.$router.push({
        name: "weclass_edit",
        params: { course_id: course_id }
      });
    },
    addAnswer(course_id) {
      this.$router.push({
        name: "add_answer",
        params: { course_id: course_id }
      });
    },
    create_im(course_id) {
      util.ajax
        .post("/admin/im/create", { course_id: course_id })
        .then(response => {
          var res = response.data;
          if (res.dec.code == "000000") {
            this.$Notice.success({
              title: "提示信息",
              desc: "创建成功"
            });
            setTimeout(() => {
              this.$router.go(0);
            }, 1000);
          } else {
            this.$Notice.error({
              title: "提示信息",
              desc: res.dec.msg
            });
          }
        });
    },
    banTalk(course_id,can_talk_data){
      var msg = '禁言'
      var data = 0
      if(can_talk_data==0){
        msg = '解禁'
        data = 1
      }else{
        msg = '禁言'
        data = 0
      }
      util.ajax
        .post("/admin/courses/talk/ban", { course_id: course_id,can_talk:data })
        .then(response => {
          var res = response.data;
          if (res.dec.code == "000000") {
            this.$Notice.success({
              title: "提示信息",
              desc: msg+"成功"
            });
            setTimeout(() => {
              this.$router.go(0);
            }, 1000);
          } else {
            this.$Notice.error({
              title: "提示信息",
              desc: msg+"失败："+res.dec.msg
            });
          }
        });
    },
    confirm(course_id,action,data){
      
        this.current_course_id = course_id
        this.current_action = action
        this.showTip=true
        this.can_talk_data = data
    },
    modal_ok(){
        // alert(this.current_action)
        switch(this.current_action){
            case "publish":
                this.publish(this.current_course_id)
                break;
            case "down":
                this.down(this.current_course_id)
                break;
            case "im":
                this.create_im(this.current_course_id)
                break;
            case "delete":
                this.delete(this.current_course_id)
                break;
            case "can_talk":
                this.banTalk(this.current_course_id,this.can_talk_data)
                break;
            case "add_zip":
                this.add_zip(this.can_talk_data)
                break;
        }
        this.tipMsg=""
        this.showTip=false
    },
    add_zip(group_id){
      util.ajax
        .post("/admin/zip/add", { group_id:group_id })
        .then(response => {
          var res = response.data;
          if (res.dec.code == "000000") {
            this.$Notice.success({
              title: "提示信息",
              desc: "打包成功"
            });
            setTimeout(() => {
              this.$router.go(0);
            }, 1000);
          } else {
            this.$Notice.error({
              title: "提示信息",
              desc: '打包失败'
            });
          }
        });
    },
    download(group_id){
      util.ajax
        .get("/admin/zip/get", {params:{ group_id:group_id }})
        .then(response => {
          var res = response.data;
          if(res.dec.code="000000"){
            window.open(res.data.url)
          }else{
            this.$Notice.warning({
              title: "提示信息",
              desc: '正在打包中,请耐心等待...'
            });
          }
        });
    },
    modal_cancel(){
        this.current_course_id = undefined
        this.current_action=undefined
        this.showTip=false
        this.tipMsg = ''
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
<style scoped>
.no-radius{
    border-radius: 0;
}
</style>

