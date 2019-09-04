(function() {
  function Media(source, options={}) {
    this.initParams(options)
    this.initAnalyser(options.analyser)
    this.initSource(source)
  }
  Media.prototype = {
    initParams(options) {
      this.options = options
      this.firstPlay = true
      this.delta = 0
      this.ctx = new (window.AudioContext || window.webkitAudioContext)()
      this.pause()
      this.gain = this.ctx.createGain()
      this.gain.connect(this.ctx.destination)
    },
    initSource(source) {
      if (typeof source === 'string') {
        this.request(source).then(data => {
          this.initDecode(data)
        })
      } else if (source instanceof ArrayBuffer) {
        this.initDecode(source)
      } else {
        throw new Error('expected source is string url or ArrayBuffer')
      }
    },
    initDecode(data) {
      this.ctx.decodeAudioData(data).then(decodedData => {
        this.initBufferSource(decodedData)
        this.setOptions()
        this.onload && this.onload()
      })
    },
    /**
     * @param {string} url 音频url地址
     */
    request(url) {
      return new Promise(resolve => {
        let xhr = new XMLHttpRequest()
        xhr.open('GET', url, true)
        xhr.responseType = 'arraybuffer'
        xhr.onload = function() {
          resolve(xhr.response)
        }
        xhr.send()        
      })
    },
    initBufferSource(decodedData) {
      this.source = this.ctx.createBufferSource()
      this.decodedData = decodedData
      this.source.buffer = this.decodedData
      this.duration = this.source.buffer.duration
      this.source.connect(this.analyser ? this.analyser : this.gain)
      this.onended && (this.source.onended = this.onended)
    },
    setOptions(options) {
      let { loop, volume } = options ? options : this.options
      if (loop != null) this.setLoop(loop)
      if (volume != null) this.setVolume(volume)
    },
    /**
     * @param {object} options 分析器配置信息
     */
    initAnalyser(options) {
      if (!options) return
      if (typeof options === 'boolean' || 
          typeof options === 'object' && options !== null) {
        this.analyser = this.ctx.createAnalyser()
        let size = options.size || 1024
        this.analyser.fftSize = size
        this.analyser.connect(this.gain)
      } else {
        throw new Error('expected parameter is boolean or object')
      }
    },
    /**
     * @description 获取解析的音频数据
     */
    getData() {
      if (!this.analyser) return
      let data = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteFrequencyData(data);
      return data
    },  
    /**
     * @description 获取当前播放的时刻，单位秒
     */
    getCurrentTime() {
      return Math.min(this.ctx.currentTime - this.delta, this.duration)
    },
    /**
     * @description 播放
     */
    play() {
      if (this.firstPlay) {
        this.start(0)
      }
      if (this.ctx.state === 'suspended') this.ctx.resume()
      this.state = 'running'
    },
    /**
     * @description 暂停
     */
    pause() {
      if (this.ctx.state === 'running') {
        this.ctx.suspend()
        this.state = 'suspend'
      }
    },
    /**
     * @description 切换
     */
    toggle() {
      this.state === 'running' ? this.pause() : this.play()
    },
    /**
     * @param {number} offset 设置播放开始的偏移值
     */
    start(offset) {
      if (typeof offset !== 'number') throw new Error('expected parameter is number type')
      if (this.duration >= offset && offset >= 0) {
        this.delta = this.ctx.currentTime - offset
        if (!this.firstPlay) {
          this.source.onended = null
          this.source.stop()
          this.initBufferSource(this.decodedData)
        }
        this.source.start(this.ctx.currentTime, offset)
        this.state = 'running'
        this.firstPlay = false
        return
      }
      throw new Error(`value is out of range and expected range from 0 to ${this.duration}`)
    },
    /**
     * @param {boolean} loop 设置歌曲是否循环
     */
    setLoop(loop) {
      if (typeof loop !== 'boolean') throw new Error('expected parameter is boolean type')
      this.source.loop = loop
      this.loop = loop
    },
    /**
     * @param {number} val 设置音量
     */
    setVolume(val=1) {
      if (typeof val !== 'number') throw new Error('expected parameter is number type')
      if (val >= 0 && val <= 1) {
        this.gain.gain.value = val //** 2
        this.volume = val
        return
      }
      throw new Error('value is out of range and expected range from 0 to 1')
    },
  }
  window.Media = Media
})()