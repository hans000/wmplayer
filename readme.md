# MPlayer

使用AudioContext有下面几个好处

- 无需额外引入audio标签
- 跟随系统的状态，即手机调成震动/静音模式了，这个声音也就不要出了
- 可以音频解析，做特效

MPlayer实现对AudioContext的封装，可以很方便的使用

## 使用方法How to use？

引入media

```
npm i @hans000/media-player -S

https://cdn.jsdelivr.net/npm/@hans000/media-player@0.2.1/dist/index.js
```

## 示例demo

初始化

```js
import MPlayer from '@hans000/media-player'
```

```
<script src="https://cdn.jsdelivr.net/npm/@hans000/media-player@0.2.1/dist/index.js"></script>
```

```
new MPlayer('./1.mp3').onload = function() {
	this.play()
}
```

```
new MPlayer(resource, options)
```

`resouce`：可以传出一个url、一个ArrayBuffer或者值为url的数组

`options`

- loop：boolean类型，是否循环播放，默认为`false`
- volume：0~1，控制音量，默认为`1`
- auto：加载完成后自动播放，默认`true`
- index：设置从哪一首开发播放，默认`0`，从即第1首开始
- analyser：是否开启音频分析，使用默认设置可以设为true；也可以是一个对象，size用于配置fftSize，默认`1024`

```js
let media = new Media(resource, {
  loop: false,
  volume: 0.6,
  auto: false,
  analyser: {
    size: 512
  }
})
media.onload = function() {
	this.play()
}
```

事件绑定

```js
// 初始化时设置
let media = new Media('./1.mp3')

// 添加事件监听方法，会覆盖之前用该方式绑定的监听方法
media.onload = function () { ... }

// 添加事件监听方法，会保留该事件的其他监听方法，可同时设置多个事件
media.on('load', function () { ... })
```

取消监听

```js
// 解除事件绑定
player.off('load', fn)

// 解除某事件下所有监听绑定
player.off('load')
```



## API

属性 props

- duration 获取音频总时长`number`
- state 获取当前音频的状态，running | suspend
- volume 获取当前音量`number`
- loop 获取音频是否循环`boolean`
- auto 是否自动播放`boolean`

方法 methods

- on(type, fn) 绑定事件，type可选值（load | ended），fn回调函数
- off(type, fn) 解绑事件，type可选值（load | ended），fn回调函数
- emit(type) 手动触发监听事件
- getData  获取分析的音频数据，类型Uint8Array，需要开启analyser选项
- play 播放音频
- pause 暂停播放
- toggle 音频状态切换
- playPrev 播放上一首
- playNext 播放下一首
- start(offset) 设置音频开始播放的时刻，offset的范围为0~duration
- setLoop(bool) 设置音频是否循环播放
- setVolume(val) 设置音频音量，0 ~ 1.0
- getCurrentTime 获取当前播放的时长
- setOptions(options) 可以统一设置，如：{ loop: true, volume: 0.5 }

事件 events

- onload：音频解析完成时触发

- onended：音频播放完触发

## License

MIT