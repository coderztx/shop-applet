<template>
  <view>
    <!-- 搜索框 开始 -->
    <searchInput></searchInput>
    <!-- 搜索框 结束 -->

    <!-- 轮播图 开始 -->
    <swiper class="swiper" indicator-dots autoplay circular>
      <swiper-item
        v-for="(item, index) in swiperList"
        :key="index"
        @click="handleClickSwiper(index)"
      >
        <image :src="item.image_src" mode="widthFix" />
      </swiper-item>
    </swiper>
    <!-- 轮播图 结束-->

    <!-- 导航栏 开始 -->
    <view class="nav">
      <navigator
        class="nav-item"
        v-for="(item, index) in navList"
        :key="index"
        open-type="switchTab"
        url="/pages/category/category"
      >
        <image :src="item.image_src" mode="widthFix" />
      </navigator>
    </view>
    <!-- 导航栏 结束 -->

    <!-- 楼层 开始 -->
    <view class="floor">
      <view class="floor-item" v-for="(item, index) in floorList" :key="index">
        <view class="title-area">
          <image :src="item.floor_title.image_src" mode="widthFix" />
        </view>
        <view class="pics">
          <view
            class="pic-item"
            v-for="(item2, index2) in item.product_list"
            :key="index2"
          >
            <image :src="item2.image_src" />
          </view>
        </view>
      </view>
    </view>
    <!-- 楼层 结束 -->
  </view>
</template>

<script>
import regeneratorRuntime from "../../lib/runtime/runtime";
import searchInput from "../../components/searchInput/searchInput.vue";
export default {
  components: { searchInput },
  data: () => ({
    swiperList: [],
    navList: [],
    floorList: [],
  }),
  computed: {},
  methods: {
    async getSwipeerList() {
      const res = await this.request({ url: "/home/swiperdata" });
      this.swiperList = res;
    },
    async getNavList() {
      const res = await this.request({ url: "/home/catitems" });
      this.navList = res;
    },
    async getFloorList() {
      const res = await this.request({ url: "/home/floordata" });
      this.floorList = res;
    },
    handleClickSwiper(index) {
      uni.navigateTo({
        url: `/pages/goods_detail/goods_detail?goods_id=${this.swiperList[index].goods_id}`,
      });
    },
  },

  // 页面周期函数--监听页面加载
  onLoad() {
    this.getSwipeerList();
    this.getNavList();
    this.getFloorList();
  },

  // 页面周期函数--监听页面初次渲染完成
  onReady() {},
  // 页面周期函数--监听页面显示(not-nvue)
  onShow() {},
  // 页面周期函数--监听页面隐藏
  onHide() {},
  // 页面周期函数--监听页面卸载
  onUnload() {},
  // 页面处理函数--监听用户下拉动作
  onPullDownRefresh() {
    uni.stopPullDownRefresh();
  },
  // 页面处理函数--监听用户上拉触底
  onReachBottom() {},
  // 页面处理函数--监听页面滚动(not-nvue)
  /* onPageScroll(event) {}, */
  // 页面处理函数--用户点击右上角分享
  /* onShareAppMessage(options) {}, */
};
</script>

<style lang="scss" scoped>
.swiper {
  height: 341rpx;
  image {
    height: 100%;
  }
}

.nav {
  display: flex;
  .nav-item {
    flex: 1;
    padding: 30rpx 30rpx 10rpx 30rpx;
  }
}

.floor {
  padding: 10rpx;
  .floor-item {
    padding: 20rpx;
    height: 430rpx;
    overflow: hidden;
    .title-area {
      image {
        width: 100vw;
        height: 60rpx;
      }
    }

    .pics {
      overflow: hidden;
      .pic-item {
        width: 33.3%;
        border: 5rpx solid #fff;
        float: left;
      }
    }
  }
}

.pics .pic-item:nth-last-child(-n + 4) image {
  height: 180rpx;
}
</style>
