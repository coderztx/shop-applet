<template>
  <view v-if="leftList.length > 0">
    <!-- 搜索框 开始 -->
    <search-input></search-input>
    <!-- 搜索框 结束 -->
    <view class="container">
      <!-- 左侧区域 开始 -->
      <scroll-view class="left-area" scroll-y>
        <view class="category-name">
          <view
            :class="['name-item', selectedCategory === index ? 'selected' : '']"
            v-for="(item, index) in leftList"
            :key="index"
            @click="handleClick(index)"
          >
            {{ item.cat_name }}
          </view>
        </view>
      </scroll-view>
      <!-- 左侧区域 结束 -->

      <!-- 右侧区域 开始 -->
      <scroll-view class="right-area" scroll-y >
        <view
          class="big-item"
          v-for="(item1, index1) in rightList"
          :key="index1"
        >
          <view class="title">/ {{ item1.cat_name }} /</view>
          <view class="pics-area">
            <navigator
              class="small-item"
              v-for="(item2, index2) in item1.children"
              :key="index2"
              :url="`/pages/goods_list/goods_list?cid=${item2.cat_id}`"
            >
              <image :src="item2.cat_icon" mode="widthFix" />
              <view class="text">{{ item2.cat_name }}</view>
            </navigator>
          </view>
        </view>
      </scroll-view>
      <!-- 右侧区域 结束 -->
    </view>
  </view>
</template>

<script>
import regeneratorRuntime from "../../lib/runtime/runtime";
import searchInput from "../../components/searchInput/searchInput.vue";
export default {
  components: { searchInput },
  data: () => ({
    leftList: [],
    rightList: [],
    selectedCategory: 0,
    Cates: [],
  }),
  computed: {},
  methods: {
    async getList() {
      const res = await this.request({ url: "/categories" });
      // 储存到本地储存中
      uni.setStorageSync("cates", { time: Date.now(), data: res });
      console.log(res);
      // 左侧数据
      this.leftList = res;

      // 右侧数据
      this.rightList = res[this.selectedCategory].children;
    },

    handleClick(index) {
      this.selectedCategory = index;
      this.rightList = this.leftList[this.selectedCategory].children;
    },
  },

  // 页面周期函数--监听页面加载
  onLoad() {
    // 1.先判断一下本地储存中有没有旧数据
    // 2.没有则 发送新请求
    // 3.有 且 未过期 就可以使用本地储存数据
    const Cates = uni.getStorageSync("cates");
    if (!Cates) {
      this.getList();
    } else {
      if (Date.now() - Cates.time > 1000 * 300) {
        this.getList();
      } else {
        this.Cates = Cates.data;
        this.leftList = this.Cates;
        this.rightList = this.Cates[this.selectedCategory].children;
      }
    }
  },

};
</script>

<style lang="scss" scoped>
.selected {
  color: $color;
  border-left: 2px solid $color;
}

.container {
  display: flex;
  .left-area {
    flex: 1;
    height: calc(100vh - 50px);
    background-color: #f4f4f4;
    font-size: 28rpx;
    .category-name {
      .name-item {
        padding: 20rpx 25rpx;
        border-bottom: 1px solid #ddd;
      }
    }
  }

  .right-area {
    flex: 3;
    height: calc(100vh - 50px);
    .big-item {
      margin-top: 20rpx;
      .title {
        font-size: 36rpx;
        text-align: center;
        height: 80rpx;
        line-height: 80rpx;
        color: #333;
      }
      .pics-area {
        display: flex;
        flex-wrap: wrap;
        .small-item {
          width: 33.3%;
          padding: 20rpx;
          .text {
            text-align: center;
            font-size: 26rpx;
          }
        }
      }
    }
  }
}
</style>
