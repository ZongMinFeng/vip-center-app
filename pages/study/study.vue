<template>
	<view class="container">
		<view>
			<input v-model="allTime" placeholder="请输入总时间" type="number" />
			<button @click="getStart">计算时间</button>
			起始时间：{{startTime}} 结束时间：{{endTime}}
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				allTime:null,
				startTime:0,
				endTime:0,
			}
		},
		
		methods:{
			getStart(){
				console.log(this.allTime);
				this.startTime = this.allTime*Math.random();
				this.endTime = this.startTime + 10;
			}
		}
	}
</script>

<style>
</style>
