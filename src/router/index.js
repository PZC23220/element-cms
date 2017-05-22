import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import news from '../views/news.vue';
import videos from '../views/videos.vue';
import pushLogs from '../views/pushLogs.vue';
import activityComment from '../views/activityComment.vue';
import splash from '../views/splash.vue';
import activity from '../views/activity.vue';
import newsUpload from '../views/newsUpload.vue';
import comment from '../views/comment.vue';
import column from '../views/column.vue';
import matchlist from '../views/matchlist.vue';
import topics from '../views/topics.vue';
import tabs from '../views/tabs.vue';
import newsjet from '../views/newsjet.vue';
import girls from '../views/girls/index.vue';

export default new VueRouter({
    mode: 'hash',
    routes: [
        {
            path: '/',
            redirect: '/newsjet'
        },{
            path: '/newsjet',
            component: newsjet,
            children: [
                {path: '', redirect: 'news'},
                {path: 'news', component: news},
                {path: 'videos', component: videos},
                {path: 'pushLogs', component: pushLogs},
                {path: 'activityComment', component: activityComment},
                {path: 'splash', component: splash},
                {path: 'newsUpload', component: newsUpload},
                {path: 'activity', component: activity},
                {path: 'comment', component: comment},
                {path: 'column', component: column},
                {path: 'matchlist', component: matchlist},
                {path: 'topics', component: topics},
                {path: 'tabs', component: tabs}
            ]
        },{
            path: '/girls',
            component: girls
        }
    ]
})
