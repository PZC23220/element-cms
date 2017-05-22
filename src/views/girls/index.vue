<template lang="html">
    <div class="main">
        <!-- table -->
        <el-table style="width: 100%;" :data="girlsList" :stripe="true" v-loading.body="loading" max-height="550">
            <el-table-column label="id" width="100" prop="id"></el-table-column>
            <el-table-column label="预览" prop="">
                <template scope="scope">
                    <img :src="value.thumbnail" :alt="key" v-for="(value,key) in scope.row.img" class="thumbnail-img" @click="handleImg(value.thumbnail)" v-if="key < 3">
                </template>
            </el-table-column>
            <el-table-column label="分类" width=200>
                <template scope="scope">
                    <span>{{transformCid(scope.row.cid)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                  <el-button size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                  <el-button size="small" @click="handlePush(scope.$index, scope.row)">推送</el-button>
                  <el-button size="small" @click="handleEditCategory(scope.$index, scope.row)">修改分类</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="block">
          <el-pagination @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="pageNum"
                        layout="sizes, prev, pager, next"
                        :total="total">
          </el-pagination>
        </div>

        <el-dialog title="图片预览" size="small" v-model="dialogVisible" custom-class="dialog-img">
          <img :src="dialogImgSrc" alt="">
        </el-dialog>

        <el-dialog title="修改分类" size="tiny" v-model="editDialogVisible">
            <el-select placeholder="请选择分类" v-model="girlsCategory">
                <el-option v-for="item in cidMap" :value="item.cid" :label="item.name_cn" :key="item.cid">
                </el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="clickHandleEditDialog">确 定</el-button>
            </span>
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
            cidMap: "",
            total: '', // 列表总页数
            pageNum: 10,
            currentPage: 1,
            girlsCategory: '', // 操作，点击girl的当前分类
            girlsId: '', // 操作，点击girl的id
            girlsList: [{
                id: null,
                cid: '',
                img:[]
            }]
        }
    },
    computed: {

    },
    methods:{
        // 点击删除
        handleDel: function(index, row){
            var self = this;
            self.$confirm('此图集将会被删除，是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            }).then(() => {
                http.post('/api/girls/delete',{
                    id: row.id
                }).then(function(res){
                    if(res.success){
                        self.$message({
                          message: '删除成功',
                          type: 'success'
                        });
                        // 刷新当前页面数据
                        self.handleCurrentChange(self.currentPage);
                    }else{
                        self.$message.error('删除失败');
                    }
                });
            }).catch(() => {});
        },
        // 点击推送
        handlePush: function(index, row){

        },
        // 点击修改分类
        handleEditCategory: function(index, row){
            console.log(row);
            var self = this;
            self.girlsCategory = row.cid;
            self.girlsId = row.id;
            self.editDialogVisible = true;
        },
        // 修改分类点击确定
        clickHandleEditDialog: function(){
            var self = this;
            http.post('/api/girls/category/edit', {
                id: self.girlsId,
                cid: self.girlsCategory
            }).then(function(res){
                self.editDialogVisible = false;
                if(res.success){
                    self.$message({
                      message: '修改分类成功',
                      type: 'success'
                    });
                    // 刷新当前页面数据
                    self.handleCurrentChange(self.currentPage);
                }else{
                    self.$message.error('修改分类失败');
                }
            });
        },
        change: function(val){
            console.log(val);
        },
        // 修改分页器每页显示数量
        handleSizeChange(val) {
            var self = this;
            self.pageNum = val;
            self.currentPage = 1,
            self.loading = true;
            http.get('/api/girls/list', {
                params:{
                    page: 1,
                    pageNum: self.pageNum
                }
            }).then(function(res){
                self.loading = false;
                self.girlsList = res.data;
            });
        },
        // 点击分页器页数
        handleCurrentChange(val) {
            var self = this;
            self.loading = true;
            self.currentPage = val;
            http.get('/api/girls/list', {
                params:{
                    page: val,
                    pageNum: self.pageNum
                }
            }).then(function(res){
                self.loading = false;
                self.girlsList = res.data;
            });
        },
        // 点击图片预览
        handleImg: function(params){
            console.log(params);
            var self = this;
            self.dialogVisible = true;
            self.dialogImgSrc = params;
        },
        // cid中英文map
        transformCid: function(cid){
            var self = this;
            var newMap = {};
            for(var i = 0, len = self.cidMap.length; i < len; i++){
                newMap[self.cidMap[i]['cid']] = self.cidMap[i]['name_cn'];
            }
            return newMap[cid];
        }
    },
    created: function(){
        var self = this;
        axios.all([http.get('/api/girls/list'), http.get('/api/girls/category')])
            .then(axios.spread(function(res1, res2){
                self.girlsList = res1.data;
                self.total = res1.total;
                self.cidMap = res2;
            }));
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
    /*width: 100px;*/
    height: 100px;
    margin-right: 10px;
}
.dialog-img{
    width: auto !important;
}
.block{
    text-align: right;
    margin-top: 20px;
}

</style>
