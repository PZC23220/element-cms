<template lang="html">
    <div class="main">
        <!-- table -->
        <el-table style="width: 100%;" :data="girlsList" :stripe="true">
            <el-table-column label="id" width="100" prop="id"></el-table-column>
            <el-table-column label="预览" prop="">
                <template scope="scope">
                    <img :src="value.thumbnail" :alt="key" v-for="(value,key) in scope.row.img" class="thumbnail-img" @click="handleImg(value.thumbnail)" v-if="key < 3">
                </template>
            </el-table-column>
            <el-table-column label="分类" prop="cid"></el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                  <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                  <el-button size="small" @click="handlePush(scope.$index, scope.row)">推送</el-button>
                  <el-button size="small" @click="handleEditCategory(scope.$index, scope.row)">修改分类</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="图片预览" size="small" v-model="dialogVisible" custom-class="dialog-img">
          <img :src="dialogImgSrc" alt="">
        </el-dialog>
    </div>
</template>

<script>
import http from 'U/http.js';

export default {
    data (){
        return {
            dialogVisible: false,
            dialogImgSrc: "",
            girlsList: [{
                id: null,
                cid: '',
                img:[]
            }]
        }
    },
    methods:{
        handleEdit: function(index, row){
            console.log('编辑');
            console.log(index, row);
        },
        handlePush: function(index, row){

        },
        handleEditCategory: function(){

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
        http.get('/api/girls/list').then(function(res){
            self.girlsList = res;
        })
    }
}
</script>

<style lang="css">
.main{
    margin: 20px;
}
.ui-img{
    height: 50px;
}
.thumbnail-img{
    width: 100px;
    height: 100px;
}
.dialog-img{
    width: auto !important;
}

</style>
