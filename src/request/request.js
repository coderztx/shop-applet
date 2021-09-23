export default (params) => {
  uni.showLoading({
    title: '加载中'
  });
  // 定义公共的 url
  const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1'
  return new Promise((resolve, reject) => {
    uni.request({
      ...params,
      url: baseUrl + params.url,
      success: (result) => {
        resolve(result.data.message)
        uni.hideLoading();
      },
      fail: (err) => {
        reject(err)
        uni.hideLoading();
      }
    });
  })
}