<template>
  <view>
    <!-- 搜素框 开始 -->
    <search-input></search-input>
    <!-- 搜素框 结束 -->

    <!-- 分段器 开始 -->
    <uni-segmented-control
      :current="current"
      :values="items.map((v) => v.title)"
      @clickItem="onClickItem"
      styleType="text"
      activeColor="#eb4450"
    ></uni-segmented-control>
    <!-- 分段器 结束 -->

    <!-- 商品内容 开始 -->
    <view class="content">
      <view v-if="current === 0">
        <scroll-view class="goods-list" scroll-y @scrolltolower="handleTolower">
          <navigator
            class="goods-item"
            v-for="(item, index) in goodsList"
            :key="index"
            :url="`/pages/goods_detail/goods_detail?goods_id=${item.goods_id}`"
          >
            <view class="left">
              <image :src="item.goods_small_logo" mode="aspectFill" />
            </view>
            <view class="right">
              <text>{{ item.goods_name }}</text>
              <view class="price">¥ {{ item.goods_price }}</view>
            </view>
          </navigator>
        </scroll-view>
      </view>

      <view v-if="current === 1"> 选项卡2的内容 </view>
      <view v-if="current === 2"> 选项卡3的内容 </view>
    </view>
    <!-- 商品内容 结束 -->
  </view>
</template>

<script>
import regeneratorRuntime from "../../lib/runtime/runtime";
import { uniSegmentedControl } from "@dcloudio/uni-ui";
import searchInput from "../../components/searchInput/searchInput.vue";
export default {
  components: { searchInput, uniSegmentedControl },
  data: () => ({
    params: {
      cid: "",
      query: "",
      pagenum: 1,
      pagesize: 10,
    },
    items: [{ title: "综合" }, { title: "销量" }, { title: "价格" }],
    current: 0,
    goodsList: [],
  }),
  computed: {},
  methods: {
    onClickItem(e) {
      if (this.current !== e.currentIndex) {
        this.current = e.currentIndex;
      }
    },
    async getList() {
      const res = await this.request({
        url: "/goods/search",
        data: this.params,
      });
      if (res.goods.length === 0) {
        uni.showToast({
          title: "没有更多了",
          icon: "none",
        });
        return;
      }
      console.log(res);
      this.goodsList = [...this.goodsList, ...res.goods];
    },
    handleTolower() {
      this.params.pagenum++;
      this.getList();
    },
  },
  // 页面周期函数--监听页面加载
  onLoad(options) {
    this.params.cid = options.cid;
    this.getList();
  },

  // 页面处理函数--监听用户下拉动作
  onPullDownRefresh() {
    uni.stopPullDownRefresh();
  },
  // 页面处理函数--监听用户上拉触底
  onReachBottom() {},
};
</script>

<style lang="scss" scoped>
.goods-list {
  padding: 20rpx;
  height: calc(100vh - 90px);
  .goods-item {
    display: flex;
    border-bottom: 1px solid #ddd;
    .left {
      flex: 1;
      image {
        height: 220rpx;
      }
    }

    .right {
      flex: 2;
      padding: 30rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text {
        font-size: 30rpx;
      }

      .price {
        margin-top: 20rpx;
        color: $color;
      }
    }
  }
}
</style>
