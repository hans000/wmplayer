(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["mplayer"] = factory();
	else
		root["MPlayer"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = Media\r\n\r\nfunction Media(resource, options={}) {\r\n  this.initParams(options)\r\n  this.initAnalyser(options.analyser)\r\n  this.initSource(resource)\r\n}\r\nMedia.prototype = {\r\n  initParams(options) {\r\n    let { index, auto } = options\r\n    this.handle = {}\r\n    this.index = index || 0\r\n    this.auto = auto || true\r\n    this.options = options\r\n    this.delta = 0\r\n    this.firstPlay = true\r\n    this.ctx = new (window.AudioContext || window.webkitAudioContext)()\r\n    this.pause()\r\n    this.gain = this.ctx.createGain()\r\n    this.gain.connect(this.ctx.destination)\r\n  },\r\n  on(type, fn) {\r\n    this.handle[type] ? this.handle[type].push(fn) : this.handle[type] = [fn]\r\n  },\r\n  off(type, fn) {\r\n    if (fn) {\r\n      this.handle[type] = this.handle[type].filter(e => e !== fn)\r\n    } else {\r\n      delete this.handle[type]\r\n    }\r\n  },\r\n  emit(type) {\r\n    this.handle[type] && this.handle[type].forEach(e => e())\r\n  },\r\n  initSource(resource) {\r\n    this.store = []\r\n    if (typeof resource === 'string') {\r\n      this.index = 0\r\n      this.store.push(resource)\r\n    } else if (Array.isArray(resource)) {\r\n      this.store = resource\r\n    } else {\r\n      throw new Error('expected resource is string url or Array url')\r\n    }\r\n    this.initRequest()\r\n  },\r\n  initRequest() {\r\n    let resource = this.store[this.index]\r\n    if (typeof resource === 'string') {\r\n      this.request(resource)\r\n        .then(data => this.initDecode(data))\r\n        .catch(err => {\r\n          console.log(err)\r\n          this.playNext()\r\n        })\r\n    } else if (resource instanceof ArrayBuffer) {\r\n      this.initDecode(resource)\r\n    } else {\r\n      throw new Error('expected resource is string url, ArrayBuffer')\r\n    }\r\n  },\r\n  initDecode(data) {\r\n    this.ctx.decodeAudioData(data).then(decodedData => {\r\n      this.initBufferSource(decodedData)\r\n      this.setOptions()\r\n      this.auto && this.play()\r\n      this.bindLoad()\r\n    })\r\n  },\r\n  /**\r\n   * @param {string} url 音频url地址\r\n   */\r\n  request(url) {\r\n    return new Promise((resolve, reject) => {\r\n      let xhr = new XMLHttpRequest()\r\n      xhr.open('GET', url, true)\r\n      xhr.responseType = 'arraybuffer'\r\n      xhr.onreadystatechange = () => {\r\n        let { status, readyState, statusText } = xhr\r\n        if (readyState === 4) {\r\n          if (status >= 200 && status < 300 || status === 304) {\r\n            resolve(xhr.response)\r\n          } else {\r\n            reject(`status: ${status}, ${statusText}`)\r\n          }\r\n        }\r\n      }\r\n      xhr.onerror = reject.bind(this, 'error')\r\n      xhr.ontimeout = reject.bind(this, 'request timerout！')\r\n      xhr.send()\r\n    })\r\n  },\r\n  playPrev() {\r\n    let len = this.store.length\r\n    this.loop && !~--this.index && (this.index += len)\r\n    this.reset()\r\n  },\r\n  playNext() {\r\n    let len = this.store.length\r\n    this.loop && (this.index = ++this.index % len)\r\n    this.reset()\r\n  },\r\n  reset() {\r\n    this.pause()\r\n    this.firstPlay = true\r\n    this.source.onended = null\r\n    this.source.stop()\r\n    this.initRequest()\r\n  },\r\n  initBufferSource(decodedData) {\r\n    this.source = this.ctx.createBufferSource()\r\n    this.decodedData = decodedData\r\n    this.source.buffer = this.decodedData\r\n    this.duration = this.source.buffer.duration\r\n    this.source.connect(this.analyser ? this.analyser : this.gain)\r\n    this.bindEnded()\r\n  },\r\n  bindLoad() {\r\n    this.onload && this.onload()\r\n    this.emit('load')\r\n  },\r\n  bindEnded() {\r\n    this.source.onended = () => {\r\n      this.onended && this.onended()\r\n      this.emit('ended')\r\n    }\r\n  },\r\n  setOptions(options) {\r\n    let { loop, volume } = options ? options : this.options\r\n    if (loop != null) this.setLoop(loop)\r\n    if (volume != null) this.setVolume(volume)\r\n  },\r\n  /**\r\n   * @param {object} options 分析器配置信息\r\n   */\r\n  initAnalyser(options) {\r\n    if (!options) return\r\n    if (typeof options === 'boolean' ||\r\n        typeof options === 'object' && options !== null) {\r\n      this.analyser = this.ctx.createAnalyser()\r\n      let size = options.size || 1024\r\n      this.analyser.fftSize = size\r\n      this.analyser.connect(this.gain)\r\n    } else {\r\n      throw new Error('expected parameter is boolean or object')\r\n    }\r\n  },\r\n  /**\r\n   * @description 获取解析的音频数据\r\n   */\r\n  getData() {\r\n    if (!this.analyser) return\r\n    let data = new Uint8Array(this.analyser.frequencyBinCount);\r\n    this.analyser.getByteFrequencyData(data);\r\n    return data\r\n  },\r\n  /**\r\n   * @description 获取当前播放的时刻，单位秒\r\n   */\r\n  getCurrentTime() {\r\n    return Math.min(this.ctx.currentTime - this.delta, this.duration)\r\n  },\r\n  /**\r\n   * @description 播放\r\n   */\r\n  play() {\r\n    if (this.firstPlay) this.start(0)\r\n    if (this.ctx.state === 'suspended') this.ctx.resume()\r\n    this.state = 'running'\r\n  },\r\n  /**\r\n   * @description 暂停\r\n   */\r\n  pause() {\r\n    if (this.ctx.state === 'running') {\r\n      this.ctx.suspend()\r\n      this.state = 'suspend'\r\n    }\r\n  },\r\n  /**\r\n   * @description 切换\r\n   */\r\n  toggle() {\r\n    this.state === 'running' ? this.pause() : this.play()\r\n  },\r\n  /**\r\n   * @param {number} offset 设置播放开始的偏移值\r\n   */\r\n  start(offset) {\r\n    if (typeof offset !== 'number') throw new Error('expected parameter is number type')\r\n    if (this.duration >= offset && offset >= 0) {\r\n      this.delta = this.ctx.currentTime - offset\r\n      if (!this.firstPlay) {\r\n        this.source.onended = null\r\n        this.source.stop()\r\n        this.initBufferSource(this.decodedData)\r\n      }\r\n      this.source.start(this.ctx.currentTime, offset)\r\n      this.state = 'running'\r\n      this.firstPlay = false\r\n      return\r\n    }\r\n    throw new Error(`value is out of range and expected range from 0 to ${this.duration}`)\r\n  },\r\n  /**\r\n   * @param {boolean} loop 设置歌曲是否循环\r\n   */\r\n  setLoop(loop) {\r\n    if (typeof loop !== 'boolean') throw new Error('expected parameter is boolean type')\r\n    this.source.loop = loop\r\n    this.loop = loop\r\n  },\r\n  /**\r\n   * @param {number} val 设置音量\r\n   */\r\n  setVolume(val=1) {\r\n    if (typeof val !== 'number') throw new Error('expected parameter is number type')\r\n    if (val >= 0 && val <= 1) {\r\n      this.gain.gain.value = val //** 2\r\n      this.volume = val\r\n      return\r\n    }\r\n    throw new Error('value is out of range and expected range from 0 to 1')\r\n  },\r\n}\n\n//# sourceURL=webpack://MPlayer/./src/index.js?");

/***/ })

/******/ });
});