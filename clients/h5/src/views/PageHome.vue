<template>
  <div class="page-manage">
    管理页面
    <div
      @click="getOrgList"
      class="test center"
      xixi="fdsf"
    >xixi</div>
  </div>
</template>

<script>
// import commonAPI from '../api/common';
export default {
  name: 'PageManage',
  data() {
    return {
      data: {},
      name: ''
    };
  },
  mounted() {
    this.getOrgList();
  },
  methods: {
    async getOrgList() {
      // const result = await commonAPI.orgList('mt_test');
      // const result1 = await commonAPI.users();
    }
  }
};
</script>

<style lang="less" scoped>
.test {
  color: @color-primary;
  width: 375px;
  background: pink;
}
</style>
