// 支付按钮
// 1.判断缓存中有没有token
// 2.没有 则跳转到授权页面,进行获取token
// 3.有token  则创建订单
// 4.获取订单号
// 5.完成了支付
// 6.手动删除缓存中  已经被选中的商品
// 7.删除后的购物车数据  填充回缓存
// 8.跳转页面
<template>
  <view>
    <!-- 地址 开始 -->
    <view class="address-area">
      <view class="left">
        <view class="name">收货人:{{ address.userName }}</view>
        <view class="address">{{ addressAll }}</view>
      </view>
      <view class="right">
        <view class="phone">{{ address.telNumber }}</view>
      </view>
    </view>
    <!-- 地址 结束 -->

    <!-- 购物车 开始 -->
    <view class="cart">
      <view class="title">购物车</view>
      <view class="goods-list" v-if="cartList.length !== 0">
        <view
          class="goods-item"
          v-for="(item, index) in checkedCart"
          :key="index"
        >
          <view class="left">
            <image :src="item.goods_small_logo" mode="aspectFit" />
          </view>
          <view class="right">
            <view class="top-area">{{ item.goods_name }}</view>
            <view class="bottom-area">
              <view class="price">¥ {{ item.goods_price }}</view>
              <view class="goods-num-area">
                <view class="goods-num">× {{ item.num }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 购物车 结束 -->

    <!-- 底部栏 开始 -->
    <view class="bottom-tap-area">
      <view class="total-price">
        <view class="price">合计: ¥ {{ totalPrice }}</view>
        <view class="text">包含运费</view>
      </view>
      <view class="btn" @click="handleOrderPay">支付({{ totalNum }})</view>
    </view>

    <!-- 底部栏 结束 -->
  </view>
</template>

<script>
import regeneratorRuntime from "../../lib/runtime/runtime";
export default {
  components: {},
  data: () => ({
    address: {},
    cartList: [],
    checkedCart: [],
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
    async handleOrderPay() {
      try {
        const token = uni.getStorageSync("token");

        if (!token) {
          uni.navigateTo({
            url: "/pages/auth/auth",
          });
          return;
        }
        console.log("已有token");
        // 创建订单
        const header = { Authorization: token };
        const order_price = this.totalPrice;
        const consignee_addr = this.addressAll;
        let goods = [];
        this.checkedCart.forEach((v) =>
          goods.push({
            goods_id: v.goods_id,
            goods_number: v.num,
            goods_price: v.goods_price,
          })
        );
        console.log(goods);
        const orderParams = { order_price, consignee_addr, goods };
        // 获取订单编号
        const orderRes = await this.request({
          url: "/my/orders/create",
          method: "POST",
          data: orderParams,
          header,
        });
        console.log(orderRes);
        // orderNum = orderRes.order_number;
        const orderNum = 12345678;
        // 发起 预支付
        const readyPayRes = await this.request({
          url: "/my/orders/req_unifiedorder",
          method: "POST",
          data: { order_number: orderNum },
          header,
        });
        console.log(readyPayRes);
        // 调用 支付
        const payRes = await uni.requestPayment({
          provider: "wxpay",
          timeStamp: String(Date.now()),
          nonceStr: "A1B2C3D4E5",
          package: "prepay_id=wx20180101abcdefg",
          signType: "MD5",
          paySign: "99999",
        });
        console.log(payRes);

        // 查询后台订单状态
        const checkOrderRes = await this.request({
          url: "/my/orders/chkOrder",
          method: "POST",
          data: { order_number: orderNum },
          header,
        });
        console.log(checkOrderRes);

        await uni.showToast({
          title: "支付成功",
        });
        // 删除缓存
        let newCart = uni.getStorageSync("cart");
        newCart = newCart.filter((v) => !v.checked);
        uni.setStorageSync("cart", newCart);

        // 跳转到订单页面
        uni.navigateTo({
          url: "/pages/order/order",
        });
      } catch (error) {
        await uni.showToast({
          title: "支付失败",
          icon: "error",
        });
        console.log(error);
      }
    },
  },
  onShow() {
    // 1.获取缓存中的地址信息
    const address = uni.getStorageSync("address");
    // 2.给data赋值
    this.address = address;

    // 获取购物车缓存
    const cart = uni.getStorageSync("cart");
    this.cartList = cart;
    // 过滤后的购物车数组
    this.checkedCart = this.cartList.filter((v) => v.checked);
    console.log(this.checkedCart);
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

            .goods-num {
              margin: 5rpx 25rpx;
              font-size: 30rpx;
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
  background-color: #fff;
  width: 100%;
  display: flex;
  border-top: 1px solid #ddd;
  .total-price {
    margin: 5rpx 20rpx 0 0;
    flex: 3;
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
</style>
