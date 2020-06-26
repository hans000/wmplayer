interface IOptions {
    index?: number;
    auto?: boolean;
    fftSize?: number;
    volume?: number;
    loop?: boolean;
    cacheCount?: number;
    baseUrl?: string;
    request?: (options: IOptions) => ArrayBuffer
}

type EventType = 'load' | 'ended';
type PlayingState = 'suspended' | 'running';
type EventHandle = () => void;
interface ICacheItem {
    url: string;
    data: AudioBuffer;
}

const defaultOptions: IOptions = {
    auto: true,
    index: 0,
    fftSize: 256,
    loop: true,
    volume: 1,
    baseUrl: '',
}

function pathResolve(baseUrl: string, subUrl: string) {
    return baseUrl + subUrl.replace(/^[\.|\/]\/?/, '/')
}

export default class MPlayer {
    //#region 变量
    private options: IOptions;
    private playingState: PlayingState;
    private decodedData: AudioBuffer;
    private analyser: AnalyserNode;
    private urlList: string[] = [];
    private duration: number;

    private handle: { [name: string]: EventHandle[] };
    private delta = 0;
    private firstPlay = true;
    private ctx: AudioContext;
    private gain: GainNode;
    private source: any;
    private cache: ICacheItem[] = [];

    public onload: EventHandle;
    public onended: EventHandle;
    //#endregion

    constructor(resource: string | string[], options: IOptions = {}) {
        this.options = { ...defaultOptions, ...options }
        this.initParams()
        this.initSource(resource)
        this.initAnalyser()
    }
    private initParams() {
        this.handle = {}
        Object.defineProperty(this, '$options', {
            get() {
                return this.options
            }
        })
        this.ctx = new window.AudioContext()
        this.pause()
        this.gain = this.ctx.createGain()
        this.gain.connect(this.ctx.destination)
    }
    private initSource(resource: string | string[]) {
        if (typeof resource === 'string') {
            this.options.index = 0
            this.urlList.push(resource)
        } else if (Array.isArray(resource)) {
            this.urlList = resource
        } else {
            throw new Error('expected resource is string url or Array url')
        }
        this.initRequest()
    }
    private initRequest() {
        const resource = this.urlList[this.options.index]
        if (typeof resource !== 'string') {
            throw new Error('expected resource is string url')
        }
        if (this.options.request) {
            this.initDecode(this.options.request(this.options), resource)
            return;
        }
        this.request(resource).then(data => {
            this.initDecode(data, resource)
        }).catch(err => {
            console.error(err);
            this.playNext()
        })
    }
    private request(url: string) {
        return new Promise<ArrayBuffer>((resolve, reject) => {
            url = pathResolve(this.options.baseUrl, url)
            const xhr = new XMLHttpRequest()
            xhr.open('GET', url, true)
            xhr.responseType = 'arraybuffer'
            xhr.onreadystatechange = (e) => {
                e.preventDefault()
                const { status, readyState, statusText } = xhr
                if (readyState === 4) {
                    if (status >= 200 && status < 300 || status === 304) {
                        resolve(xhr.response)
                    } else {
                        reject(`status: ${status}, ${statusText}`)
                    }
                }
            }
            xhr.onerror = reject.bind(this, 'error')
            xhr.ontimeout = reject.bind(this, 'request timerout！')
            xhr.send()
        })
    }
    private pushCache(item: ICacheItem) {
        if (this.options.cacheCount === this.cache.length) {
            this.cache.shift()
        }
        this.cache.push(item)
    }
    private initDecode(data: ArrayBuffer, url?: string) {
        this.ctx.decodeAudioData(data).then(decodedData => {
            if (url) {
                this.pushCache({ url, data: decodedData })
            }
            this.initBufferSource(decodedData)
            this.options.auto && this.play()
            this.bindLoad()
        }).catch(err => {
            console.error(err);
        })
    }
    public on(type: EventType, fn: () => void) {
        this.handle[type] ? this.handle[type].push(fn) : this.handle[type] = [fn]
    }
    public off(type: EventType, fn: () => void) {
        fn ? this.handle[type] = this.handle[type].filter(e => e !== fn) : delete this.handle[type]
    }
    private emit(type: EventType) {
        this.handle[type] && this.handle[type].forEach(e => e())
    }
    public playPrev() {
        const len = this.urlList.length
        this.options.loop && !~--this.options.index && (this.options.index += len)
        this.reset()
    }
    public playNext() {
        const len = this.urlList.length
        this.options.loop && (this.options.index = ++this.options.index % len)
        this.reset()
    }
    public setUrlList(list: string[]) {
        if (!Array.isArray(list)) {
            console.warn('list expected string[]');
            return
        }
        this.urlList = list;
        this.options.index = 0;
        this.reset()
    }
    private bindLoad() {
        this.onload && this.onload()
        this.emit('load')
    }
    private bindEnded() {
        this.source.onended = () => {
            this.onended && this.onended()
            this.emit('ended')
        }
    }
    public setOptions(options: IOptions) {
        let { loop, volume } = options ? options : this.options
        if (loop != null) {
            this.setLoop(loop)
        }
        if (volume != null) {
            this.setVolume(volume)
        }
    }
    private initAnalyser() {
        const fftSize = this.options.fftSize
        if (typeof fftSize === 'number') {
            this.analyser = this.ctx.createAnalyser()
            const size = fftSize
            this.analyser.fftSize = size
            this.analyser.connect(this.gain)
        } else if (fftSize !== false) {
            console.warn('fftSize expected number');
        }
    }
    public reset() {
        if (this.source) {
            this.pause()
            this.firstPlay = true
            this.source.onended = null
            this.source.stop()
        }
        const url = this.urlList[this.options.index]
        const item = this.cache.find(v => v.url === url)
        if (item) {
            this.initBufferSource(item.data)
            this.options.auto && this.play()
            // this.bindLoad()
        } else {
            this.initRequest()
        }
    }
    public start(offset: number) {
        if (typeof offset !== 'number') {
            offset = 0
            console.warn('expected parameter is number type')
        }
        if (this.duration < offset || offset < 0) {
            offset = 0
            console.warn(`value is out of range, expected range from 0 to ${this.duration}`)
        }
        if (!this.source) {
            console.warn('using play method in onload');
            return;
        }
        this.delta = this.ctx.currentTime - offset
        if (!this.firstPlay) {
            this.source.onended = null
            this.source.stop()
            this.initBufferSource(this.decodedData)
        }
        this.source.start(this.ctx.currentTime, offset)
        this.playingState = 'running'
        this.firstPlay = false
    }
    private initBufferSource(decodedData: AudioBuffer) {
        this.source = this.ctx.createBufferSource()
        this.decodedData = decodedData
        this.source.buffer = this.decodedData
        this.duration = this.source.buffer.duration
        this.source.connect(this.analyser ? this.analyser : this.gain)
        this.bindEnded()
    }
    public getData(): Uint8Array {
        if (!this.analyser) {
            return null
        }
        const data = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(data);
        return data
    }
    public getCurrentTime() {
        return Math.min(this.ctx.currentTime - this.delta, this.duration)
    }
    public play() {
        if (this.firstPlay) {
            this.start(0)
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume()
        }
        this.playingState = 'running'  
    }
    public pause() {
        if (this.ctx.state === 'running') {
            this.ctx.suspend()
        }
        this.playingState = 'suspended'
    }
    public toggle() {
        this.playingState === 'running' ? this.pause() : this.play()
    }
    public setLoop(loopState: boolean) {
        if (typeof loopState !== 'boolean') {
            console.warn(`loopState expected boolean`)
        }
        this.source.loop = !!loopState
        this.options.loop = loopState
    } 
    public setVolume(val = 1) {
        if (typeof val !== 'number') {
            val = 1
            console.warn('val expect number')
        }
        if (val < 0 || val > 1) {
            val = 1
            console.warn('value is out of range and expected range from 0 to 1');
        }
        this.gain.gain.value = val ** 2
        this.options.volume = val
    }
}