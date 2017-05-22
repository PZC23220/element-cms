<template lang="html">
<article class="">
    <!-- 表单 -->
    <el-form :inline="true" :model="formInline">
        <el-form-item label="新闻id">
          <el-input v-model="formInline.newsId" placeholder="新闻id"></el-input>
        </el-form-item>
        <el-form-item label="推送类型">
            <el-select v-model="formInline.pushType" placeholder="推送类型">
              <el-option label="不限" value="all"></el-option>
              <el-option label="人工推送" value="manual"></el-option>
              <el-option label="自动推送" value="auto"></el-option>
            </el-select>
        </el-form-item>
        </el-form-item>
          <el-button type="primary" icon="search" @click="onSubmit">查询</el-button>
        </el-form-item>
    </el-form>
    <!-- table -->
    <el-table style="width: 100%;" :data="tableData" :stripe="true">
        <el-table-column prop="num" label="编号" width="100"></el-table-column>
        <el-table-column prop="id" label="新闻id" width="100"></el-table-column>
        <el-table-column prop="date" label="推送时间" width="150"></el-table-column>
        <el-table-column prop="type" label="推送类型" width="100"></el-table-column>
        <el-table-column prop="platform" label="推送平台" width="100"></el-table-column>
        <el-table-column prop="title" label="推送标题" width="300"></el-table-column>
        <el-table-column prop="description" label="推送内容" width=""></el-table-column>
    </el-table-column>

    </el-table>

</article>
</template>

<script>
export default {
    data(){
        return {
            formInline: {
                newsId: '',
                pushType: ''
            },
            tableData: [{
                num: 1,
                id: 825853182,
                date: '2017/4/25 15:04',
                type: '人工',
                platform: 'ios',
                title: '【NewsJet昼のニュース】',
                description: '今村復興相を更迭へ、政権に打撃　大震災「東北で良かった」'
            }
            ]
        }
    },
    methods:{
        onSubmit: function(){
            console.log(this.formInline);
            console.log('submit');
        }
    },
    created: function(){
        console.log('xixi');
    }
}
</script>

<style lang="css">
</style>
