<template>
	<view class="page">
		<canvas id="qrcode" canvas-id="qrcode" type="2d" :style="{ width: `${size}px`, height: `${size}px` }"></canvas>
		<view class="refresh">
			{{userInfo.nickName}} : 您好！
			会员码 {{refreshTime}} 秒后刷新
		</view>
		<view @click="study">学习英语</view>
	</view>
</template>

<script>
	var constants = require('@/config/baseConfig.js')
	import uQRCode from 'u-qrcode/module';
	
	export default{
		data(){
			return{
				refreshTime:60,
				deadTime:1000,
				userInfo:{},
				token:'',
				randomCode:'',
				text: 'uQRCode',
				size: 250,
				mCtx:null,
				intervalId:null
			}
		},
		
		onLoad(option) {
			this.userInfo = JSON.parse(decodeURIComponent(option.userInfo))
			this.token = decodeURIComponent(option.token)
		},
		
		async onReady() {
		  const canvas = await new Promise(resolve => {
		    uni
		      .createSelectorQuery()
		      .select(`#qrcode`)
		      .fields({
		        node: true,
		        size: true
		      })
		      .exec(res => {
		        resolve(res[0].node);
		      });
		  });
		  this.mCtx = canvas.getContext('2d');
		  const dpr = uni.getSystemInfoSync().pixelRatio;
		  canvas.width = this.size * dpr;
		  canvas.height = this.size * dpr;
		  this.mCtx.scale(dpr, dpr);
		  
		  //获取用户随机码
		  this.getUserRandomCode()
		},
		
		methods:{
			study() {
				uni.navigateTo({
					url: '../study/study'
				})
			},
			
			getUserRandomCode(){
				if(this.intervalId!=null){
					clearInterval(this.intervalId)
				}
				let that = this
				uni.request({
					url: constants.BASE_URL+'/auth/randomCode',
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
						that.draw();
						
						//设置定时器
						if(this.deadTime<=0){
							console.log("时间过长，不再启动定时器！")
							return
						}
						that.refreshTime = 60;
						this.intervalId = setInterval(function(){
							that.refreshTime = that.refreshTime - 1
							that.deadTime = that.deadTime - 1
							if(that.refreshTime<=0){
								that.getUserRandomCode();
							}
						}, 1000)
					},
					fail:(res)=>{
						uni.showToast({
							title:res.data.resultMsg
						})
					}
				})
			},
			
			draw(){
				let ctx = this.mCtx;
				let uqrcode = new uQRCode(
				  {
				    text: this.randomCode,
				    size: this.size
				  },
				  ctx
				);
				uqrcode.make();
				uqrcode.draw({
				  /* 在绘制完前景之后接着绘制文字在二维码上 */
				  drawForeground: {
				    after: () => {
				      ctx.save();
				      
				      /* 设置阴影效果 */
				      ctx.shadowOffsetX = 0;
				      ctx.shadowOffsetY = 0;
				      ctx.shadowBlur = 12;
				      ctx.shadowColor = 'rgba(0, 0, 0, 0.68)';
				      ctx.restore();
				      ctx.draw(true);
				    }
				  }
				});
			},
		}
	}
</script>

<style>
	.page {
	  background-color: bisque;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  padding-top: 5vw;
	}
	
	.qrCode{
		width: 260px;
		height: 260px;
		margin: auto;
	}
	
	.refresh{
		margin-top: 5vw;
		text-align: center;
	}
	
</style>
