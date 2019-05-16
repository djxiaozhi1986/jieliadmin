<template>
<Card :bordered="false" shadow>
        <p slot="title">
            <Icon type="ios-analytics"></Icon>
            分类管理
        </p>
        <Row>
            <Col span="12">
                <Tree :data="data" :render="renderContent"></Tree>
                <Button type="primary" @click="formItem.PName='添加顶级分类';show_add=true">添加顶级分类</Button>
            </Col>
            <Col span="12">
                <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80" v-show="show_add">
                    <!-- <FormItem label="上级分类">
                        <Tag color="blue" v-if="formItem.parent_id!=undefined">{{formItem.PName}}</Tag>
                        <Tag color="green" v-else>{{formItem.PName}}</Tag>
                    </FormItem> -->
                    <FormItem label="分类名称" prop="category_name">
                        <Input v-model="formItem.category_name" placeholder="分类名称"></Input>
                    </FormItem>
                    <FormItem label="排序" prop="sort">
                        <InputNumber :max="10" :min="1" v-model="formItem.sort"></InputNumber>
                    </FormItem>
                    <FormItem label="用户默认">
                        <Checkbox v-model="formItem.is_default"></Checkbox>
                        <!-- <InputNumber :max="10" :min="1" v-model="formItem.sort"></InputNumber> -->
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="save('formValidate')">保存</Button>
                        <Button style="margin-left: 8px" @click="formItem.parent_id=undefined;show_add=false">取消</Button>
                    </FormItem>
                </Form>
            </Col>
        </Row>
    
</Card>
</template>
<script>
import util from '@/libs/util.js';
    export default {
        data () {
            return {
                formItem: {
                    parent_id: undefined,
                    PName: '',
                    category_name: '',
                    sort: 1,
                    is_default:false,
                    id:undefined
                },
                ruleValidate: {
                    category_name: [
                        { required: true, message: '请输入分类名称', trigger: 'blur' }
                    ]
                },
                show_add:false,
                
                data:[],
                buttonProps: {
                    type: 'ghost',
                    size: 'small',
                }
            }
        },
        methods: {
            getData(){
                this.spinShow = true
                util.ajax.get('/admin/category/manager').then(response=>{
                    var res = response.data
                    if(res.dec.code=='000000'){
                        this.data = res.data
                    }else{
                        this.$Notice.error({
                            title: '提示信息',
                            desc: res.dec.msg
                        });
                    }
                    this.spinShow = false
                })
            },
            renderContent (h, { root, node, data }) {
                return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%'
                    }
                }, [
                    h('span', [
                        h('Icon', {
                            props: {
                                type: 'ios-paper-outline'
                            },
                            style: {
                                marginRight: '8px'
                            }
                        }),
                        h('span', data.title)
                    ]),
                    h('span', {
                        style: {
                            display: 'inline-block',
                            float: 'right',
                            marginRight: '32px'
                        }
                    }, 
                    [
                        // h('Button', {
                        //     props: Object.assign({}, this.buttonProps, {
                        //         icon: 'plus-round'
                        //     }),
                        //     style: {
                        //         marginRight: '8px',
                        //         display:data.parent_id==0?"inline-block":"none"
                        //     },
                        //     on: {
                        //         click: () => { 
                        //             this.formItem.parent_id = data.id
                        //             this.formItem.PName = data.title
                        //             this.show_add = true 
                        //         }
                        //     }
                        // },'添加子集'),
                        h('Button', {
                            props: Object.assign({}, this.buttonProps, {
                                icon: 'edit'
                            }),
                            style: {
                                marginRight: '8px',
                                // display:data.parent_id==0?"inline-block":"none"
                            },
                            on: {
                                click: () => { 
                                    // console.log(data)
                                    this.formItem.parent_id = data.parent_id
                                    this.formItem.PName = data.pname
                                    this.formItem.category_name = data.title
                                    this.formItem.id=data.id
                                    this.formItem.is_default = (data.is_default==1?true:false)
                                    this.show_add = true 
                                }
                            }
                        },'编辑'),
                        h('Poptip', {
                            props: {
                                confirm: true,
                                title: '您确定要删除此分类吗?',
                                transfer: true
                            },
                            on: {
                                'on-ok': () => {
                                    this.remove(data.id)
                                }
                            }
                        }, [
                            h('Button', {
                                style: {
                                    margin: '0 5px'
                                },
                                props: Object.assign({}, this.buttonProps, {
                                icon: 'minus-round'
                                }),
                            }, '删除')
                        ]),
                        // h('Button', {
                        //     props: Object.assign({}, this.buttonProps, {
                        //         icon: 'minus-round'
                        //     }),
                        //     on: {
                        //         click: () => { this.remove(root, node, data) }
                        //     }
                        // })
                    ]
                    )
                ]);
            },
            append (data) {
                const children = data.children || [];
                children.push({
                    title: 'appended node',
                    expand: true
                });
                this.$set(data, 'children', children);
            },
            remove (id) {
                util.ajax.delete('/admin/category/del',{params:{id:id}}).then(response=>{
                    var res = response.data
                    if(res.dec.code=='000000'){
                        this.$Message.success('删除成功');
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
            },
            save(name){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let params = {
                            pid:this.formItem.parent_id,
                            cname:this.formItem.category_name,
                            csort:this.formItem.sort,
                            id:this.formItem.id,
                            is_default:this.formItem.is_default
                        }
                        //开始保存
                        util.ajax.post('/admin/category/save',params).then(response=>{
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
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            }
        },
        mounted () {
            this.getData();
        }
    }
</script>
