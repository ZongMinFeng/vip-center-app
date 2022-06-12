<template>
	<view class="page">
		<image class="loginImage" src="../../static/img/login.gif"></image>
		<view>登录中，请稍后。。。</view>
	</view>
</template>

<script>
	var constants = require('@/config/baseConfig.js')

	export default {
		data() {
			return {
				nickName: '',
				avatarUrl: '',
				code: '',
				userInfo: {}
			};
		},

		onLoad() {
			this.wxGetUserInfo();
		},

		created() {
		},

		methods: {
			wxGetUserInfo() {
				var that = this;
				uni.getUserInfo({
					provider: 'weixin',
					success: function(res) {
						var nickName = res.userInfo.nickName;
						var avatarUrl = res.userInfo.avatarUrl;
						that.login();
					},
					fail(fail) {}
				});
			}, //登录
			login() {
				var that = this;
				// wx获取登录用户code
				uni.login({
					provider: 'weixin',
					success: function(res) {
						var code = res.code;
						uni.getUserInfo({
							provider: 'weixin',
							success: function(res) {
								var nickName = res.userInfo.nickName;
								var avatarUrl = res.userInfo.avatarUrl;
							}
						});
						uni.request({
							url: constants.BASE_URL + '/login/miniProgramLogin',
							data: {
								code: code,
								channelId: 'miniProgram'
							},
							method: 'POST',
							header: {
								'content-type': 'application/json'
							},
							success: (res) => {
								console.log('res', res)
								let resultCode = res.data.resultCode
								let resultMsg = res.data.resultMsg
								let data = res.data.data
								if (resultCode != '00000') {
									//错误
									console.error(resultMsg)
									uni.showToast({
										title: resultMsg
									})
									return
								}

								//需要登录
								if (data.needAuth != null && data.needAuth == 'T') {
									uni.reLaunch({
										url: '/pages/login/login?unionId=' +
											encodeURIComponent(data.unionId)
									});
									return
								}

								//不需要登录
								that.userInfo = data.userInfo
								that.token = data.token
								uni.reLaunch({
									url: '/pages/home/home?userInfo=' + encodeURIComponent(
											JSON.stringify(that.userInfo)) + '&token=' +
										encodeURIComponent(that.token)
								});

							}
						});
					},
				});
			}
		}
	}
</script>

<style>
	.page{
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.loginImage{
		margin-top: 20vh;
	}
</style>
