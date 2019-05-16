import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: () => import('@/views/login.vue')
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};

export const preview = {
    path: '/preview',
    name: 'preview',
    component: () => import('@/views/form/article-publish/preview.vue')
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: () => import('@/views/main-components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        { path: 'home', title: {i18n: 'home'}, name: 'home_index', component: () => import('@/views/home/home.vue') },
        // { path: 'ownspace', title: '个人中心', name: 'ownspace_index', component: () => import('@/views/own-space/own-space.vue') },
        // { path: 'order/:order_id', title: '订单详情', name: 'order-info', component: () => import('@/views/advanced-router/component/order-info.vue') }, // 用于展示动态路由
        // { path: 'shopping', title: '购物详情', name: 'shopping', component: () => import('@/views/advanced-router/component/shopping-info.vue') }, // 用于展示带参路由
        { path: 'add_course', title: '新增微课', name: 'weclass_add', component: () => import('@/views/weclass/addCourse.vue') },
        { path: 'edit_course/:course_id', title: '编辑微课', name: 'weclass_edit', component: () => import('@/views/weclass/editCourse.vue') },
        { path: 'section_add/:course_id', title: '章节管理', name: 'section_add', component: () => import('@/views/weclass/addSection.vue') },
        { path: 'detail/:course_id', title: '微课详情', name: 'detail', component: () => import('@/views/weclass/detail.vue') },
        { path: 'comments/:course_id', title: '评论审核', name: 'comments', component: () => import('@/views/weclass/comment.vue') },
        { path: 'add_answer/:course_id', title: '添加问答', name: 'add_answer', component: () => import('@/views/weclass/addAnswer.vue') },
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/weclass',
        icon: 'ios-book',
        name: 'index',
        title: '微课管理',
        component: Main,
        children: [
            { path: 'index', title: '微课管理', name: 'weclass_index', component: () => import('@/views/weclass/index.vue') },
        ]
    },
    // {
    //     path: '/weclass',
    //     icon: 'university',
    //     name: 'lecturers',
    //     title: '讲师管理',
    //     component: Main,
    //     children: [
    //         { path: 'lecturer', title: '讲师管理', name: 'weclass_lecturer', component: () => import('@/views/weclass/lecturer.vue') },
    //     ]
    // },
    // {
    //     path: '/weclass',
    //     icon: 'chatbox-working',
    //     name: 'comment',
    //     title: '评论审核',
    //     component: Main,
    //     children: [
    //         { path: 'comment', title: '评论审核', name: 'weclass_comment', component: () => import('@/views/weclass/comment.vue') },
    //     ]
    // },
    // {
    //     path: '/weclass',
    //     icon: 'ios-cart',
    //     name: 'weclass',
    //     title: '微课管理',
    //     component: Main,
    //     children: [
    //         { path: 'order', title: '订单管理', name: 'weclass_order', component: () => import('@/views/weclass/order.vue') },
    //     ]
    // },
    // {
    //     path: '/weclass',
    //     icon: 'ios-people',
    //     name: 'user',
    //     title: '用户管理',
    //     component: Main,
    //     children: [
    //         { path: 'user', title: '用户管理', name: 'weclass_user', component: () => import('@/views/weclass/users.vue') },
    //     ]
    // },
    {
        path: '/weclass',
        icon: 'ios-bookmarks',
        name: 'category',
        title: '分类管理',
        component: Main,
        children: [
            { path: 'category', title: '分类管理', name: 'categorys', component: () => import('@/views/weclass/categorys.vue') },
        ]
    },
    {
        path: '/weclass',
        icon: 'ios-cart',
        name: 'order',
        title: '订单管理',
        component: Main,
        children: [
            { path: 'order', title: '订单管理', name: 'orders', component: () => import('@/views/weclass/order.vue') },
        ]
    },
    // {
    //     path: '/weclass',
    //     icon: 'ios-bookmarks',
    //     name: 'domain',
    //     title: '域名注册',
    //     component: Main,
    //     children: [
    //         { path: 'domain', title: '域名注册', name: 'domains', component: () => import('@/views/weclass/domain.vue') },
    //     ]
    // },
    // {
    //     path: '/weclass',
    //     icon: 'chatbubble-working',
    //     name: 'message',
    //     title: '系统消息',
    //     component: Main,
    //     children: [
    //         { path: 'message', title: '系统消息', name: 'weclass_message', component: () => import('@/views/weclass/message.vue') },
    //     ]
    // },
    // {
    //     path: '/weclass',
    //     icon: 'card',
    //     name: 'finance',
    //     title: '收支情况',
    //     component: Main,
    //     children: [
    //         { path: 'finance', title: '收支情况', name: 'weclass_finance', component: () => import('@/views/weclass/finance.vue') },
    //     ]
    // },
    // {
    //     path: '/access',
    //     icon: 'key',
    //     name: 'access',
    //     title: '权限管理',
    //     component: Main,
    //     children: [
    //         { path: 'index', title: '权限管理', name: 'access_index', component: () => import('@/views/access/access.vue') }
    //     ]
    // },
    // {
    //     path: '/access-test',
    //     icon: 'lock-combination',
    //     title: '权限测试页',
    //     name: 'accesstest',
    //     access: 0,
    //     component: Main,
    //     children: [
    //         { path: 'index', title: '权限测试页', name: 'accesstest_index', access: 0, component: () => import('@/views/access/access-test.vue') }
    //     ]
    // },
    // {
    //     path: '/international',
    //     icon: 'earth',
    //     title: {i18n: 'international'},
    //     name: 'international',
    //     component: Main,
    //     children: [
    //         { path: 'index', title: {i18n: 'international'}, name: 'international_index', component: () => import('@/views/international/international.vue') }
    //     ]
    // },
    // {
    //     path: '/component',
    //     icon: 'social-buffer',
    //     name: 'component',
    //     title: '组件',
    //     component: Main,
    //     children: [
    //         {
    //             path: 'text-editor',
    //             icon: 'compose',
    //             name: 'text-editor',
    //             title: '富文本编辑器',
    //             component: () => import('@/views/my-components/text-editor/text-editor.vue')
    //         },
    //         {
    //             path: 'md-editor',
    //             icon: 'pound',
    //             name: 'md-editor',
    //             title: 'Markdown编辑器',
    //             component: () => import('@/views/my-components/markdown-editor/markdown-editor.vue')
    //         },
    //         {
    //             path: 'image-editor',
    //             icon: 'crop',
    //             name: 'image-editor',
    //             title: '图片预览编辑',
    //             component: () => import('@/views/my-components/image-editor/image-editor.vue')
    //         },
    //         {
    //             path: 'draggable-list',
    //             icon: 'arrow-move',
    //             name: 'draggable-list',
    //             title: '可拖拽列表',
    //             component: () => import('@/views/my-components/draggable-list/draggable-list.vue')
    //         },
    //         {
    //             path: 'area-linkage',
    //             icon: 'ios-more',
    //             name: 'area-linkage',
    //             title: '城市级联',
    //             component: () => import('@/views/my-components/area-linkage/area-linkage.vue')
    //         },
    //         {
    //             path: 'file-upload',
    //             icon: 'android-upload',
    //             name: 'file-upload',
    //             title: '文件上传',
    //             component: () => import('@/views/my-components/file-upload/file-upload.vue')
    //         },
    //         {
    //             path: 'scroll-bar',
    //             icon: 'android-upload',
    //             name: 'scroll-bar',
    //             title: '滚动条',
    //             component: () => import('@/views/my-components/scroll-bar/scroll-bar-page.vue')
    //         },
    //         {
    //             path: 'count-to',
    //             icon: 'arrow-graph-up-right',
    //             name: 'count-to',
    //             title: '数字渐变',
    //             // component: () => import('@/views/my-components/count-to/count-to.vue')
    //             component: () => import('@/views/my-components/count-to/count-to.vue')
    //         },
    //         {
    //             path: 'split-pane-page',
    //             icon: 'ios-pause',
    //             name: 'split-pane-page',
    //             title: 'split-pane',
    //             component: () => import('@/views/my-components/split-pane/split-pane-page.vue')
    //         }
    //     ]
    // },
    // {
    //     path: '/form',
    //     icon: 'android-checkbox',
    //     name: 'form',
    //     title: '表单编辑',
    //     component: Main,
    //     children: [
    //         { path: 'artical-publish', title: '文章发布', name: 'artical-publish', icon: 'compose', component: () => import('@/views/form/article-publish/article-publish.vue') },
    //         { path: 'workflow', title: '工作流', name: 'workflow', icon: 'arrow-swap', component: () => import('@/views/form/work-flow/work-flow.vue') }

    //     ]
    // },
    // {
    //     path: '/charts',
    //     icon: 'ios-analytics',
    //     name: 'charts',
    //     title: '图表',
    //     component: Main,
    //     children: [
    //         { path: 'pie', title: '饼状图', name: 'pie', icon: 'ios-pie', component: resolve => { require('@/views/access/access.vue') },
    //         { path: 'histogram', title: '柱状图', name: 'histogram', icon: 'stats-bars', component: resolve => { require('@/views/access/access.vue') }

    //     ]
    // },
    // {
    //     path: '/tables',
    //     icon: 'ios-grid-view',
    //     name: 'tables',
    //     title: '表格',
    //     component: Main,
    //     children: [
    //         { path: 'dragableTable', title: '可拖拽排序', name: 'dragable-table', icon: 'arrow-move', component: () => import('@/views/tables/dragable-table.vue') },
    //         { path: 'editableTable', title: '可编辑表格', name: 'editable-table', icon: 'edit', component: () => import('@/views/tables/editable-table.vue') },
    //         { path: 'searchableTable', title: '可搜索表格', name: 'searchable-table', icon: 'search', component: () => import('@/views/tables/searchable-table.vue') },
    //         { path: 'exportableTable', title: '表格导出数据', name: 'exportable-table', icon: 'code-download', component: () => import('@/views/tables/exportable-table.vue') },
    //         { path: 'table2image', title: '表格转图片', name: 'table-to-image', icon: 'images', component: () => import('@/views/tables/table-to-image.vue') }
    //     ]
    // },
    // {
    //     path: '/advanced-router',
    //     icon: 'ios-infinite',
    //     name: 'advanced-router',
    //     title: '高级路由',
    //     component: Main,
    //     children: [
    //         { path: 'mutative-router', title: '动态路由', name: 'mutative-router', icon: 'link', component: () => import('@/views/advanced-router/mutative-router.vue') },
    //         { path: 'argument-page', title: '带参页面', name: 'argument-page', icon: 'android-send', component: () => import('@/views/advanced-router/argument-page.vue') }
    //     ]
    // },
    // {
    //     path: '/error-page',
    //     icon: 'android-sad',
    //     title: '错误页面',
    //     name: 'errorpage',
    //     component: Main,
    //     children: [
    //         { path: 'index', title: '错误页面', name: 'errorpage_index', component: () => import('@/views/error-page/error-page.vue') }
    //     ]
    // }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    preview,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];