<template type="text/html">
    <div class="audio-player">
        <div class="audio-freq">
            <svg class="player-control" @click="toggleState" xmlns="http://www.w3.org/2000/svg" version="1.1">
                <circle class="player-progress-slot" cx="50%" cy="50%" r="48" stroke-width="2px"
                        stroke="rgba(255,255,255,.3)"></circle>
                <circle class="player-progress-fill" transform="rotate(-90,50 50)" stroke-linecap="round"
                        :stroke-dasharray="l"
                        :stroke-dashoffset="p" cx="50%" cy="50%" r="48" stroke-width="2px"
                        stroke="rgba(255,255,255,.8)"></circle>
                <circle class="player-progress-dot" v-show="state!=stateMap.stop" :cx="cx" :cy="cy" r="3"></circle>
                <circle class="player-progress-dotbg" v-show="state!=stateMap.stop" :cx="cx" :cy="cy" r="6"></circle>
                <polygon class="player-control-play" v-show="state<=0" points="42,36 64,50 42,64"></polygon>
                <g class="player-control-pause" v-show="state>0">
                    <rect x="39" y="38" width="6" height="24"></rect>
                    <rect x="55" y="38" width="6" height="24"></rect>
                </g>
            </svg>
            <canvas ref="frequency" width="300px" height="200px"></canvas>
            <canvas ref="frequency_shadow" width="300px" height="200px"></canvas>
        </div>
        <div class="ap-mid">
            <div class="ap-playing-name">{{audioInfo.name | rmExt}}</div>
            <div class="ap-curve">
                <div class="ap-curve-progress" :style="{width:playProgressRate*300 +'px'}">
                    <canvas ref="curve" width="300px" height="30px"></canvas>
                </div>
                <canvas ref="curve_full" width="300px" height="30px"></canvas>
            </div>
            <div class="ap-btn-bar">
                <div class="ap-btn ap-btn-volume">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                              d="M1.2 5.2c-.6 0-1.2.4-1.2.9v3.7c0 .6.6 1 1.2 1H3l6.1 4V1.1L3 5.1H1.2zm10.8-3l-.4 1.2c1.8.6 3.3 2.5 3.3 4.6 0 2.1-1.4 4-3.3 4.7l.4 1.2c2.3-.9 4-3.2 4-5.8 0-2.8-1.7-5.1-4-5.9zM13.7 8c0-1.5-1-2.8-2.5-3.1l-.4 1.2c1 .1 1.8.9 1.8 1.9s-.8 1.8-1.7 1.8l.4 1.2c1.3-.2 2.4-1.5 2.4-3z"/>
                    </svg>
                </div>
                <div class="ap-btn ap-btn-volume-silent">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                        <path d="M4.3,5C3.7,5,3,5.4,3,6V10c0,0.7,0.7,1.1,1.3,1.1h2l6.7,4.4v-15L6.3,4.9C6.3,4.9,4.3,5,4.3,5z"/>
                    </svg>
                </div>
                <div class="ap-btn ap-btn-order">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                        <path d="M14.9 1.6H1.1C.5 1.6 0 2.1 0 2.7v8.5c0 .6.5 1.1 1.1 1.1h2.7c.3 0 .5-.4.5-.5v-1.1c0-.1-.2-.5-.5-.5h-1c-.4 0-.6-.3-.6-.6V4.4c0-.4.3-.6.6-.6h10.4c.4 0 .6.3.6.6v5.1c0 .4-.3.6-.6.6H9.6V8l-3.7 3.2 3.7 3.2v-2.1h5.3c.6 0 1.1-.5 1.1-1.1V2.7c0-.6-.5-1.1-1.1-1.1z"/>
                    </svg>
                </div>
                <div class="ap-btn ap-btn-random">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                        <path d="M.5 5.3h3.2l1.1 1.6L6.1 5l-1-1.5c-.3-.3-.7-.3-.9-.3H.5c-.3 0-.5.2-.5.5v1.1c0 .3.2.5.5.5zm11.8 5.4H10L8.9 9.1 7.6 11l1 1.4c.3.4.5.4 1.1.4h2.7v2.1l3.7-3.2-3.7-3.2v2.2zm0-5.4v2.1L16 4.3l-3.7-3.2v2.1H9.6c-.9 0-.9.2-1 .3l-4.9 7.2H.5c-.3 0-.5.2-.5.5v1.1c0 .3.2.5.5.5h3.7c.2 0 .6 0 .7-.2l5-7.2h2.4z"/>
                    </svg>
                </div>

                <div class="ap-btn" @click="list_visible=true">
                    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                        <path d="M133.31 296.552h757.207c19.782 0 35.951-16.169 35.951-35.95 0-19.782-15.997-35.952-35.95-35.952H133.31c-19.782 0-35.951 16.17-35.951 35.951 0 19.782 16.17 35.951 35.95 35.951zM890.517 476.135H133.311c-19.782 0-35.951 16.17-35.951 35.951 0 19.782 16.17 35.951 35.95 35.951h757.207c19.782 0 35.951-16.17 35.951-35.951 0-19.782-16.17-35.95-35.95-35.95zM890.517 727.448H133.311c-19.782 0-35.951 15.997-35.951 35.95s16.17 35.952 35.95 35.952h757.207c19.782 0 35.951-15.998 35.951-35.951s-16.17-35.951-35.95-35.951z"/>
                    </svg>
                </div>
            </div>
        </div>
        <transition name="fade">
        <div class="ap-list" v-show="list_visible">

            <div class="ap-list-head">
                <div class="ap-btn ap-btn-add">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                        <path d="M14.7,7H9V1.3C9,1.2,8.8,1,8.5,1h-1C7.3,1,7,1.2,7,1.3V7H1.3C1.2,7,1,7.2,1,7.5v1C1,8.8,1.2,9,1.3,9H7v5.5
	c0,0.2,0.3,0.3,0.6,0.4h1C8.8,15,9,14.8,9,14.7V9h5.6C14.8,9,15,8.8,15,8.5V7.5C15,7.2,14.8,7,14.7,7z"/>
                    </svg>
                    <input multiple type="file" @change="addAudio">
                </div>
                <div class="ap-btn" @click="list_visible=false">
                    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                        <path d="M890.335 330.911c-12.576-12.416-32.8-12.353-45.248.193L517.248 661.95 184.832 332.513c-12.576-12.448-32.8-12.353-45.28.192-12.448 12.577-12.354 32.832.192 45.281l353.311 350.112c.544.544 1.248.673 1.793 1.184.127.127.16.287.287.416a31.972 31.972 0 0 0 22.528 9.28c8.224 0 16.48-3.168 22.72-9.47l350.112-353.313c12.48-12.58 12.386-32.835-.16-45.284z"/>
                    </svg>
                </div>
            </div>
            <ul class="ap-list-box">
                <li class="ap-list-item" @click="start(audio)" v-for="audio in audioList">{{audio.name | rmExt}}
                    <div class="audio-info"><span
                            class="audio-played-time">{{playProgressRate * audioInfo.duration | toMinute}} / </span><span
                            class="audio-duration">{{audio.duration | toMinute}}</span></div>
                </li>
            </ul>
        </div>
        </transition>
    </div>
</template>
<script>

    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();


    export default{
        name: 'vue-music',
        data(){
            return {
                state: -1,
                stateMap: {
                    playing: 1,
                    pause: 0,
                    stop: -1
                },
                audioInfo: {
                    name: '点击 + 号添加本地音频',
                    duration: 0
                },
                playProgressRate: 0,
                playStartTime: 0,
                audioList: [],
                uid: 1,
                list_visible:false
            }
        },
        computed: {
            l(){
                return Math.PI * (100 - 4);
            },
            p(){
                if (this.playProgressRate !== undefined) {
                    return (1 - this.playProgressRate) * this.l;
                }
                return this.l;
            },
            cx(){
                return 50 + Math.sin(this.playProgressRate * 2 * Math.PI) * 48;
            },
            cy(){
                return 50 - Math.cos(this.playProgressRate * 2 * Math.PI) * 48;
            }
        },
        filters: {
            toMinute(v){
                var m = ~~(v / 60);
                var s = ~~(v % 60);
                return `${m}:${s < 10 ? '0' + s : s}`;
            },
            rmExt(v){
                var extStart = v.lastIndexOf('.');
                return extStart > -1 ? v.slice(0, extStart) : v;
            }
        },
        methods: {

            initRandomList() {
                var copyList = this.audioList.slice(0);
                var rdmArr = [];
                while (copyList.length > 0) {
                    var rdmIdx = Math.floor(Math.random() * copyList.length);
                    rdmArr.push(copyList.splice(rdmIdx, 1)[0]);
                }
                this.randomList = rdmArr;
            },

            toggleState(){

                switch (this.state) {

                    case this.stateMap.playing:
                        this.pause();
                        break;
                    case this.stateMap.pause:
                        this.play();
                        break;
                    case this.stateMap.stop:
                        if (this.audioList.length > 0) {
                            this.start(this.audioList[0]);
                        }
                        break;
                }
            },

            // 计算播放进度
            calcPlayProgressRate(){
                var _rate = (audioCtx.currentTime - this.playStartTime) / this.audioInfo.duration;
                if (_rate >= 1) {
                    this.playProgressRate = 1;
                } else {
                    this.playProgressRate = _rate;
                }
            },

            drawCurve(){
                var me = this;
                var getPeaks = function (length) {
                    var sampleSize = me.audioInfo.buffer.length / length;
                    var sampleStep = ~~(sampleSize / 10) || 1;
                    var channels = me.audioInfo.buffer.numberOfChannels;
                    var splitPeaks = [];
                    var mergedPeaks = [];

                    var mergedMaxPeak = 0;

                    for (var c = 0; c < channels; c++) {
                        var peaks = splitPeaks[c] = [];
                        var chan = me.audioInfo.buffer.getChannelData(c);
                        for (var i = 0; i < length; i++) {
                            var start = ~~(i * sampleSize);
                            var end = ~~(start + sampleSize);
                            var max = 0;
                            for (var j = start; j < end; j += sampleStep) {
                                var value = chan[j];
                                if (value > max) {
                                    max = value;
                                } else if (-value > max) {
                                    max = -value;
                                }
                            }
                            peaks[i] = max;

                            if (c == 0 || max > mergedPeaks[i]) {
                                mergedPeaks[i] = max;
                                if (max > mergedMaxPeak) mergedMaxPeak = max;
                            }
                        }
                    }

                    return {
                        mergedPeaks: mergedPeaks,
                        splitPeaks: splitPeaks,
                        mergedMaxPeak: mergedMaxPeak
                    };
                }


                var curve = me.$refs.curve;
                var curveFull = me.$refs.curve_full;

                var w = curve.width, h = curve.height;
                var curveCtx = curve.getContext('2d');
                var curveFullCtx = curveFull.getContext('2d');


                curveFullCtx.fillStyle = 'rgba(81, 164, 173,.3)';
                curveCtx.fillStyle = 'rgba(204, 204, 0,.4)';

                var peakNos = ~~(w / 1);
                var peak = getPeaks(peakNos);

                curveCtx.clearRect(0, 0, w, h);
                curveFullCtx.clearRect(0, 0, w, h);


                var part = h / peak.mergedMaxPeak;


                peak.mergedPeaks.forEach(function (item, i) {
                    var barHeight = ~~(item * part);
                    curveCtx.fillRect(i * 1, h - barHeight, 1, barHeight);
                    curveFullCtx.fillRect(i * 1, h - barHeight, 1, barHeight);
                })
            },

            drawFrequency(){


                var canvas = this.$refs.frequency;

                var reflection = this.$refs.frequency_shadow;

                var w = canvas.width;
                var h = canvas.height;

                var ctx = canvas.getContext('2d');

                var refCtx = reflection.getContext('2d');

                var gradient = ctx.createLinearGradient(0, 0, 0, h);
                gradient.addColorStop(1, 'rgba(224, 171, 184,0.4)');
                gradient.addColorStop(0, 'rgba(224, 171, 184,0.2)');

                var refGradient = ctx.createLinearGradient(0, 0, 0, h);
                refGradient.addColorStop(0, 'rgba(255, 255, 255,0.08)');
                refGradient.addColorStop(0.7, 'rgba(255, 255, 255,0)');

                ctx.fillStyle = gradient;
                refCtx.fillStyle = refGradient;

                // 小方块边长
                var blockSide = 8;

                // 小方块垂直间距
                var blockVGap = 1;

                // 小方块水平间距
                var blockHGap = 2;


                var arr = [];

                var me = this;

                function _draw() {


                    ctx.clearRect(0, 0, w, h);
                    refCtx.clearRect(0, 0, w, h);

                    me.analyser.getByteFrequencyData(me.array);

                    for (var i = 5; i < 30; i++) {
                        var barHeight = me.array[i] * h / 255;

                        var blockCount = ~~(barHeight / (blockSide + blockVGap));

                        var _x = i * (blockSide + blockHGap);

                        for (var j = 1; j < blockCount; j++) {
                            var _y = h - j * blockSide - (j - 1) * blockVGap;
                            var _yr = h - _y - blockSide;
                            ctx.fillRect(_x, _y, blockSide, blockSide);
                            refCtx.fillRect(_x, _yr, blockSide, blockSide);
                        }

                        var _hy = h - blockCount * blockSide - (blockCount - 1) * blockVGap;

                        if (arr[i] && (arr[i] + 1) < _hy) {
                            _hy = arr[i] + 1;
                        }
                        arr[i] = _hy;

                        var _hyr = h - _hy - blockSide;

                        ctx.fillRect(_x, _hy, blockSide, blockSide);
                        refCtx.fillRect(_x, _hyr, blockSide, blockSide);
                    }
                    me.calcPlayProgressRate();
                    if (me.playProgressRate < 1) {
                        requestAnimationFrame(_draw);
                    }
                }

                _draw();

            },
            addAudio(evt){
                Array.prototype.forEach.call(evt.target.files, file => {
                    file.uid = this.uid;
                    this.uid++;
                    this.audioList.push(file);
                });
                this.initRandomList();
            },
            initAudio(){

                var source = audioCtx.createBufferSource();
                source.connect(audioCtx.destination);

                var gainNode = audioCtx.createGain();
                // 上面创建的唱片机需要连接音量控制器
                source.connect(gainNode);
                // 音量控制和扬声器连接起来
                gainNode.connect(audioCtx.destination);
                // 音量大小控制
                gainNode.gain.value = 1;

                var analyser = audioCtx.createAnalyser();
                analyser.fftSize = 64;
                source.connect(analyser);
                analyser.connect(audioCtx.destination)
                this.analyser = analyser;
                this.source = source;
                this.array = new Uint8Array(analyser.frequencyBinCount);
            },
            // 暂停状态下继续播放
            play(){
                var playedDuration = this.playProgressRate * this.audioInfo.duration;
                this.initAudio();
                this.source.buffer = this.audioInfo.buffer;
                this.playStartTime = audioCtx.currentTime - playedDuration;
                this.source.start(0, playedDuration);
                this.state = this.stateMap.playing;
            },
            // 停止状态下开始播放
            start(audio){
                this.initAudio();
                var me = this;
                var fileReader = new FileReader();
                fileReader.onload = function (evt) {
                    var fileResult = evt.target.result;
                    audioCtx.decodeAudioData(fileResult, function (buffer) {
                        me.source.buffer = buffer;
                        me.audioInfo.buffer = buffer;
                        me.audioInfo.name = audio.name;
                        me.audioInfo.duration = audio.duration = buffer.duration;
                        me.source.start();
                        me.playStartTime = audioCtx.currentTime;
                        me.state = me.stateMap.playing;
                        me.drawFrequency();
                        me.drawCurve();
                    }, function () {
                    });
                };
                fileReader.readAsArrayBuffer(audio);
            },
            // 暂停播放
            pause(){
                this.state = this.stateMap.pause;
                this.source.stop(0);
            }
        }
    }
</script>
<style lang="stylus">

    $progress-height = 200px
    body
        background url(../images/music_bg.jpg) no-repeat center

    .audio-player
        position relative
        width 100%
        height 100%
        box-shadow rgba(0, 0, 0, .5) 0 0 50px
        background #483A47
        overflow hidden
        canvas
            display block

    .audio-freq
        position relative
        height 400px
        background: linear-gradient(to bottom, #483A47, #974C60, #483A47);

    .ap-mid
        position absolute
        left 0
        top 270px
        z-index: 1
        width 100%

    .ap-playing-name
        height 30px
        line-height 30px
        color rgba(255, 193, 208, .95)
        text-align: center
        font-size 12px

    .ap-btn-bar
        text-align center
        font-size 0

    .ap-btn
        display inline-block
        fill rgba(#fff, 20%)
        width 16px
        height 16px
        cursor pointer
        line-height 1
        margin 0 5px

    .ap-btn-add
        position relative
        overflow hidden
        input
            position absolute
            left 0
            top 0
            opacity 0
            width 100%
            height 100%
            cursor pointer
            &::-webkit-file-upload-button
                cursor pointer

    .ap-curve
        position relative
        background: rgba(0, 0, 0, .05)
        margin 20px 0

    .ap-curve-progress
        position absolute
        top 0
        left 0
        width 100%
        overflow hidden

    .player-list
        position absolute
        left 0
        top 0
        bottom 0
        width 200px
        background rgba(#000, 80%)

    .ap-list
        position absolute
        left 0
        bottom 0
        width 100%
        height 80%
        font-size 12px
        color rgba(#fff, 50%)
        background linear-gradient(145deg, #3a2e39, #573d4c, #3a2e39)
        z-index 1

    .ap-list-head
        padding 15px

    .ap-list-box
        margin: 0
        padding: 0
        list-style none

    .ap-list-item
        padding 10px
        background #423641
        &:nth-child(2n)
            background #483a47

    .audio-info
        float right
        color rgba(255, 193, 208, .95)

    .player-control
        position absolute
        width 120px
        height 120px
        top 50%
        left 50%
        margin-left -60px
        margin-top -60px
        padding: 10px
        cursor pointer

    .player-progress-slot
    .player-progress-fill
        fill rgba(255, 255, 255, .1);

    .player-progress-dot
        fill rgba(255, 255, 255, .8);

    .player-progress-dotbg
        fill rgba(255, 255, 255, .2);

    .player-control-play
    .player-control-pause
        fill rgba(255, 255, 255, .5)

    .fade-enter-active, .fade-leave-active {
        transition: bottom .2s
    }
    .fade-leave-active,
    .fade-enter {
        bottom -80%
    }


</style>
