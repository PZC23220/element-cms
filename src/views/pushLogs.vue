<template lang="html">
    <div>
        <!-- 筛选区域 -->
        <el-form label-width="80px" :inline="true">
          <el-form-item label="推送id">
            <el-input v-model="form.id"></el-input>
          </el-form-item>
          <el-form-item label="推送类型" v-model="form.pushType">
            <el-select v-model="form.pushType" clearable placeholder="推送类型" @change="selectPushtype('',form.pushType)">
              <el-option label="手动推送" value="1"></el-option>
              <el-option label="自动推送" value="0"></el-option>
            </el-select>
        </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="selectPushtype(form.id,'')">查询</el-button>
          </el-form-item>
        </el-form>

        <!-- table -->
        <el-table :data="pushlogList" stripe border style="width: 100%">
          <el-table-column label="编号" width="200">
            <template scope="scope">
              <span size="small">{{scope.$index}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="aid" label="推送ID"></el-table-column>
          <el-table-column prop="pushTime" label="推送时间"></el-table-column>
          <el-table-column prop="platform" label="推送平台"></el-table-column>
          <el-table-column prop="pushtitle" label="推送标题"></el-table-column>
          <el-table-column prop="pushbody" label="推送内容"></el-table-column>
          <el-table-column prop="app_platform" label="推送app"></el-table-column>
          <el-table-column label="推送类型">
            <template scope="scope">
              <span class="pushtype">{{transformPush_id(scope.row.pushType)}}</span>
            </template>
          </el-table-column>
        </el-table>

    </div>
</template>


<script>
import http from 'U/http.js';
import axios from 'axios';
export default {
    data(){
        return {
            form: {
                id: '',
                pushType: ''
            },
            pushlogList: []
        }
    },
    methods:{
        onSubmit: function(){
            console.log(this.form);
            console.log('submit');
        },
        selectPushtype: function(aid,pushtype) {
            var self = this;
            http.get('/push_log_news',{
                params: {
                    aid: aid,
                    pushType: pushtype
                }
             }).then(function(res){
                self.loading = false;
                self.pushlogList = res;
                console.log(self.pushlogList)
            });
        },
          transformPush_id: function(pushtype){
              var self = this;
              var newMap = {};
              switch(pushtype) {
                  case 0:
                      newMap[pushtype] = "自动推送";
                      break;
                  case 1:
                      newMap[pushtype] = "手动推送";
                      break;
                  case 2:
                      newMap[pushtype] = "推荐推送";
                      break;
              }
              return newMap[pushtype];
          }
    },
    created: function(){
        var self = this;
        http.get('/push_log').then(function(res){
            self.loading = false;
            self.pushlogList = res;
            console.log(self.pushlogList)
        });
    }
}
</script>

<style lang="css">
</style>
