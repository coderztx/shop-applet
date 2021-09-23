<template>
  <view class="container">
    <!-- 有 userInfo 的界面-->
    <view class="user-info-wrap">
      <view class="user-img-warp" v-if="userInfo.nickName">
        <image class="bg-img" :src="userInfo.avatarUrl" mode="aspectFill" />
        <view class="user-info">
          <image
            class="little-img"
            :src="userInfo.avatarUrl"
            mode="aspectFill"
          />
          <view class="user-name">{{ userInfo.nickName }}</view>
        </view>
      </view>
      <!-- 没有登录的界面 -->
      <view class="user-btn" v-else>
        <view class="bg">
          <button size="mini" type="primary" @click="handleClick">登录</button>
        </view>
      </view>
    </view>
    <view class="content-wrap">
      <view class="list-area">
        <!-- 收藏区域 -->
        <view class="collect-list">
          <view class="collect-item">
            <view class="num">0</view>
            <view class="name">收藏的店铺</view>
          </view>
          <navigator class="collect-item" url="/pages/collect/collect">
            <view class="num">{{collectNum}}</view>
            <view class="name">收藏的商品</view>
          </navigator>
          <view class="collect-item">
            <view class="num">0</view>
            <view class="name">关注的商品</view>
          </view>
          <view class="collect-item">
            <view class="num">0</view>
            <view class="name">我的足迹</view>
          </view>
        </view>
        <!-- 我的订单 -->
        <view class="my-order">
          <view class="tile">我的订单</view>
          <view class="content">
            <view class="content-item">
              <view class="iconfont icon-ding_dan"></view>
              <view class="text">全部订单</view>
            </view>
            <view class="content-item">
              <view class="iconfont icon-fukuantongzhi"></view>
              <view class="text">待付款</view>
            </view>
            <view class="content-item">
              <view class="iconfont icon-receipt-address"></view>
              <view class="text">待收货</view>
            </view>
            <view class="content-item">
              <view class="iconfont icon-tuihuotuikuan_dianpu"></view>
              <view class="text">退款/退货</view>
            </view>
          </view>
        </view>
        <!-- 收货地址管理 -->
        <view class="address">收货地址管理</view>
        <!-- 其他 列表项 -->
        <view class="kefu">
          <view class="left">联系客服</view>
          <view class="right">400-618-4000</view>
        </view>
        <view class="yijian">意见反馈</view>
        <view class="about">关于我们</view>
        <view class="tuijian">推荐应用给其他人</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  data: () => ({
    userInfo: {},
    collectNum: 0,
  }),
  computed: {},
  methods: {
    handleClick() {
      uni.navigateTo({
        url: "/pages/auth/auth",
      });
    },
  },

  // 页面周期函数--监听页面加载
  onShow() {
    this.userInfo = uni.getStorageSync("userInfo");
    // 获取收藏数量
    this.collectNum = uni.getStorageSync("collectedList").length;
  },
};
</script>

<style lang="scss" scoped>
.user-info-wrap {
  .user-img-warp {
    position: relative;

    .bg-img {
      height: 450rpx;
      filter: blur(10px);
    }

    .user-info {
      width: 200rpx;
      height: 200rpx;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;

      .little-img {
        width: 200rpx;
        height: 200rpx;
        border-radius: 50%;
      }

      .user-name {
        text-align: center;
      }
    }
  }

  .user-btn {
    .bg {
      background-color: $color;
      height: 450rpx;
      display: flex;

      button {
        width: 150rpx;
        height: 60rpx;
        margin: auto;
        line-height: 60rpx;
      }
    }
  }
}
.container {
  background-color: #eee;
  height: 100vh;
}

.content-wrap {
  font-size: 28rpx;
  .list-area {
    margin: 0 auto;
    width: 93%;
    position: relative;
    top: -25px;
    .collect-list {
      display: flex;
      background-color: #fff;
      text-align: center;
      border-radius: 5px;
      font-size: 24rpx;

      .collect-item {
        flex: 1;
        padding: 20rpx;
        .num {
          font-size: 30rpx;
          color: $color;
        }
      }
    }
    .my-order {
      background-color: #fff;
      border-radius: 5px;

      .tile {
        border-bottom: 1px solid #ccc;
        padding: 20rpx;
        margin-top: 20rpx;
      }

      .content {
        display: flex;
        text-align: center;
        padding: 10rpx;
        .content-item {
          flex: 1;
          .iconfont {
            color: $color;
            font-size: 40rpx;
          }

          .text {
            margin-top: 7px;
          }
        }
      }
    }

    .address {
      padding: 20rpx;
      margin-top: 20rpx;
      background-color: #fff;
      border-radius: 5px;
    }

    .kefu {
      padding: 20rpx;
      margin-top: 20rpx;
      background-color: #fff;
      border-radius: 5px;
      display: flex;
      justify-content: space-between;
    }

    .yijian {
      padding: 20rpx;
      background-color: #fff;
      border-radius: 5px;
      margin-top: 5rpx;
    }

    .about {
      padding: 20rpx;
      background-color: #fff;
      border-radius: 5px;
      margin-top: 5rpx;
    }

    .tuijian {
      padding: 20rpx;
      background-color: #fff;
      border-radius: 5px;
      margin-top: 20rpx;
    }
  }
}
</style>
