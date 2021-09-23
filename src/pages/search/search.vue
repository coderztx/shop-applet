// 防抖的实现
// 定义全局定时器
<template>
  <view>
    <van-search
      placeholder="请输入搜索关键词"
      show-action
      shape="round"
      background="#eb4450"
      @change="onChange"
    />
    <van-cell-group>
      <van-cell
        :title="item.goods_name"
        border
        v-for="(item, index) in goodsDetail"
        :key="index"
        @click="handleClick(index)"
      />
    </van-cell-group>
  </view>
</template>

<script>
export default {
  components: {},
  data: () => ({
    goodsDetail: [],
    timeId: -1,
  }),
  computed: {},
  methods: {
    onChange(e) {
      let query = e.detail;
      // 内容不合法
      if (!query.trim()) {
        return;
      }
      // 实现防抖
      clearTimeout(this.timeId);
      this.timeId = setTimeout(() => {
        this.getList(query);
      }, 1000);
    },
    async getList(query) {
      const goodsDetail = await this.request({
        url: "/goods/qsearch",
        data: { query: query },
      });
      console.log(goodsDetail);
      this.goodsDetail = goodsDetail;
    },
    handleClick(index) {
      uni.navigateTo({
        url: `/pages/goods_detail/goods_detail?goods_id=${this.goodsDetail[index].goods_id}`,
      });
    },
  },
};
</script>

<style>
</style>
