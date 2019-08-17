# Media

使用AudioContext有两个好处，1、无需额外引入audio标签，2、跟随系统的状态，即手机调成震动/静音模式了，这个声音也就不要出了，3、可以音频解析

Media实现对AudioContext的封装，使用如下

## 使用方法

1. 引入media

```
<script src="media.js"></script>
```

2. 引入后会在window会挂载一个Media，接受两个参数(source, options)

souce：可以传出一个url或者一个ArrayBuffer

options

- loop：boolean类型，是否循环播放
- volume：0~1，控制音量
- analyser：是否开启音频分析，使用默认设置可以设为true；也可以是一个对象，size用于配置fftSize，默认1024

```
let media = new Media(source, {
	loop: true,
	volume: 0.6
	analyser: {
	  size: 512
	}
})
```

3. 事件

   onload：音频加载完成，逻辑下载此事件中

   onended：音频播放完触发

4. 方法

   - getData  获取分析的音频数据，类型ArrayBuffer，需要开启analyser选项
   - play 播放音频
   - suspend 暂停播放
   - start(offset) 设置音频开始播放的时刻，offset的范围为0~duration
   - setLoop(bool) 设置音频是否循环播放
   - setVolume(val) 设置音频音量，0 ~ 1.0
   - getCurrentTime 获取当前播放的时长
   - setOptions(options) 可以统一设置，如：{ loop: true, volume: 0.5 }