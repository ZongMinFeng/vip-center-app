<template>
	<view>
		<view class="bg_pink qrCode-box">
			<uqrcode class="qrCode" ref="uQRCode" :text="randomCode" />
			<view class="refresh">
				{{userInfo.nickName}}:你好！
				{{refreshTime}} 秒后刷新
			</view>
		</view>
	</view>
</template>

<script>
	var constants = require('@/config/baseConfig.js')
	
	export default{
		comments:{
		},
		data(){
			return{
				refreshTime:10,
				qrCode:'12345678',
				loadMake: true, // 组件加载完成后自动生成二维码
				userInfo:{},
				token:'',
				randomCode:''
			}
		},
		
		onLoad(option) {
			this.userInfo = JSON.parse(decodeURIComponent(option.userInfo))
			this.token = decodeURIComponent(option.token)
			
			//获取用户随机码
			this.getUserRandomCode()
		},
		
		methods:{
			getUserRandomCode(){
				let that = this
				uni.request({
					url: constants.BASE_URL+'/login/randomCode',
					data:{
						"channelId":"miniProgram"
					},
					method:"POST",
					header:{
						"X-TOKEN": that.token
					},
					success:(res)=>{
						if(res.data.resultCode!='00000'){
							uni.showToast({
								title:res.data.resultMsg,
								icon:'none',
								duration:5000
							})
						}
						console.log('获取用户随机码', res)
						that.randomCode = res.data.data.randomCode
						console.log("randomCode:", that.randomCode)
					},
					fail:(res)=>{
						uni.showToast({
							title:res.data.resultMsg
						})
					}
				})
			}
		}
	}
</script>

<style>
	.qrCode-box{
		margin: 5vw 5vw 0 5vw;
		height: 50vh;
		padding-top: 5vw;
	}
	
	.qrCode{
		width: 70vw;
		height: 70vw;
		margin: auto;
	}
	
	.refresh{
		margin-top: 5vw;
		text-align: center;
	}
	
</style>
