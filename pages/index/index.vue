<template>
	<view>
		<view>
			<view class='header'>
				<image src='../../static/img/wx_login.png'></image>
			</view>
			<view class='content'>
				<view>申请获取以下权限</view>
				<text>获得你的公开信息(昵称，头像、地区等)</text>
			</view>

			<button class='bottom' type='primary' open-type="getUserInfo" withCredentials="true" lang="zh_CN" @getuserinfo="wxGetUserInfo">
				授权登录
			</button>
		</view>
		<view class="login-vip-new" @click="study">学习英语</view>
	</view>
</template>

<script>
	export default {
		data() {
			return{
				nickName: '',
				avatarUrl: '',
				code: '',
				userInfo:{}
			};
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
							url: 'http://192.168.50.104:8801/login/miniProgramLogin',//登录的域名完整链接，可以换成你们自己的。
							data: {
								code: code,	
								channelId:'miniProgram'
							},
							method: 'POST',
							header: {
								'content-type': 'application/json'
							},
							success: (res) => {
								console.log('res', res)
								that.userInfo = res.data.data.userInfo
								uni.reLaunch({
									url: '/pages/home/home?userInfo='+encodeURIComponent(JSON.stringify(that.userInfo))
								});
							}
						});
					},
				});
			},
			
			study(){
				uni.navigateTo({
					url:'../study/study'
				})
			}
		},
		onLoad() {
			
		}
	}
</script>

<style>
	.header {
		margin: 90rpx 0 90rpx 50rpx;
		border-bottom: 1px solid #ccc;
		text-align: center;
		width: 650rpx;
		height: 300rpx;
		line-height: 450rpx;
	}

	.header image {
		width: 200rpx;
		height: 200rpx;
	}

	.content {
		margin-left: 50rpx;
		margin-bottom: 90rpx;
	}

	.content text {
		display: block;
		color: #9d9d9d;
		margin-top: 40rpx;
	}

	.bottom {
		border-radius: 80rpx;
		margin: 70rpx 50rpx;
		font-size: 35rpx;
	}
</style>

