<template>
  <view>
    <button @click="getUserProfile" type="primary">获取授权</button>
  </view>
</template>

<script>
import regeneratorRuntime from "../../lib/runtime/runtime";
export default {
  components: {},
  data: () => ({}),
  computed: {},
  methods: {
    async getUserProfile() {
      // 获取用户信息
      const resUser = await uni.getUserProfile({ desc: "用于用户登录" });
      console.log(resUser);
      // 缓存 UserInfo 用于登录
      uni.setStorageSync("userInfo", resUser[1].userInfo);
      const { encryptedData, iv, rawData, signature } = resUser[1];
      // 获取登录后的 code
      const resCode = await uni.login();
      console.log(resCode);
      const { code } = resCode[1];
      const loginParams = { encryptedData, iv, rawData, signature, code };
      // 发起请求
      const token = await this.request({
        url: "/users/wxlogin",
        data: loginParams,
        method: "POST",
      });
      console.log(loginParams);
      // 无企业账号,无法获取
      console.log(token);
      // 存储 token 到缓存中
      uni.setStorageSync("token", "xxxxxx");
      // 返回支付页面
      uni.navigateBack();
    },
  },

  // 页面周期函数--监听页面加载
  onLoad() {},
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

<style lang="scss"></style>
