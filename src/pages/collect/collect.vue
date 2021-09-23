<template>
	<view>
		<uni-segmented-control :current="current" :values="items.map((v) => v.title)" @clickItem="onClickItem"
			styleType="text" activeColor="#eb4450"></uni-segmented-control>
		<view class="content">
			<view v-if="current === 0">
				<scroll-view class="goods-list" scroll-y>
					<navigator class="goods-item" v-for="(item, index) in collectedList" :key="index"
						:url="`/pages/goods_detail/goods_detail?goods_id=${item.goods_id}`">
						<view class="left">
							<image :src="item.goods_small_logo" mode="aspectFit" />
						</view>
						<view class="right">
							<view class="top-area">{{ item.goods_name }}</view>
							<view class="bottom-area">
								<view class="price">¥ {{ item.goods_price }}</view>
							</view>
						</view>
					</navigator>
				</scroll-view>
			</view>
			<view v-if="current === 1"> 选项卡2的内容 </view>
			<view v-if="current === 2"> 选项卡3的内容 </view>
			<view v-if="current === 2"> 选项卡4的内容 </view>
		</view>
	</view>
</template>

<script>
	import {
		uniSegmentedControl
	} from "@dcloudio/uni-ui";
	export default {
		components: {
			uniSegmentedControl
		},
		data: () => ({
			items: [{
					title: "商品收藏"
				},
				{
					title: "品牌收藏"
				},
				{
					title: "店铺收藏"
				},
				{
					title: "浏览足迹"
				},
			],
			current: 0,
			collectedList: [],
		}),
		computed: {},
		methods: {
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex;
				}
			},
		},
		// 页面周期函数--监听页面加载
		onLoad() {},
		// 页面周期函数--监听页面初次渲染完成
		onReady() {},
		// 页面周期函数--监听页面显示(not-nvue)
		onShow() {
			this.collectedList = uni.getStorageSync("collectedList");
		},
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
	.goods-list {
		padding: 10rpx;
		height: calc(100vh - 40px);

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
					margin-top: 50rpx;

					.price {
						color: $color;
						font-size: 36rpx;
					}

					.goods-num {
						margin: 5rpx 25rpx;
						font-size: 30rpx;
					}
				}
			}
		}
	}
</style>
