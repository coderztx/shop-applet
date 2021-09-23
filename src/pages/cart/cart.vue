<template>
  <view>
    <!-- 收货地址 开始 -->
    <view class="get-address" v-if="!address">
      <button type="primary" @click="handleClick">获取收货地址</button>
    </view>
    <view class="address-area" v-else>
      <view class="left">
        <view class="name">收货人:{{ address.userName }}</view>
        <view class="address">{{ addressAll }}</view>
      </view>
      <view class="right">
        <view class="phone">{{ address.telNumber }}</view>
      </view>
    </view>
    <!-- 收货地址 结束 -->

    <!-- 购物车 开始 -->
    <view class="cart">
      <view class="title">购物车</view>
      <view class="goods-list" v-if="cartList.length !== 0">
        <view class="goods-item" v-for="(item, index) in cartList" :key="index">
          <view class="check-btn">
            <checkbox-group>
              <checkbox
                :checked="item.checked"
                @click="handleClickCheckbox(index)"
              />
            </checkbox-group>
          </view>
          <view class="left">
            <image :src="item.goods_small_logo" mode="aspectFit" />
          </view>
          <view class="right">
            <view class="top-area">{{ item.goods_name }}</view>
            <view class="bottom-area">
              <view class="price">¥ {{ item.goods_price }}</view>
              <view class="goods-num-area">
                <view class="btn1" @click="handleClickBtn1(index)">-</view>
                <view class="goods-num">{{ item.num }}</view>
                <view class="btn2" @click="handleClickBtn2(index)">+</view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="good-list-none" v-else>
        <image
          src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Fe1b1467beea0a9c7d6a56b32bac6d7e5dcd914f7c3e6-YTwUd6_fw658&refer=http%3A%2F%2Fhbimg.b0.upaiyun.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1634829898&t=30d2dd6760f1e737a239da5b617cae52"
          mode="widthFix"
        />
      </view>
    </view>
    <!-- 购物车 结束 -->

    <!-- 底部栏 开始 -->
    <view class="bottom-tap-area">
      <view class="left">
        <view class="check-btn">
          <checkbox-group>
            <checkbox
              value=""
              :checked="allChecked"
              @click="handleClickCheckboxAll"
            />
          </checkbox-group>
        </view>
        <view class="text">全选</view>
      </view>
      <view class="right">
        <view class="total-price">
          <view class="price">合计: ¥ {{ totalPrice }}</view>
          <view class="text">包含运费</view>
        </view>
        <view class="btn" @click="handlePay">结算({{ totalNum }})</view>
      </view>
    </view>

    <!-- 底部栏 结束 -->
  </view>
</template>

<script>
export default {
  components: {},
  data: () => ({
    address: {},
    cartList: [],
    allChecked: false,
  }),
  computed: {
    addressAll() {
      return (
        this.address.provinceName +
        this.address.cityName +
        this.address.countyName +
        this.address.detailInfo
      );
    },
    totalPrice() {
      let totalPrice = 0;
      for (var i = 0; i < this.cartList.length; i++) {
        if (this.cartList[i].checked === true) {
          totalPrice += this.cartList[i].num * this.cartList[i].goods_price;
        }
      }
      return totalPrice;
    },
    totalNum() {
      let totalNum = 0;
      for (var i = 0; i < this.cartList.length; i++) {
        if (this.cartList[i].checked === true) {
          totalNum += this.cartList[i].num;
        }
      }
      return totalNum;
    },
  },
  methods: {
    // 点击获取地址信息
    handleClick() {
      uni.chooseAddress({
        success: (result) => {
          console.log(result);
          uni.setStorageSync("address", result);
        },
      });
    },
    handleClickBtn1(index) {
      if (this.cartList[index].num > 0) {
        this.cartList[index].num--;
        uni.setStorageSync("cart", this.cartList);
      }
      // 数量为0 则删除数组中的对应项
      if (this.cartList[index].num === 0) {
        // 后面的1表示长度
        this.cartList.splice(index, 1);
        uni.setStorageSync("cart", this.cartList);
      }
    },
    handleClickBtn2(index) {
      this.cartList[index].num++;
      uni.setStorageSync("cart", this.cartList);
    },
    handleClickCheckbox(index) {
      this.cartList[index].checked = !this.cartList[index].checked;
      this.allChecked = this.cartList.length
        ? this.cartList.every((v) => v.checked)
        : false;
      uni.setStorageSync("cart", this.cartList);
    },
    handleClickCheckboxAll() {
      this.allChecked = !this.allChecked;
      for (var i = 0; i < this.cartList.length; i++) {
        this.cartList[i].checked = !this.cartList[i].checked;
      }
      uni.setStorageSync("cart", this.cartList);
    },
    handlePay() {
      if (!this.address) {
        uni.showToast({
          title: "您还没有选择收货地址",
          icon: "none",
        });
        return;
      }
      if (this.totalNum === 0) {
        uni.showToast({
          title: "您还没有选购商品",
          icon: "none",
        });
        return;
      }
      uni.navigateTo({
        url: "/pages/pay/pay",
      });
    },
  },
  onShow() {
    // 1.获取缓存中的地址信息
    const address = uni.getStorageSync("address");
    // 2.给data赋值
    this.address = address;

    // 获取购物车缓存
    const cart = uni.getStorageSync("cart") || [];
    this.cartList = cart;

    // 计算全选
    this.allChecked = cart.length ? cart.every((v) => v.checked) : false;
  },
};
</script>

<style lang="scss" scoped>
.address-area {
  display: flex;
  padding: 20rpx;
  line-height: 2;
  border-bottom: 1px solid $color;

  .left {
    flex: 2;
    font-size: 28rpx;
  }

  .right {
    flex: 1;
    padding-left: 30rpx;
  }
}

.cart {
  .title {
    font-size: 36rpx;
    border-bottom: 1px solid $color;
    padding: 20rpx;
    font-weight: 600;
  }

  .goods-list {
    padding: 10rpx;
    .goods-item {
      border-bottom: 1px solid #ddd;
      display: flex;
      .check-btn {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .left {
        flex: 2;
        padding: 20rpx;
        image {
          height: 200rpx;
        }
      }

      .right {
        flex: 5;
        overflow: hidden;
        padding: 20rpx 0;
        .top-area {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding: 10rpx;
          font-size: 30rpx;
        }

        .bottom-area {
          display: flex;
          margin-top: 50rpx;
          .price {
            flex: 2;
            color: $color;
            font-size: 36rpx;
          }

          .goods-num-area {
            display: flex;
            flex: 1;

            .btn1 {
              text-align: center;
              line-height: 60rpx;
              background-color: #e8ebe8;
              width: 60rpx;
              height: 60rpx;
              border: 1px solid #ddd;
            }

            .goods-num {
              margin: 5rpx 25rpx;
              font-size: 30rpx;
            }

            .btn2 {
              text-align: center;
              background-color: #e8ebe8;
              width: 60rpx;
              height: 60rpx;
              border: 1px solid #ddd;
              line-height: 60rpx;
            }
          }
        }
      }
    }
  }
}

.bottom-tap-area {
  position: fixed;
  height: 50px;
  bottom: 0;
  display: flex;
  background-color: #fff;
  width: 100%;
  border-top: 1px solid #ddd;
  .left {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    .check-btn {
    }
    .text {
      font-size: 26rpx;
    }
  }

  .right {
    flex: 3;
    display: flex;
    .total-price {
      margin: 5rpx 20rpx 0 0;
      flex: 2;
      .price {
        text-align: right;
        font-size: 36rpx;
        color: $color;
      }

      .text {
        text-align: right;
        font-size: 24rpx;
      }
    }

    .btn {
      flex: 1;
      background-color: $color;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #ddd;
      font-weight: 600;
    }
  }
}
</style>
