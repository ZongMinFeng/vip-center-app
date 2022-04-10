<template>
	<view class="container">
		<view class="login-div red">
			<view class="welcome blue">欢迎注册会员系统</view>
			<view class="login-input">
				<view>
					<input class="login-input-item red" placeholder="请输入邮箱" />
				</view>
				<view>
					<input class="login-input-item red" placeholder="请输入密码" />
				</view>
				<view>
					<input class="login-input-item red" placeholder="请确认密码" />
				</view>
				<button class="login-button">注册</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				
			}
		},
		methods:{
			newVip(){
				uni.navigateTo({
					url:'../newVip/newVip'
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
