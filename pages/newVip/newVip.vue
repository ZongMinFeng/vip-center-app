<template>
	<view class="container">
		<view class="login-div">
			<view class="welcome">欢迎注册会员系统</view>
			<view class="login-input">
				<view>
					<input class="login-input-item" placeholder="请输入昵称" v-model="nickName" />
				</view>
				<view>
					<input class="login-input-item" placeholder="请输入邮箱" v-model="mailAddress" />
				</view>
				<view>
					<button @click="getAuthCode">获取验证码</button>
				</view>
				<view>
					<input class="login-input-item" placeholder="请输入验证码" v-model="mailAuthCode" />
				</view>
				<view>
					<input class="login-input-item" placeholder="请输入密码" v-model="passwork" />
				</view>
				<view>
					<input class="login-input-item" placeholder="请确认密码" v-model="passworkCheck" />
				</view>
				<button class="login-button" @click="register()">注册</button>
			</view>
		</view>
	</view>
</template>

<script>
	var cryptoUtil = require('@/util/cryptoUtil.js')
	var constants = require('@/config/baseConfig.js')
	
	export default{
		data(){
			return{
				unionId:'',
				nickName:'',
				mailAuthCode:'',
				mailAddress:'',
				passwork:'',
				passworkCheck:'',
				sessionKey:''
			}
		},
		
		onLoad(option) {
			this.unionId = decodeURIComponent(option.unionId)
			this.sessionKey = decodeURIComponent(option.sessionKey)
		},
		
		methods:{
			getAuthCode(){
				let that = this
				
				if(this.sessionKey==''){
					uni.showToast({
						title:'sessioKey未准备好，请重新打开小程序!',
						icon:'none'
					})
					return
				}
				
				if(this.mailAddress==''){
					uni.showToast({
						title:'请输入邮箱!',
						icon:'none'
					})
					return
				}
				
				uni.request({
					url:constants.BASE_URL+'/auth/mailAuthCode',
					method:'POST',
					data:{
						"channelId":"miniProgram",
						"unionId":that.unionId,
						"mailAddress":that.mailAddress
					}
				})
			},
			
			register(){
				let that = this
				if(this.sessionKey==null){
					uni.showToast({
						title:'sessioKey未准备好，请重新打开小程序!',
						icon:'none'
					})
					return
				}
				
				if(this.nickName==''){
					uni.showToast({
						icon:'none',
						title:'请输入昵称'
					})
					return
				}
				if(this.mailAddress==''){
					uni.showToast({
						icon:'none',
						title:'请输入邮箱'
					})
					return
				}
				if(this.mailAuthCode==''){
					uni.showToast({
						icon:'none',
						title:'请输入邮箱验证码'
					})
					return
				}
				if(this.passwork==''){
					uni.showToast({
						icon:'none',
						title:'请输入密码'
					})
					return
				}
				if(this.passwork!=this.passworkCheck){
					uni.showToast({
						icon:'none',
						title:'密码不一致！'
					})
					return
				}
				
				//密码加密
				let encPassWork = cryptoUtil.encrypt(this.passwork, this.sessionKey)
				console.log("密码密文："+encPassWork)
				
				//邮箱注册
				uni.request({
					url:constants.BASE_URL+'/register/mailRegister',
					method:'POST',
					data:{
						"channelId":"miniProgram",
						"unionId":that.unionId,
						"nickName":that.nickName,
						"mailAddress":that.mailAddress,
						"mailAuthCode":that.mailAuthCode,
						"encPassWork":encPassWork
					},
					success: (res) => {
						if(res.data.resultCode!='00000'){
							uni.showToast({
								icon:'none',
								title:res.data.resultMsg
							})
							return
						}
						
						//注册成功，进入主页面
						uni.reLaunch({
							url: '/pages/home/home?userInfo=' + encodeURIComponent(
									JSON.stringify(res.data.data.userInfo)) + '&token=' +
								encodeURIComponent(res.data.data.token)
						})
					}
				})
			}
		}
	}
</script>

<style>
	.container{
		padding: 20rpx;
	}
	
	.red{
		/* border: 1rpx solid red; */
		/* background-color: #ff00ff; */
	}
	.blue{
		/* border:1rpx solid blue; */
	}
	.login-div{
		display: flex;
		border-radius: 30rpx;
		flex-flow: column;
		height: 80vh;
	}
	
	.welcome{
		height: 15vh;
		line-height: 15vh;
		text-align: center;
		font-size: 40rpx;
		font-weight: 700;
	}
	
	.login-input{
		height: 20vh;
		padding: 0 5vw;
	}
	
	.login-input-item{
		height: 7vh;
		margin-bottom: 5vh;
		border-radius: 4vh;
		padding-left: 5vw;
	}
	
	.login-button{
		/* height: 5vh; */
	}
	
	.login-vip-new{
		float: right;
		margin-top: 2rpx;
		color: #007AFF;
	}
</style>
