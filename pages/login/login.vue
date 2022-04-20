<template>
	<view class="container">
		<view class="login-div">
			<view class="welcome">欢迎登录会员系统</view>
			<view class="login-input">
				<view>
					<input class="login-input-item" placeholder="请输入邮箱" v-model="mailAddress" />
				</view>
				<view>
					<input class="login-input-item" placeholder="请输入密码" v-model="passWord" />
				</view>
				<button class="login-button" @click="login">登录</button>
				<view class="login-vip-new" @click="newVip">新用户注册</view>
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
				sessionKey:'',
				mailAddress:'',
				passWord:'',
				userInfo:{},
				token:''
			}
		},
		
		onLoad(option) {
			this.unionId = decodeURIComponent(option.unionId)
			this.getSessionKey()
		},
		
		methods:{
			newVip(){
				if(this.sessionKey==null){
					uni.showToast({
						title:"系统还没准备后，请5秒后再试！",
						icon:'none'
					})
					return
				}
				let that = this
				uni.navigateTo({
					url:'../newVip/newVip?unionId='+encodeURIComponent(that.unionId)+"&sessionKey="+encodeURIComponent(that.sessionKey)
				})
			},
			
			login(){
				if(this.mailAddress==''){
					uni.showToast({
						icon:'none',
						title:"请输入邮箱！",
					})
					return
				}
				
				if(this.passWord==''){
					uni.showToast({
						icon:'none',
						title:'请输入密码！'
					})
					return
				}
				
				if(this.sessionKey==''){
					uni.showToast({
						icon:'none',
						title:'获取密钥中----，请稍后再试'
					})
					return
				}
				
				//加密
				let encPassWord = cryptoUtil.encrypt(this.passWord, this.sessionKey)
				
				let that = this
				uni.request({
					url:constants.BASE_URL+'/login/mailPassWordLogin',
					method:'POST',
					data:{
						'channelId':'miniProgram',
						'unionId':that.unionId,
						'mailAddress':that.mailAddress,
						'encPassWord':encPassWord
					},
					success: (res) => {
						if(res.data.resultCode!='00000'){
							uni.showToast({
								icon:'none',
								title:res.data.resultMsg
							})
							return
						}
						
						that.userInfo = res.data.data.userInfo
						that.token = res.data.data.token
						
						uni.navigateTo({
							url:'../home/home?userInfo=' + encodeURIComponent(
											JSON.stringify(that.userInfo)) + '&token=' +
										encodeURIComponent(that.token)
						})
					}
				})
				
				
			},
			
			getSessionKey(){
				uni.request({
					url:constants.BASE_URL+'/login/sessionKey',
					method:"POST",
					data:{
						"channelId":"miniProgram",
						"unionId":this.unionId
					},
					success: (res) => {
						this.sessionKey = res.data.data.sessionKey;
						console.log('sessionKey:'+this.sessionKey)
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
