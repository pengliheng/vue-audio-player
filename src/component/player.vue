<template>
    <div class="vui-player">
        <div class="music">
            <div class="album-box" v-el:album :class="albumCls">
                <div class="play" v-if="ready && showPlay" @click="play()"></div>
                <div class="pause" v-if="ready && showPause" @click="pause()"></div>
                <div class="album-cover" :style="{backgroundImage:'url('+playing_song.cover+')'}">
                </div>
            </div>
            <div class="music-info">
                <div class="music-name">
                    <span v-if="ready">{{playing_song.name}}</span>
                    <span v-if="!ready">Loading...</span>
                </div>
                <div class="music-author">
                    <span v-if="ready">{{playing_song.singer}}</span>
                </div>
                <canvas v-el:melody width="240" height="30"></canvas>
            </div>
        </div>
        <ul class="vui-player-control">
            <li class="split"></li>
            <li class="ctrl volume"><i></i></li>
            <li class="ctrl volume-range" @click="changeVolume()"><em class="volume-move" v-el:volume></em></li>
            <li class="split"></li>
            <li class="ctrl play-list"><i @click="showPlayList()"></i>
                <div class="play-list-box" v-show="show_play_list">
                    <table>
                        <tr :class="{playing:playing_song.id==song.id}" v-for="song in play_list">
                            <td>{{song.name}}</td>
                            <td>{{song.singer}}</td>
                            <td>{{song.duration}}</td>
                            <td>
                                <div class="list-item-play" v-if="playing_song.id!=song.id"
                                     @click="_loadSong(song,true)"></div>
                            </td>
                        </tr>
                    </table>
                </div>
            </li>
            <li class="split"></li>
        </ul>

        <div class="vui-player-progress">
            <div class="vui-player-bar" @click="move()">
                <canvas v-el:progress_full width="{{barWidth}}" height="100"></canvas>
                <div class="play-progress" v-el:progress>
                    <canvas v-el:progress_current width="{{barWidth}}" height="100"></canvas>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="less">
    .vui-player {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .vui-player-progress {
            position: absolute;
            left: 0;
            height: 100px;
            width: 100%;
            bottom: 0;
            z-index: 1;
            background: fade(#51a4ad, 10%);
        }
        .vui-player-bar {
            position: relative;
            display: table;
            margin: 0 auto;
            background: fade(#51a4ad, 10%);
            canvas {
                display: block;
            }
        }
        .vui-player-control {
            position: absolute;
            z-index: 3;
            bottom: 110px;
            width: 500px;
            height: 30px;
            left: 50%;
            margin-left: -250px;
            background: rgba(0, 0, 0, .5);
            border-radius: 15px;
            font-size: 0;
            text-align: center;
            user-select: none;
            box-shadow: 0 0 3px fade(#ff0, 40%);
            > .ctrl {
                display: inline-block;
                width: 30px;
                height: 30px;
                i {
                    cursor: pointer;
                    display: block;
                    width: 100%;
                    height: 100%;
                }
            }
            .split {
                display: inline-block;
                width: 1px;
                height: 30px;
                background: rgba(255, 255, 255, .2);
            }
            .play-list {
                margin: 0 10px;
                i {
                    background: url('../images/player_list.svg') no-repeat center center;
                }
            }
            .volume {
                width: 26px;
                i {
                    background: url('../images/player_volume.svg') no-repeat right center;
                }
            }

            .volume-range {
                width: 120px;
                padding: 0 10px;
                margin-right: 10px;
                position: relative;
                cursor: pointer;
                &:before,
                .volume-move:before {
                    display: block;
                    content: '';
                    width: 100px;
                    height: 2px;
                    margin-top: 14px;
                    background: rgba(255, 255, 255, .2);
                    border-radius: 1px;
                }
                .volume-move {
                    position: absolute;
                    left: 10px;
                    top: 0;
                    width: 50px;
                    overflow: hidden;
                    &:before {
                        background: rgba(255, 255, 255, .5);
                    }
                }
            }

            .play-list-box {
                position: absolute;
                width: 100%;
                bottom: 42px;
                left: 0;
                background: rgba(0, 0, 0, .7);
                border-radius: 5px;
                box-shadow: 0 0 3px fade(#ff0, 40%);
                padding: 10px;
                table {
                    width: 100%;
                    table-layout: fixed;
                    border-spacing: 0;
                }
                td {
                    text-align: left;
                    padding: 0;
                    height: 40px;
                    font-size: 13px;
                    color: rgba(255, 255, 255, .5);
                }
                tr:hover {
                    td {
                        color: rgba(255, 255, 255, .8);
                    }
                }
                td:nth-child(1) {
                    width: 50%;
                    padding-left: 20px;
                }
                td:nth-child(3) {
                    width: 50px;
                }
                td:nth-child(4) {
                    width: 40px;
                    vertical-align: top;
                }
                .list-item-play {
                    cursor: pointer;
                    width: 100%;
                    height: 38px;
                    background: url("../images/player_play.svg") no-repeat 50% 50%;
                    background-size: 12px;
                }
                .playing {
                    td {
                        color: rgba(255, 255, 255, .8);
                    }
                }
            }
        }

        .play-progress {
            position: absolute;
            top: 0;
            left: 0;
            width: 0;
            height: 100px;
            background: fade(#cc0, 20%);
            overflow: hidden;
        }

        .music {
            position: relative;
            top: 50%;
            margin-top: -150px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .music-info {
            margin-left: 20px;
            width: 300px;
        }
        .music-name {
            font-size: 24px;
            color: fade(#fff, 90%);
            font-weight: bold;
        }
        .music-author {
            font-size: 15px;
            font-weight: bold;
            color: fade(#fff, 50%);
        }

        .album-box {
            position: relative;
            width: 200px;
            height: 200px;
            padding: 8px;
            border-radius: 50%;
            background-color: fade(#000, 40%);
        }

        .play,
        .pause {
            width: 50px;
            height: 50px;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            z-index: 2;
            border-radius: 50%;
            background: url("../images/player_play.svg") no-repeat 50% center;
            background-color: rgba(0, 0, 0, .6);
        }

        .pause {
            background-image: url("../images/player_pause.svg");
        }

        .album-cover {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-repeat: no-repeat;
            background-position: center center;
            background-size: cover;
        }
        .state-playing .album-cover {
            animation: xz 10s linear infinite;
        }
        .state-pause .album-cover {
            animation-play-state: paused;
        }

        @keyframes xz {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }
    }
</style>
<script>

    import Api from '../common/api';

    export default{
        data(){
            return {
                audioContext: null,
                buffer: null,
                audioBufferSourceNode: null,
                ready: false,
                startTime: 0,
                stopTime: 0,
                volume: 0,
                gainNode: null,
                analyser: null,
                duration: 0,
                state: '',
                playedDuration: 0,
                xhr: null,

                playing_song: {},
                show_play_list: false,
                play_list: [{
                    id: 11,
                    url: '/music/Between_The_Raindrops.mp3',
                    cover: '//qinshenxue.com/music/Between_The_Raindrops.jpg',
                    singer: 'Lifehouse',
                    duration: '04:46',
                    name: 'Between The Raindrops'
                }, {
                    id: 22,
                    url: '/music/Free_Loop.mp3',
                    cover: '//qinshenxue.com/music/Free_Loop.jpg',
                    singer: 'Daniel Powter',
                    duration: '03:45',
                    name: 'Free Loop'
                }]
            }
        },

        components: {},
        computed: {
            barWidth: function () {
                return 1000;
            },
            showPause: function () {
                return this.state == 'playing';
            },
            showPlay: function () {
                return this.state != 'playing';
            },
            albumCls: function () {
                if (this.state == 'playing') {
                    return 'state-playing';
                } else if (this.state == 'pause') {
                    return 'state-playing state-pause';
                }
            }
        },
        events: {
            destroy: function () {
                this.destroy();
            }
        },
        ready(){

            var AC = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;

            this.xhr = new XMLHttpRequest();
            this.xhr.responseType = 'arraybuffer';
            this.audioContext = new AC();
            this.gainNode = this.audioContext.createGain();
            this._loadSong(this.play_list[0]);


        },
        methods: {
            _loadSong: function (song, playAfterLoaded) {
                var me = this;
                me.ready = false;
                me.state = '';
                me.stop();
                me._clearPeaks();
                me.playing_song = song;
                me.playedDuration = 0;

                if (song.buffer) {
                    me.$nextTick(function () {
                        me.buffer = song.buffer;
                        me.ready = true;
                        me.duration = song.buffer.duration;
                        me._drawPeaks(function () {
                            if (playAfterLoaded) {
                                me.play();
                            }
                        });
                    })
                } else {
                    this.xhr.open('GET', song.url, true);
                    this.xhr.onload = function () {
                        me.audioContext.decodeAudioData(this.response, function (_buffer) {
                            me.buffer = _buffer;
                            me.ready = true;
                            song.buffer = _buffer;
                            me.duration = _buffer.duration;
                            me._drawPeaks(function () {
                                if (playAfterLoaded) {
                                    me.play();
                                }
                            });
                        })
                    };
                    this.xhr.send();
                }

            },

            _drawPeaks(callback){
                var me = this;
                var getPeaks = function (length) {
                    var sampleSize = me.buffer.length / length;
                    var sampleStep = ~~(sampleSize / 10) || 1;
                    var channels = me.buffer.numberOfChannels;
                    var splitPeaks = [];
                    var mergedPeaks = [];

                    var mergedMaxPeak = 0;

                    for (var c = 0; c < channels; c++) {
                        var peaks = splitPeaks[c] = [];
                        var chan = me.buffer.getChannelData(c);
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


                var full = me.$els.progress_full;
                var current = me.$els.progress_current;
                if (!(full && current)) {
                    return;
                }
                var fullW = full.width, fullH = full.height;
                var fullCtx = full.getContext('2d');
                var currentCtx = current.getContext('2d');

                fullCtx.fillStyle = '#51a4ad';
                currentCtx.fillStyle = '#cc0';

                var peakNos = ~~(current.width / 3);
                var peak = getPeaks(peakNos);

                fullCtx.clearRect(0, 0, fullW, fullH);
                currentCtx.clearRect(0, 0, fullW, fullH);

                var top = 10;

                var part = ( fullH - top) / peak.mergedMaxPeak;


                peak.mergedPeaks.forEach(function (item, i) {
                    var barHeight = ~~(item * part);
                    fullCtx.fillRect(i * 3, fullH - barHeight, 2, barHeight);
                    currentCtx.fillRect(i * 3, fullH - barHeight, 2, barHeight);
                })
                if (callback) {
                    callback();
                }

            },

            _clearPeaks(){
                var full = this.$els.progress_full;
                var current = this.$els.progress_current;
                var fullW = full.width, fullH = full.height;
                var fullCtx = full.getContext('2d');
                var currentCtx = current.getContext('2d');
                fullCtx.clearRect(0, 0, fullW, fullH);
                currentCtx.clearRect(0, 0, fullW, fullH);
            },

            destroy(){

                if (this.audioBufferSourceNode) {
                    this.audioBufferSourceNode.disconnect();
                }
                this.audioContext.close();
                if (this.xhr) {
                    this.xhr.abort();
                }
                this.stop();

            },
            move(){

                var startTime = this.$event.offsetX / this.barWidth * this.duration;
                this.stop();


                this.playedDuration = startTime;

                this.$els.progress.style.width = this.$event.offsetX * 100 / this.barWidth + '%';

                if (this.state == 'playing') {
                    this.play();
                }
            },

            drawFrequencyData(){

                var bufferLength = this.analyser.frequencyBinCount;
                var canvas = this.$els.melody;
                var me = this;
                var w = canvas.width, h = canvas.height;
                var ctx = canvas.getContext('2d');
                var gradient = ctx.createLinearGradient(0, 0, 0, h);
                gradient.addColorStop(1, 'rgba(255,255,255,.4)');
                gradient.addColorStop(0, 'rgba(255,255,255,.8)');
                ctx.fillStyle = gradient;

                function draw() {
                    var dataArray = new Uint8Array(bufferLength);
                    me.analyser.getByteFrequencyData(dataArray);
                    ctx.clearRect(0, 0, w, h);
                    for (var i = 10; i < 25; i++) {
                        var barHeight = ~~(dataArray[i] * h / 255);
                        ctx.fillRect((i - 10) * 6, h - barHeight, 5, barHeight);
                    }
                    if (me.state == 'playing') {
                        requestAnimationFrame(draw);
                    } else {
                        ctx.clearRect(0, 0, w, h);
                    }
                }

                draw();
            },
            drawProgress(){

                var me = this;

                var prog = me.$els.progress;


                cancelAnimationFrame(me.animationId);

                function draw() {
                    me.playedDuration = me.audioContext.currentTime - me.startTime;
                    var p = me.playedDuration / me.duration * 100;

                    prog.style.width = p + '%';
                    if (p <= 100 && me.state == 'playing') {
                        me.animationId = requestAnimationFrame(draw);
                    } else {
                        me.state = '';
                        me.playedDuration = 0;
                        prog.style.width = 0;
                    }
                }

                draw();
            },
            play(){
                this.audioBufferSourceNode && this.audioBufferSourceNode.disconnect();
                this.audioBufferSourceNode = this.audioContext.createBufferSource();

                this.analyser = this.audioContext.createAnalyser();


                this.audioBufferSourceNode.connect(this.audioContext.destination);

                this.audioBufferSourceNode.connect(this.gainNode);
                this.gainNode.connect(this.audioContext.destination);

                this.gainNode.gain.value = this.volume;

                this.audioBufferSourceNode.connect(this.analyser);
                this.analyser.connect(this.audioContext.destination);
                this.analyser.fftSize = 64;

                this.audioBufferSourceNode.buffer = this.buffer;

                this.audioBufferSourceNode.start(0, this.playedDuration);
                this.state = 'playing';

                this.startTime = this.audioContext.currentTime - this.playedDuration;

                this.drawProgress();
                this.drawFrequencyData();
            },
            pause(){
                this.state = 'pause';
                this.stop();
                cancelAnimationFrame(this.animationId);
            },
            stop(){
                if (this.audioBufferSourceNode) {
                    this.audioBufferSourceNode.stop(0);
                }
            },
            changeVolume(){
                var volumeEl = this.$els.volume;
                var offsetX = this.$event.offsetX;
                var percent = 0;
                if (offsetX < 10) {
                    this.volume = -2;
                } else if (offsetX > 110) {
                    percent = 1;
                    this.volume = 2;
                } else {
                    percent = (offsetX - 10) / 100;
                    this.volume = 4 * percent - 2;
                }
                volumeEl.style.width = percent * 100 + 'px';
                this.gainNode.gain.value = this.volume;
            },

            showPlayList(){
                this.show_play_list = !this.show_play_list;
            }
        }
    }
</script>
