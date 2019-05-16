<template>
    <div class="article_body">
        <div class="rich_media_area_primary_inner" style="padding-bottom:20px;">
            <img :src="info.cover" style="width:100%">
            <div class="rich_media_info">
                <h3 class="rich_media_title">{{info.title}}</h3>
                <p class="desc m-t-10">
                    <span>{{ formatFullTime(info.opened_at*1000)}}</span>
                    <span class="fr">👍:{{info.praise_num}}</span>
                </p>
                <p class="ti m-t-10">
                    <span>主讲：{{info.lecturer_name}}</span>
                    <span class="fr">定价：{{info.is_oa==1?"免费":"¥"+info.now_price}}</span>
                </p>
            </div>
            <div class="line"></div>
            <div class="rich_media_info">
                <p class="desc" v-html="info.description"></p>
            </div>
            <div class="line"></div>
            <div class="rich_media_info">
                <Card dis-hover="true">
                    <p slot="title">
                        主讲人:{{info.lecturer_name}}【{{info.lecturer_title}}】
                    </p>
                    {{info.lecturer_intro}}
                </Card>
            </div>
            <!-- <div class="line"></div> -->

            <div class="rich_media_info m-t-10">
                <Card dis-hover="true">
                    <p slot="title">
                        其他字段
                    </p>
                    <p class="desc m-t-10">天鹅币：{{info.coin_price}}</p>
                    <p class="desc m-t-10">是否推荐：{{info.is_home==1?"是":"否"}}</p>
                    <p class="desc m-t-10">是否直播：{{info.is_live==1?"是":"否"}}</p>
                    <p class="desc m-t-10">结束时间：{{formatFullTime(info.closed_at*1000)}}</p>
                    <p class="desc m-t-10">创建时间：{{formatFullTime(info.created_at*1000)}}</p>
                    <p class="desc m-t-10">是否为线上：{{info.is_online==1?"是":"否"}}</p>
                    <p class="desc m-t-10">是否发布：{{info.is_publish==1?"是":"否"}}</p>
                    <p class="desc m-t-10">讲师头像：{{info.lecturer_avator}}</p>
                    <p class="desc m-t-10">讲师奖项：{{info.lecturer_award}}</p>
                </Card>
            </div>
        </div>
    </div>
</template>
<script>
import util from '@/libs/util.js';
export default {
    data(){
        return{
            course_id:undefined,
            bodyHeight:0,
            info:{
                title: "",
                description: "",
                lecturer_name: "",
                coin_price: "",
                now_price: "",
                cover: "",
                is_home: 0,
                is_live: 0,
                opened_at: 0,
                closed_at: 0,
                created_at: 0,
                is_oa: 0,
                is_online: 0,
                is_publish: 0,
                lecturer_avator: "",
                lecturer_intro: "",
                lecturer_title: "",
                lecturer_award: "",
                praise_num: ""
            }
        }
    },
    methods:{
        getArticleDetail(){
            let params = {
                course_id:this.course_id,
            }
            util.ajax.get('/admin/courses/detail1',{params:params}).then(response=>{
                var res = response.data
                if(res.dec.code=='000000'){
                    this.info = res.data
                }else{
                    this.$Notice.error({
                        title: '提示信息',
                        desc: res.dec.msg
                    });
                }
            })
        },
    },
    created(){
        this.course_id = this.$route.params.course_id;
        this.getArticleDetail()
    },
    mounted() {
        this.bodyHeight =
            window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight;
    }
}
</script>
<style scoped>
.article_body{
    background: #e8efee;
}
.rich_media_area_primary_inner{
        background: #fff;
        max-width: 477px;
        margin-left: auto;
        margin-right: auto;
}
.rich_media_info{
    padding: 0 20px;
}
.rich_media_title{
    font-weight:500;
    font-size: 18px;
    line-height: 20px;
}
.desc{
    line-height: 20px;
    font-size: 16px;
}
.ti{
    line-height: 20px;
    font-size: 18px;
}
.m-t-10{
    margin-top: 10px;
}
.fr{
    float: right;
}
.line{
    height: 10px;
    border-bottom:solid 1px #ddd;
    margin-bottom: 10px; 
}
</style>
