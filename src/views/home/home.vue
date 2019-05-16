<style lang="less">
    @import "./home.less";
    @import "../../styles/common.less";
</style>
<template>
    <div class="home-main">
        <Row :gutter="10">
            <Col :md="24" :lg="8">
                <Row class-name="home-page-row1" :gutter="10">
                    <Col :md="12" :lg="24" :style="{marginBottom: '10px'}">
                        <Card>
                            <Row type="flex" class="user-infor">
                                <Col span="8">
                                    <Row class-name="made-child-con-middle" type="flex" align="middle">
                                        <img class="avator-img" src="../../images/fa.png" />
                                    </Row>
                                </Col>
                                <Col span="16" style="padding-left:6px;">
                                    <Row class-name="made-child-con-middle" type="flex" align="middle">
                                        <div>
                                            <b class="card-user-infor-name">Admin</b>
                                            <p>super admin</p>
                                        </div>
                                    </Row>
                                </Col>
                            </Row>
                            <div class="line-gray"></div>
                            <Row class="margin-top-8" style="margin-bottom:25px;">
                                <Col span="8"><p class="notwrap">当前系统时间:</p></Col>
                                <Col span="16" class="padding-left-8">{{formatFullTime()}}</Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </Col>
            <Col :md="24" :lg="16">
                <Row :gutter="20">
                    <Col :xs="24" :sm="8" :md="8" :style="{marginBottom: '20px'}">
                        <infor-card
                            id-name="user_created_count"
                            :end-val="count.add_user_num"
                            iconType="android-person-add"
                            :decimals="0"
                            color="#2d8cf0"
                            intro-text="本周新增用户"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="8" :md="8" :style="{marginBottom: '20px'}">
                        <infor-card
                            id-name="visit_count"
                            :end-val="count.view_course_num"
                            iconType="ios-eye"
                            color="#64d572"
                            :decimals="0"
                            :iconSize="50"
                            intro-text="本周微课浏览量"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="8" :md="8" :style="{marginBottom: '20px'}">
                        <infor-card
                            id-name="collection_count"
                            :end-val="count.view_qa_number"
                            iconType="ios-help"
                            color="#ffd572"
                            :decimals="0"
                            intro-text="本周问答浏览量"
                        ></infor-card>
                    </Col>
                </Row>
                <Row :gutter="20">
                    <Col :xs="24" :sm="8" :md="8" :style="{marginBottom: '20px'}">
                        <infor-card
                            id-name="wechat_sum_money"
                            :end-val="count.wechat_money_sum"
                            iconType="social-yen"
                            color="#64d572"
                            :iconSize="50"
                            :decimals="2"
                            intro-text="微信营收总额"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="8" :md="8" :style="{marginBottom: '20px'}">
                        <infor-card
                            id-name="coin_sum"
                            :end-val="count.coin_sum"
                            iconType="social-yen"
                            color="#ffd572"
                            :decimals="2"
                            intro-text="天鹅币消费总额"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="8" :md="8" :style="{marginBottom: '20px'}">
                        <infor-card
                            id-name="ali_sum_money"
                            :end-val="count.alipay_money_sum"
                            iconType="social-yen"
                            color="#ddd"
                            :decimals="2"
                            intro-text="支付宝营收总额"
                        ></infor-card>
                    </Col>
                </Row>
            </Col>
        </Row>
        <Row :gutter="10" class="margin-top-10">
            <!-- <Col :md="24" :lg="8" :style="{marginBottom: '10px'}">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="ios-help"></Icon>
                        问答分类统计
                    </p>
                    <div class="data-source-row">
                        <data-source-pie></data-source-pie>
                    </div>
                </Card>
            </Col> -->
            <Col :md="24" :lg="24" :style="{marginBottom: '10px'}">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="ios-shuffle-strong"></Icon>
                        订单统计
                    </p>
                    <div class="line-chart-con">
                        <service-requests></service-requests>
                    </div>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import util from "@/libs/util.js";
import cityData from './map-data/get-city-value.js';
import homeMap from './components/map.vue';
import dataSourcePie from './components/dataSourcePie.vue';
import visiteVolume from './components/visiteVolume.vue';
import serviceRequests from './components/serviceRequests.vue';
import userFlow from './components/userFlow.vue';
import countUp from './components/countUp.vue';
import inforCard from './components/inforCard.vue';
import mapDataTable from './components/mapDataTable.vue';
import toDoListItem from './components/toDoListItem.vue';

export default {
    name: 'home',
    components: {
        homeMap,
        dataSourcePie,
        visiteVolume,
        serviceRequests,
        userFlow,
        countUp,
        inforCard,
        mapDataTable,
        toDoListItem
    },
    data () {
        return {
            toDoList: [
                {
                    title: '去iView官网学习完整的iView组件'
                },
                {
                    title: '去iView官网学习完整的iView组件'
                },
                {
                    title: '去iView官网学习完整的iView组件'
                },
                {
                    title: '去iView官网学习完整的iView组件'
                },
                {
                    title: '去iView官网学习完整的iView组件'
                }
            ],
            count: {
                add_user_num: 0,
                view_course_num: 0,
                view_qa_number: 0,
                alipay_money_sum:0,
                wechat_money_sum:0,
                coin_sum:0
            },
            cityData: cityData,
            showAddNewTodo: false,
            newToDoItemValue: ''
        };
    },
    computed: {
        avatorPath () {
            return "../images/fa.png";
        }
    },
    methods: {
        init(){
            util.ajax
                .get("/admin/ds/weeknumber")
                .then(response => {
                var res = response.data;
                if (res.dec.code == "000000") {
                    this.count = res.data;
                } else {
                    this.$Notice.error({
                    title: "提示信息",
                    desc: res.dec.msg
                    });
                }
                this.spinShow = false;
            });
        },
        addNewToDoItem () {
            this.showAddNewTodo = true;
        },
        addNew () {
            if (this.newToDoItemValue.length !== 0) {
                this.toDoList.unshift({
                    title: this.newToDoItemValue
                });
                setTimeout(() => {
                    this.newToDoItemValue = '';
                }, 200);
                this.showAddNewTodo = false;
            } else {
                this.$Message.error('请输入待办事项内容');
            }
        },
        cancelAdd () {
            this.showAddNewTodo = false;
            this.newToDoItemValue = '';
        }
    },
    mounted(){
        this.init()
    }
};
</script>
