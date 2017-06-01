<template lang="html">
    <div class="main">
    <template>
      <el-select v-model="value" clearable  placeholder="请选择GIF状态" @change="selectGif(value)">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </template>
    <template :data="gifList" :stripe="true" v-loading.body="loading" max-height="550">
	    <ul class="gif-ul">
	        <li v-for="(value,key) in gifList">
		        <img :src="value.url" :alt="key"  class="gif-img" @click="handleImg(value.url)">
		        <div class="opa-radio">
                    <el-radio-group v-model="value.status" @change="clickHandleUPdateGIF(value.status,value.aid)">
					  <el-radio class="radio" :label="1">通过</el-radio>
					  <el-radio class="radio" :label="0">不通过</el-radio>
                  </el-radio-group>
		        </div>

		    </li>
	    </ul>
    </template>
    <div class="block">
  <el-pagination
    layout="prev, pager, next"
    :page-size="50"
    :current-page="currentPage"
    @current-change="handleCurrentChange"
    :total="5000">
  </el-pagination>
</div>
    <el-dialog title="图片预览" size="small" v-model="dialogVisible" custom-class="dialog-img">
      <img :src="dialogImgSrc" alt="">
    </el-dialog>
    </div>
</template>

<script>
import http from 'U/http.js';
import axios from 'axios';

export default {
    data (){
        return {
            loading: false, // 是否显示loading
            dialogVisible: false, // 是否显示大图预览dialog
            editDialogVisible: false, // 是否显示修改分类dialog
            dialogImgSrc: "",   // 点击的大图src
            pageNum: 50,
            currentPage: 1,
            girlsCategory: '', // 操作，点击girl的当前分类
            girlsId: '', // 操作，点击girl的id
            gifList: [],
            options: [{
                value: 0,
                label: "不通过"
            },{
                value: 1,
                label: "通过"
            }],
            value: "",
        }
    },
    methods:{
        // 修改GIF状态
        clickHandleUPdateGIF(status,aid) {
        	console.log(status,aid);
            var self = this;
            self.loading = true;
            http.get('/update_gif', {
                params:{
                    status: status,
                    aid: aid
                }
            }).then(function(res){
                self.loading = false;
                self.$message({
                  message: '修改GIF状态成功',
                  type: 'success'
                });
                // 刷新当前页面数据
                // self.handleCurrentChange(self.currentPage);
            });
        },
        // 获取指定状态的GIF
        selectGif(value) {
            console.log(value);
            var self = this;
            http.get('/select_gif', {
                params:{
                    start: 0,
                    status: value
                }
            }).then(function(res){
                self.loading = false;
                self.gifList = res;
                self.currentPage = 1;
            });
        },
        // 点击分页器页数
        handleCurrentChange(val) {
            var self = this;
            self.loading = true;
            self.currentPage = val;
            http.get('/select_gif', {
                params:{
                    start: (val-1)*50,
                    status: self.value
                }
            }).then(function(res){
                self.loading = false;
                self.gifList = res;
            });
        },
        // 点击图片预览
        handleImg: function(params){
            console.log(params);
            var self = this;
            self.dialogVisible = true;
            self.dialogImgSrc = params;
        }
    },
    created: function(){
        var self = this;
        http.get('/select_gif?start=0').then(function(res){
            self.gifList = res;
        });
    }
}
</script>

<style lang="css">
.main{
    margin: 20px;
}
ul,li {
	list-style: none;
	overflow: hidden;
    margin: 0;
    padding: 0;
}
.gif-ul {
	max-height: 70vh;
	overflow: auto;
}
.gif-ul li {
	float: left;
	margin-bottom: 20px;
    margin-right: 20px;
}
.ui-img{
    height: 50px;
}
.gif-img{
    width: 300px;
    height: 300px;
    margin-bottom: 5px;
}
.dialog-img{
    width: auto !important;
}
.block{
    text-align: right;
    margin-top: 20px;
}
.v-modal {
	display: none;
}
.el-select {
    margin-bottom: 10px;
}

</style>
