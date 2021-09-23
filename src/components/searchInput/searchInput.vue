<template>
  <view class="btn-area">
    <navigator class="search-input" url="/pages/search/search">
      搜索
    </navigator>
  </view>
</template>

<script>
export default {
  props: {},
  data: () => ({}),
  computed: {},
  methods: {},
  watch: {},

  // 组件周期函数--监听组件挂载完毕
  mounted() {},
  // 组件周期函数--监听组件数据更新之前
  beforeUpdate() {},
  // 组件周期函数--监听组件数据更新之后
  updated() {},
  // 组件周期函数--监听组件激活(显示)
  activated() {},
  // 组件周期函数--监听组件停用(隐藏)
  deactivated() {},
  // 组件周期函数--监听组件销毁之前
  beforeDestroy() {},
};
</script>

<style lang="scss" scoped>
.btn-area {
  background-color: $color;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  .search-input {
    border: 1px solid #ddd;
    width: 97%;
    border-radius: 5px;
    color: #666;
    background-color: #fff;
    padding: 5px;
    text-align: center;
  }
}
</style>
