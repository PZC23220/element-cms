<template lang="html">
    <div>
        <nav class="sidebar-wrapper">
            <el-menu default-active="2" class="el-menu-vertical-demo" theme="light" :router="true">
              <el-menu-item index="news">新闻列表</el-menu-item>
              <el-menu-item index="videos">视频列表</el-menu-item>
              <el-menu-item index="pushLogs">推送日志</el-menu-item>
              <el-menu-item index="activityComment">活动评论</el-menu-item>
              <el-menu-item index="splash">闪屏配置页</el-menu-item>
              <el-menu-item index="activity">APP活动配置页</el-menu-item>
              <el-menu-item index="newsUpload">新闻上传</el-menu-item>
              <el-menu-item index="comment">评论自动化</el-menu-item>
              <el-menu-item index="column">栏目优化</el-menu-item>
              <el-menu-item index="matchlist">比赛列表</el-menu-item>
              <el-menu-item index="topics">专题配置页</el-menu-item>
              <el-menu-item index="tabs">Tab配置页</el-menu-item>
              <el-menu-item index="gif">GIF配置页</el-menu-item>
            </el-menu>
        </nav>
      <div class="content">
          <router-view></router-view>
      </div>
    </div>
</template>

<script>
export default {
}
</script>

<style lang="css">
</style>
