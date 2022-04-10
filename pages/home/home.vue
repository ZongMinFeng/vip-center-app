<template>
	<view>
		<view class="bg_pink qrCode-box">
			<!-- <tki-qrcode
				class="qrCode"
				ref="qrcode"
				:size="525"
				:val="qrCode"
				:loadMake="loadMake"></tki-qrcode> -->
			<view class="refresh">
				{{userInfo.nickName}}:你好！
				{{refreshTime}} 秒后刷新
			</view>
		</view>
	</view>
</template>

<script>
	import tkiQrcode from "@/components/tki-qrcode/tki-qrcode.vue"
	export default{
		comments:{
			tkiQrcode
		},
		data(){
			return{
				refreshTime:10,
				qrCode:'1234567890',
				loadMake: true, // 组件加载完成后自动生成二维码
				userInfo:{}
			}
		},
		
		onLoad(option) {
			this.userInfo = JSON.parse(decodeURIComponent(option.userInfo))
		},
		
		methods:{
			
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
