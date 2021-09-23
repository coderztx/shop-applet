<template>
  <view>
    <!-- 轮播图 开始 -->
    <swiper class="swiper" indicator-dots autoplay circular>
      <swiper-item
        v-for="(item, index) in detailObj.pics"
        :key="index"
        @click="handleClick(index)"
      >
        <image :src="item.pics_mid" mode="aspectFit" />
      </swiper-item>
    </swiper>
    <!-- 轮播图 结束 -->

    <!-- 标题区域 开始 -->
    <view class="title-area" v-if="detailObj.goods_price">
      <view class="price">¥ {{ detailObj.goods_price }}</view>
      <view class="name-area">
        <view class="goods-name">{{ detailObj.goods_name }}</view>
        <view class="collect" @click="handleClickCollect">
          <i
            :class="[
              'iconfont',
              iscollected ? 'icon-shoucang1' : 'icon-shoucang',
            ]"
          ></i>
          <view class="text">收藏</view>
        </view>
      </view>
    </view>
    <!-- 标题区域 结束 -->

    <!-- 详情 开始 -->
    <view class="detail" v-if="detailObj.goods_price">
      <view class="title">图文详情</view>
      <view class="html" v-html="detailObj.goods_introduce"> </view>
    </view>
    <!-- 详情 结束 -->

    <!-- 悬浮框 开始 -->
    <view class="tap-area">
      <view class="contact relative">
        <view class="iconfont icon-kefu"></view>
        <view class="text">联系客服</view>
        <button open-type="contact"></button>
      </view>
      <view class="share relative">
        <view class="iconfont icon-yixianshi-"></view>
        <view class="text">分享</view>
        <button open-type="share"></button>
      </view>
      <navigator
        class="cart relative"
        url="/pages/cart/cart"
        open-type="switchTab"
      >
        <view class="iconfont icon-gouwuche"></view>
        <view class="text">购物车</view>
      </navigator>
      <view class="add-cart relative" @click="handleAddCart"> 加入购物车 </view>
      <view class="buy relative"> 立即购买 </view>
    </view>
    <!-- 悬浮框 结束 -->
  </view>
</template>

<script>
// 点击购物车按钮
// 1.先绑定点击事件
// 2.获取缓存中的购物车数据  数组格式
// 3.先判断 当前商品是否存在于 购物车
// 4.已经存在 修改商品数据 执行数量++ 重新把数字填充回缓存中
// 5.不存在 直接给购物车数字添加一个新元素  带上一个数量属性  重新填充到缓存
// 6.弹出提示
// 收藏
// 1.onshow时, 加载缓存中的商品收藏的数据
// 2.判断商品是否被收藏
//  是  改变图标
// 不是  ..
// 3.点击收藏按钮
// 判断商品是否存在于缓存数据中
// 存在 则删除商品
// 不存在  则添加到收藏数组  存入缓存
import regeneratorRuntime from "../../lib/runtime/runtime";
export default {
  components: {},
  data: () => ({
    goodsId: "",
    detailObj: {},
    //是否被收藏
    iscollected: false,
    // 收藏列表
    collectedList: [],
  }),
  methods: {
    async getList() {
      const res = await this.request({
        url: "/goods/detail",
        data: { goods_id: this.goodsId },
      });
      console.log(res);
      this.detailObj = res;
      this.collectedList = uni.getStorageSync("collectedList") || [];
      // some  有一个true 则返回true
      this.iscollected = this.collectedList.some(
        (v) => v.goods_id === this.detailObj.goods_id
      );
    },
    // 点击轮播图 进行图片预览
    handleClick(index) {
      const urls = this.detailObj.pics.map((v) => v.pics_mid);
      uni.previewImage({
        urls: urls,
        current: index,
      });
    },
    // 点击收藏
    handleClickCollect() {
      let index = this.collectedList.findIndex(
        (v) => v.goods_id === this.detailObj.goods_id
      );
      if (index !== -1) {
        // 收藏过了,取消收藏
        this.collectedList.splice(index, 1);
        uni.showToast({
          title: "取消收藏成功",
          icon: "none",
        });
      } else {
        // 没有收藏
        this.collectedList.push(this.detailObj);
        uni.showToast({
          title: "收藏成功",
          icon: "none",
        });
      }
      this.iscollected = !this.iscollected;
      uni.setStorageSync("collectedList", this.collectedList);
    },
    // 点击加入购物车事件
    handleAddCart() {
      // 1.获取缓存中的购物车 数组
      let cart = uni.getStorageSync("cart") || [];
      // 2.判断  商品是否存在于购物车中
      let index = cart.findIndex((v) => v.goods_id === this.detailObj.goods_id);
      if (index === -1) {
        // 3.不存在  第一次添加
        this.detailObj.num = 1;
        this.detailObj.checked = true;
        cart.push(this.detailObj);
      } else {
        // 4.存在  执行 num++
        cart[index].num++;
      }
      // 5.把购物车重新添加回缓存
      uni.setStorageSync("cart", cart);
      // 6.弹窗提示
      uni.showToast({
        title: "加入成功",
        // 防止用户 手抖 一直点击
        mask: true,
      });
    },
  },

  // 页面周期函数--监听页面加载
  onLoad(options) {
    this.goodsId = options.goods_id;
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.swiper {
  height: 400rpx;
  image {
    height: 100%;
  }
}

.title-area {
  padding: 15rpx 50rpx;
  .price {
    color: $color;
    font-weight: 600;
  }

  .name-area {
    font-size: 26rpx;
    display: flex;
    .goods-name {
      flex: 5;
      margin-top: 15rpx;
      line-height: 1.5;
    }

    .collect {
      flex: 1;
      text-align: center;
      padding: 15rpx 0;
      border-left: 1px solid #ccc;
      margin-left: 10rpx;
      .iconfont {
        color: $color;
      }
      .text {
        margin-top: 10rpx;
      }
    }
  }
}

.detail {
  color: $color;
  font-weight: 600;
  .title {
    padding: 25rpx 50rpx;
  }
}

.tap-area {
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  background-color: #fff;
  font-size: 10px;
  height: 50px;
  border-top: 1px solid #ccc;
  .contact {
    flex: 1;
    text-align: center;
    padding: 5px;
    .text {
      margin-top: 5px;
    }
  }

  .share {
    flex: 1;
    text-align: center;
    padding: 5px;
    .text {
      margin-top: 5px;
    }
  }

  .cart {
    flex: 1;
    text-align: center;
    padding: 5px;
    .text {
      margin-top: 5px;
    }
  }
  .add-cart {
    flex: 2;
    text-align: center;
    line-height: 50px;
    background-color: #ffa500;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
  }
  .buy {
    flex: 2;
    text-align: center;
    line-height: 50px;
    background-color: $color;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
  }
}

button {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.relative {
  position: relative;
}
</style>
