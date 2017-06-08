<template lang="html">
    <div class="main">
      <div style="padding-bottom: 20px;padding-left: 20px;border-bottom: 1px solid #8492a6;margin-bottom: 20px;"><i class="el-icon-close" @click="goBack()"></i></div>
      <div style="float:left;width:51%;padding-right: 2%;border-right: 1px #ddd solid;"> 
        <h3>已发表评论</h3>
        <el-form label-position="left" label-width="60px">
          <el-form-item label="" v-for="(value,key) in havedCommentList">
            <img :src="value.portrait" alt="">
            <el-input type="textarea" :rows="3" :value="value.content"></el-input>
            <el-button type="danger" style="float: left;margin-right:10px;" @click="deleteComment(value.id)">删除评论</el-button>
            <div class="floorOperation">
              <el-input placeholder="赞同数" style="margin-bottom:10px;" :value="value.likes"></el-input>
              <el-button type="info" @click="tottleFloor(value.id)">添加楼层</el-button>
            </div>
            <div class="floor" v-show="isShow == value.id">
              <img style="margin-right:10px" :src="selectUser[key].user.portrait" alt="">
              <el-select placeholder="请选择" v-model="form.category_value" clearable @change="">
                <el-option v-for="item in userList" :value="item.id" :label="item.nickname"></el-option>
              </el-select>
              <el-input type="textarea" :rows="3" style="width: calc(100% - 280px)"  v-model="selectUser[key].content"></el-input>
              <el-button type="info" @click="addComment(value.id)">提交回复</el-button>
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="padding-left: 60px;padding-bottom: 20px;">
          <el-button type="primary">发  布</el-button>
        </div>
      </div>


      <div style="float:left;width:45%;padding-left: 1.8%;">
        <h3>创建/扒取评论</h3>
        <p>原评论链接：<a :href="getSourceLinks">{{getSourceLinks}}</a></p>
        <el-form class="pullComment" label-position="left" label-width="60px">
          <el-form-item label="" v-for="(value,key) in pullCommentList" v-if="key < 3">
            <img :src="value.user.portrait" alt="">
            <el-input type="textarea" :rows="3" style="width: calc(100% - 150px)" v-model="value.content"></el-input>
            <el-input placeholder="赞同数" class="addLikes" v-model="value.likes"></el-input>
          </el-form-item>
          <el-form-item label="" v-for="(value,key) in newCommentList">
            <img :src="value.user.portrait" alt="">
            <el-input type="textarea" :rows="3" style="width: calc(100% - 150px)" v-model="value.content"></el-input>
            <el-input placeholder="赞同数" class="addLikes" v-model="value.likes"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="padding-left: 60px;padding-bottom: 20px;">
          <el-button type="primary" @click="addComment()">发  布</el-button>
          <!-- <el-button type="primary" @click="createComment()">添加更多</el-button> -->
        </div>
      </div>
    </div>
</template>
<script>

import http from 'U/http.js';
import axios from 'axios';
export default {
    data() {
        return {
            options: [],
            userList: [],
            dialogVideoSrc: '',
            videoTitle: '',
            current: 0,
            newsInfo: {},
            isShow: false,
            selectUser: [],
            newCommentList: [{
                user: {},
                content: '',
                likes: ''
            },{
                user: {},
                content: '',
                likes: ''
            },{
                user: {},
                content: '',
                likes: ''
            }
            ],
            form: {
                news_id: '',
                comment_num: '',
                news_title: '',
                category_value: ''
            },
            havedCommentList: [],
            pullCommentList: [],
            getSourceLinks: '无'
            };
        },
        methods: {
          goBack() {
              window.history.back();location.reload();
          },
          tottleFloor(val) {
            this.isShow = val;
          },
          // 点击推送
          addComment: function(reference){
            var self = this;
            if(reference) {
              self.selectUser.forEach(function(item){
                self.addPost(item,reference);
              });
            } else {
              self.newCommentList.forEach(function(item){
                self.addPost(item);
              });
            }
          },
          addPost: function(item,reference) {
            console.log(item);
            var self = this;
            if(item.content != "") { 
              var userBean = {
                  'id': item.user.id,
                  'userid': item.user.userid,
                  'nickname': item.user.nickname,
                  'portrait': item.user.portrait,
                  'platform': item.user.platform

              };
              var postBean = {
                  'aid': self.newsInfo.aid,
                  'atime': self.newsInfo.public_time,
                  'cid': self.newsInfo.category_id,
                  'uid':item.user.id,
                  'content': item.content,
                  'likes': item.likes,
                  'nickname': item.user.nickname,
                  'portrait': item.user.portrait,
                  'title': self.newsInfo.title,
                  'url': self.newsInfo.url,
                  'imgUrl': self.newsInfo.imgs
              };
              if(reference) {
                postBean.reference = reference
              }
              var dataParams = {
                  'user': userBean,
                  'post': postBean
              }
              console.log(JSON.stringify(dataParams));
              http.post('/japi/post/save', JSON.stringify(dataParams)).then(function(res){
                  self.editDialogVisible = false;
                  if(res.status == 200){
                      self.$message({
                        message: '发表评论成功',
                        type: 'success'
                      });
                      window.location.reload();
                  }else{
                      self.$message.error('发表评论失败');
                  }
              });
            }
          },
          deleteComment: function(val) {
            var self = this;
            http.get('/del_comments', {
                params:{
                    id: val
                }
            }).then(function(res){
                self.$message({
                  message: '删除评论成功',
                  type: 'success'
                });
            });
          }
        },
        created: function(){
          var self = this;
          function GetQueryString(name) {
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
                var r = window.location.hash.split("?")[1].match(reg);
                if(r!=null)return  unescape(r[2]); return null;
          }
          self.newsInfo.title = GetQueryString("title");
          self.newsInfo.public_time = GetQueryString("public_time");
          self.newsInfo.aid = GetQueryString("aid");
          self.newsInfo.url = GetQueryString("url");
          self.newsInfo.imgs = GetQueryString("imgs");
          self.newsInfo.category_id = GetQueryString("category_id");
          axios.all([http.get('/get_comments',{
            params: {
                aid: GetQueryString("aid")
            }
          }), http.get('/get_sourceLinks',{
            params: {
                aid: GetQueryString("aid")
            }
          }), http.get('/japi/post/list',{
            params: {
                aid: GetQueryString("aid")
            }
          }), http.get('/get_username')])
            .then(axios.spread(function(res1, res2, res3, res4){
                self.pullCommentList = res1;
                if(self.pullCommentList.length > 0) {
                  self.pullCommentList.forEach(function(item){
                    item.user = res4[parseInt(Math.random() * res4.length - 1)];
                  })
                }
                if(res2[0]) {
                    self.getSourceLinks = res2[0].url;
                }
                self.havedCommentList = res3.data.posts;
                self.userList = res4;
                // self.selectUser = [res4[parseInt(Math.random() * res4.length - 1)],res4[parseInt(Math.random() * res4.length - 1)],res4[parseInt(Math.random() * res4.length - 1)]];
                for(var i=0;i<3;i++) {
                  self.newCommentList[i].user = res4[parseInt(Math.random() * res4.length - 1)];
                }
                for(var j=0;j<self.havedCommentList.length;j++) {
                  var obj = {
                      user: res4[parseInt(Math.random() * res4.length - 1)],
                      content: '',
                      likes: 0
                    }
                  self.selectUser.push(obj);
                }
            }));
    }
}
</script>

<style lang="css" scoped>
    .el-form img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      float: left;
    }
    h3 {
      margin-bottom: 20px;
    }
    .el-form-item__content{
      margin-left: 0 !important;
      overflow: hidden;
    }
    .el-form .el-textarea {
      float: left;
      width: calc(100% - 250px);
      margin-right: 10px;
      margin-left: 10px;
    }
    .floorOperation,.el-form .el-select,.addLikes.el-input {
        float: left;
        width: 88px;
    }
    .floor {
        overflow: hidden;
        width: 100%;
        padding-left: 30px;
        padding-top: 20px;
    }
    .el-icon-close {
      font-size: 26px;
      color: #8492a6;
      cursor: pointer;
    }
</style>
