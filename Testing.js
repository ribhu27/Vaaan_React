import React, { useEffect } from "react";
import Mpegts from "mpegts.js";

export default function Testing() {
    const config = {
        liveBufferLatencyChasing : true,
        liveBufferLatencyChasingOnPaused: true,
        // enableStashBuffer: false,
        liveBufferLatencyMaxLatency: 0.6,  //0.4
        liveBufferLatencyMinRemain: 0.55,  //0.2
        liveSync: true,
        // liveSyncTargetLatency: 0.2,
        // liveSyncMaxLatency: 0.5,
        // liveSyncPlaybackRate: 2,
        enableWorker: true,
        deferLoadAfterSourceOpen: false,
        // enableWorkerForMSE: true
        autoCleanupSourceBuffer: true,
        autoCleanupMaxBackwardDuration: 10,
        autoCleanupMinBackwardDuration: 5,


    }

    useEffect(()=>{


        try{
            

            
            if (Mpegts.getFeatureList().nativeMP4H264Playback) {
            var videoElement = document.getElementById('1');
            videoElement.addEventListener('error', () => {
                console.log('Error code: ' + JSON.stringify(videoElement.error));
//                console.log('Error message: ' + videoElement.error.message);
              });
            var player = Mpegts.createPlayer({
                type: 'mpegts',  // could also be mpegts, m2ts, flv
                isLive: true,
                // url: 'http://192.168.10.88:3001/cam1'
                url: 'ws://192.168.10.88:7071/Camera-1'

            },config);
            player.attachMediaElement(videoElement);
            player.load();
            player.play();
            player.on("error", (e)=>{})

        }

        if (Mpegts.getFeatureList().nativeMP4H264Playback) {
            var videoElement = document.getElementById('4');
            videoElement.addEventListener('error', () => {
                console.log('Error code: ' + JSON.stringify(videoElement.error));
//                console.log('Error message: ' + videoElement.error.message);
              });
            var player = Mpegts.createPlayer({
                type: 'mpegts',  // could also be mpegts, m2ts, flv
                isLive: true,
                url: 'ws://192.168.10.88:7071/Camera-4'
            }, config);
            player.attachMediaElement(videoElement);
            player.load();
            player.play();
            player.on("error", (e)=>{})

        }

        if (Mpegts.getFeatureList().nativeMP4H264Playback) {
            var videoElement = document.getElementById('3');
            videoElement.addEventListener('error', () => {
                console.log('Error code: ' + JSON.stringify(videoElement.error));
//                console.log('Error message: ' + videoElement.error.message);
              });
            var player = Mpegts.createPlayer({
                type: 'mpegts',  // could also be mpegts, m2ts, flv
                isLive: true,
                // url: 'http://192.168.10.88:3001/cam3'
                url: 'ws://192.168.10.88:7071/Camera-3'

            }, config);
            player.attachMediaElement(videoElement);
            player.load();
            player.play();
            player.on("error", (e)=>{})

        }


        
        if (Mpegts.getFeatureList().nativeMP4H264Playback) {
            var videoElement = document.getElementById('2');
            videoElement.addEventListener('error', () => {
                console.log('Error code: ' + JSON.stringify(videoElement.error));
//                console.log('Error message: ' + videoElement.error.message);
              });
            var player = Mpegts.createPlayer({
                type: 'mpegts',  // could also be mpegts, m2ts, flv
                isLive: true,
                // url: 'http://192.168.10.88:3001/cam2'
                url: 'ws://192.168.10.88:7071/Camera-2'

            }, config);
            player.attachMediaElement(videoElement);
            player.load();
            player.play();
            player.on("error", (e)=>{})

        }
        if (Mpegts.getFeatureList().nativeMP4H264Playback) {
            var videoElement = document.getElementById('5');
            videoElement.addEventListener('error', () => {
                console.log('Error code: ' + JSON.stringify(videoElement.error));
//                console.log('Error message: ' + videoElement.error.message);
              });
            var player = Mpegts.createPlayer({
                type: 'mpegts',  // could also be mpegts, m2ts, flv
                isLive: true,
                // url: 'http://192.168.10.88:3001/cam5'
                url: 'ws://192.168.10.88:7071/Camera-5'

            }, config);
            player.attachMediaElement(videoElement);
            player.load();
            player.play();
            player.on("error", (e)=>{})

        }
        if (Mpegts.getFeatureList().nativeMP4H264Playback) {
            var videoElement = document.getElementById('6');
            videoElement.addEventListener('error', () => {
                console.log('Error code: ' + JSON.stringify(videoElement.error));
//                console.log('Error message: ' + videoElement.error.message);
              });
            var player = Mpegts.createPlayer({
                type: 'mpegts',  // could also be mpegts, m2ts, flv
                isLive: true,
                // url: 'http://192.168.10.88:3001/cam6'
                url: 'ws://192.168.10.88:7071/Camera-6'

            }, config);
            player.attachMediaElement(videoElement);
            player.load();
            player.play();
            player.on("error", (e)=>{})

        }
        if (Mpegts.getFeatureList().nativeMP4H264Playback) {
            var videoElement = document.getElementById('7');
            videoElement.addEventListener('error', () => {
                console.log('Error code: ' + JSON.stringify(videoElement.error));
//                console.log('Error message: ' + videoElement.error.message);
              });
            var player = Mpegts.createPlayer({
                type: 'mpegts',  // could also be mpegts, m2ts, flv
                isLive: true,
                // url: 'http://192.168.10.88:3001/cam7'
                url: 'ws://192.168.10.88:7071/Camera-7'
                
            }, config);
            player.attachMediaElement(videoElement);
            player.load();
            player.play();
            player.on("error", (e)=>{})

        }
        if (Mpegts.getFeatureList().nativeMP4H264Playback) {
            var videoElement = document.getElementById('8');
            videoElement.addEventListener('error', () => {
                console.log('Error code: ' + JSON.stringify(videoElement.error));
//                console.log('Error message: ' + videoElement.error.message);
              });
            var player = Mpegts.createPlayer({
                type: 'mpegts',  // could also be mpegts, m2ts, flv
                isLive: true,
                // url: 'http://192.168.10.88:3001/cam8'
                url: 'ws://192.168.10.88:7071/Norden'

            }, config);
            player.attachMediaElement(videoElement);
            player.load();
            player.play();
            player.on("error", (e)=>{})

        }
        if (Mpegts.getFeatureList().nativeMP4H264Playback) {
            var videoElement = document.getElementById('9');
            videoElement.addEventListener('error', () => {
                console.log('Error code: ' + JSON.stringify(videoElement.error));
//                console.log('Error message: ' + videoElement.error.message);
              });
            var player = Mpegts.createPlayer({
                type: 'mpegts',  // could also be mpegts, m2ts, flv
                isLive: true,
                // url: 'http://192.168.10.88:3001/cam9'
                url: 'ws://192.168.10.88:7071/Camera-9'
                
            }, config);
            player.attachMediaElement(videoElement);
            player.load();
            player.play();
            player.on("error", (e)=>{})

        }
        if (Mpegts.getFeatureList().nativeMP4H264Playback) {
            var videoElement = document.getElementById('10');
            videoElement.addEventListener('error', () => {
                console.log('Error code: ' + JSON.stringify(videoElement.error));
//                console.log('Error message: ' + videoElement.error.message);
              });
            var player = Mpegts.createPlayer({
                type: 'mpegts',  // could also be mpegts, m2ts, flv
                isLive: true,
                url: 'http://localhost:3002/cam10'
            }, config);
            player.attachMediaElement(videoElement);
            player.load();
            player.play();
            player.on("error", (e)=>{})

        }
        if (Mpegts.getFeatureList().nativeMP4H264Playback) {
            var videoElement = document.getElementById('11');
            videoElement.addEventListener('error', () => {
                console.log('Error code: ' + JSON.stringify(videoElement.error));
//                console.log('Error message: ' + videoElement.error.message);
              });
            var player = Mpegts.createPlayer({
                type: 'mpegts',  // could also be mpegts, m2ts, flv
                isLive: true,
                url: 'http://localhost:3002/cam11'
            }, config);
            player.attachMediaElement(videoElement);
            player.load();
            player.play();
            player.on("error", (e)=>{})

        }
        if (Mpegts.getFeatureList().nativeMP4H264Playback) {
            var videoElement = document.getElementById('12');
            videoElement.addEventListener('error', () => {
                console.log('Error code: ' + JSON.stringify(videoElement.error));
//                console.log('Error message: ' + videoElement.error.message);
              });
            var player = Mpegts.createPlayer({
                type: 'mpegts',  // could also be mpegts, m2ts, flv
                isLive: true,
                url: 'http://localhost:3002/cam12'
            }, config);
            player.attachMediaElement(videoElement);
            player.load();
            player.play();
            player.on("error", (e)=>{})

        }
        if (Mpegts.getFeatureList().nativeMP4H264Playback) {
            var videoElement = document.getElementById('13');
            videoElement.addEventListener('error', () => {
                console.log('Error code: ' + JSON.stringify(videoElement.error));
//                console.log('Error message: ' + videoElement.error.message);
              });
            var player = Mpegts.createPlayer({
                type: 'mpegts',  // could also be mpegts, m2ts, flv
                isLive: true,
                url: 'http://localhost:3003/cam13'
            }, config);
            player.attachMediaElement(videoElement);
            player.load();
            player.play();
            player.on("error", (e)=>{})

        }
        if (Mpegts.getFeatureList().nativeMP4H264Playback) {
            var videoElement = document.getElementById('14');
            videoElement.addEventListener('error', () => {
                console.log('Error code: ' + JSON.stringify(videoElement.error));
//                console.log('Error message: ' + videoElement.error.message);
              });
            var player = Mpegts.createPlayer({
                type: 'mpegts',  // could also be mpegts, m2ts, flv
                isLive: true,
                url: 'http://localhost:3003/cam14'
            }, config);
            player.attachMediaElement(videoElement);
            player.load();
            player.play();
            player.on("error", (e)=>{})

        }
        if (Mpegts.getFeatureList().nativeMP4H264Playback) {
            var videoElement = document.getElementById('15');
            videoElement.addEventListener('error', () => {
                console.log('Error code: ' + JSON.stringify(videoElement.error));
//                console.log('Error message: ' + videoElement.error.message);
              });
            var player = Mpegts.createPlayer({
                type: 'mpegts',  // could also be mpegts, m2ts, flv
                isLive: true,
                url: 'http://localhost:3003/cam15'
            }, config);
            player.attachMediaElement(videoElement);
            player.load();
            player.play();
            player.on("error", (e)=>{})

        }
        if (Mpegts.getFeatureList().nativeMP4H264Playback) {
            var videoElement = document.getElementById('16');
            videoElement.addEventListener('error', () => {
                console.log('Error code: ' + JSON.stringify(videoElement.error));
//                console.log('Error message: ' + videoElement.error.message);
              });
            var player = Mpegts.createPlayer({
                type: 'mpegts',  // could also be mpegts, m2ts, flv
                isLive: true,
                url: 'http://localhost:3003/cam16'
            }, config);
            player.attachMediaElement(videoElement);
            player.load();
            player.play();
            player.on("error", (e)=>{})

        }
        if (Mpegts.getFeatureList().nativeMP4H264Playback) {
            var videoElement = document.getElementById('17');
            videoElement.addEventListener('error', () => {
                console.log('Error code: ' + JSON.stringify(videoElement.error));
//                console.log('Error message: ' + videoElement.error.message);
              });
            var player = Mpegts.createPlayer({
                type: 'mpegts',  // could also be mpegts, m2ts, flv
                isLive: true,
                url: 'http://localhost:3003/cam17'
            }, config);
            player.attachMediaElement(videoElement);
            player.load();
            player.play();
            player.on("error", (e)=>{})

        }
        if (Mpegts.getFeatureList().nativeMP4H264Playback) {
            var videoElement = document.getElementById('18');
            videoElement.addEventListener('error', () => {
                console.log('Error code: ' + JSON.stringify(videoElement.error));
//                console.log('Error message: ' + videoElement.error.message);
              });
            var player = Mpegts.createPlayer({
                type: 'mpegts',  // could also be mpegts, m2ts, flv
                isLive: true,
                url: 'http://localhost:3003/cam18'
            }, config);
            player.attachMediaElement(videoElement);
            player.load();
            player.play();
            player.on("error", (e)=>{})
        }
        
    }catch(e){
        console.log(e)
    }

        // if (Mpegts.getFeatureList().nativeMP4H264Playback) {
        //     var videoElement = document.getElementById('19');
        //     var player = Mpegts.createPlayer({
        //         type: 'mpegts',  // could also be mpegts, m2ts, flv
        //         isLive: true,
        //         url: 'http://localhost:3004/cam19'
        //     });
        //     player.attachMediaElement(videoElement);
        //     player.load();
        //     player.play();
        // }
        // if (Mpegts.getFeatureList().nativeMP4H264Playback) {
        //     var videoElement = document.getElementById('20');
        //     var player = Mpegts.createPlayer({
        //         type: 'mpegts',  // could also be mpegts, m2ts, flv
        //         isLive: true,
        //         url: 'http://localhost:3004/cam20'
        //     });
        //     player.attachMediaElement(videoElement);
        //     player.load();
        //     player.play();
        // }
        // if (Mpegts.getFeatureList().nativeMP4H264Playback) {
        //     var videoElement = document.getElementById('21');
        //     var player = Mpegts.createPlayer({
        //         type: 'mpegts',  // could also be mpegts, m2ts, flv
        //         isLive: true,
        //         url: 'http://localhost:3004/cam21'
        //     });
        //     player.attachMediaElement(videoElement);
        //     player.load();
        //     player.play();
        // }
        // if (Mpegts.getFeatureList().nativeMP4H264Playback) {
        //     var videoElement = document.getElementById('22');
        //     var player = Mpegts.createPlayer({
        //         type: 'mpegts',  // could also be mpegts, m2ts, flv
        //         isLive: true,
        //         url: 'http://localhost:3004/cam22'
        //     });
        //     player.attachMediaElement(videoElement);
        //     player.load();
        //     player.play();
        // }
        // if (Mpegts.getFeatureList().nativeMP4H264Playback) {
        //     var videoElement = document.getElementById('23');
        //     var player = Mpegts.createPlayer({
        //         type: 'mpegts',  // could also be mpegts, m2ts, flv
        //         isLive: true,
        //         url: 'http://localhost:3004/cam23'
        //     });
        //     player.attachMediaElement(videoElement);
        //     player.load();
        //     player.play();
        // }
        // if (Mpegts.getFeatureList().nativeMP4H264Playback) {
        //     var videoElement = document.getElementById('24');
        //     var player = Mpegts.createPlayer({
        //         type: 'mpegts',  // could also be mpegts, m2ts, flv
        //         isLive: true,
        //         url: 'http://localhost:3004/cam24'
        //     });
        //     player.attachMediaElement(videoElement);
        //     player.load();
        //     player.play();
        // }
        // if (Mpegts.getFeatureList().nativeMP4H264Playback) {
        //     var videoElement = document.getElementById('25');
        //     var player = Mpegts.createPlayer({
        //         type: 'mpegts',  // could also be mpegts, m2ts, flv
        //         isLive: true,
        //         url: 'http://192.168.10.88:3001/cam25'
        //     });
        //     player.attachMediaElement(videoElement);
        //     player.load();
        //     player.play();
        // }
        // if (Mpegts.getFeatureList().nativeMP4H264Playback) {
        //     var videoElement = document.getElementById('26');
        //     var player = Mpegts.createPlayer({
        //         type: 'mpegts',  // could also be mpegts, m2ts, flv
        //         isLive: true,
        //         url: 'http://192.168.10.88:3001/cam26'
        //     });
        //     player.attachMediaElement(videoElement);
        //     player.load();
        //     player.play();
        // }
        // if (Mpegts.getFeatureList().nativeMP4H264Playback) {
        //     var videoElement = document.getElementById('27');
        //     var player = Mpegts.createPlayer({
        //         type: 'mpegts',  // could also be mpegts, m2ts, flv
        //         isLive: true,
        //         url: 'http://192.168.10.88:3001/cam27'
        //     });
        //     player.attachMediaElement(videoElement);
        //     player.load();
        //     player.play();
        // }
        // if (Mpegts.getFeatureList().nativeMP4H264Playback) {
        //     var videoElement = document.getElementById('28');
        //     var player = Mpegts.createPlayer({
        //         type: 'mpegts',  // could also be mpegts, m2ts, flv
        //         isLive: true,
        //         url: 'http://192.168.10.88:3001/cam28'
        //     });
        //     player.attachMediaElement(videoElement);
        //     player.load();
        //     player.play();
        // }
        // if (Mpegts.getFeatureList().nativeMP4H264Playback) {
        //     var videoElement = document.getElementById('29');
        //     var player = Mpegts.createPlayer({
        //         type: 'mpegts',  // could also be mpegts, m2ts, flv
        //         isLive: true,
        //         url: 'http://192.168.10.88:3001/cam29'
        //     });
        //     player.attachMediaElement(videoElement);
        //     player.load();
        //     player.play();
        // }
        // if (Mpegts.getFeatureList().nativeMP4H264Playback) {
        //     var videoElement = document.getElementById('30');
        //     var player = Mpegts.createPlayer({
        //         type: 'mpegts',  // could also be mpegts, m2ts, flv
        //         isLive: true,
        //         url: 'http://192.168.10.88:3001/cam30'
        //     });
        //     player.attachMediaElement(videoElement);
        //     player.load();
        //     player.play();
        // }
        // if (Mpegts.getFeatureList().nativeMP4H264Playback) {
        //     var videoElement = document.getElementById('31');
        //     var player = Mpegts.createPlayer({
        //         type: 'mpegts',  // could also be mpegts, m2ts, flv
        //         isLive: true,
        //         url: 'http://192.168.10.88:3001/cam31'
        //     });
        //     player.attachMediaElement(videoElement);
        //     player.load();
        //     player.play();
        // }
        // if (Mpegts.getFeatureList().nativeMP4H264Playback) {
        //     var videoElement = document.getElementById('32');
        //     var player = Mpegts.createPlayer({
        //         type: 'mpegts',  // could also be mpegts, m2ts, flv
        //         isLive: true,
        //         url: 'http://192.168.10.88:3001/cam32'
        //     });
        //     player.attachMediaElement(videoElement);
        //     player.load();
        //     player.play();
        // }
        // if (Mpegts.getFeatureList().nativeMP4H264Playback) {
        //     var videoElement = document.getElementById('33');
        //     var player = Mpegts.createPlayer({
        //         type: 'mpegts',  // could also be mpegts, m2ts, flv
        //         isLive: true,
        //         url: 'http://192.168.10.88:3001/cam33'
        //     });
        //     player.attachMediaElement(videoElement);
        //     player.load();
        //     player.play();
        // }
        // if (Mpegts.getFeatureList().nativeMP4H264Playback) {
        //     var videoElement = document.getElementById('34');
        //     var player = Mpegts.createPlayer({
        //         type: 'mpegts',  // could also be mpegts, m2ts, flv
        //         isLive: true,
        //         url: 'http://192.168.10.88:3001/cam34'
        //     });
        //     player.attachMediaElement(videoElement);
        //     player.load();
        //     player.play();
        // }
        // if (Mpegts.getFeatureList().nativeMP4H264Playback) {
        //     var videoElement = document.getElementById('35');
        //     var player = Mpegts.createPlayer({
        //         type: 'mpegts',  // could also be mpegts, m2ts, flv
        //         isLive: true,
        //         url: 'http://192.168.10.88:3001/cam35'
        //     });
        //     player.attachMediaElement(videoElement);
        //     player.load();
        //     player.play();
        // }
        // if (Mpegts.getFeatureList().nativeMP4H264Playback) {
        //     var videoElement = document.getElementById('36');
        //     var player = Mpegts.createPlayer({
        //         type: 'mpegts',  // could also be mpegts, m2ts, flv
        //         isLive: true,
        //         url: 'http://192.168.10.88:3001/cam36'
        //     });
        //     player.attachMediaElement(videoElement);
        //     player.load();
        //     player.play();
        // }
    })

    return (
        <>
        <div className="vid-box h-screen">
            <div className="flexing h-full">

            

            <div id="group" className="vid-div fb-25" >
                <video id="1" className="vid" autoplay muted width="640" height="480" data-setup='{"preload":"auto"}'>
                </video>
            </div>
            <div id="group" className="vid-div fb-25" >
                <video id="2" className="vid" autoplay muted width="640" height="480" data-setup='{"preload":"auto"}'>
                </video>
            </div>
            <div id="group" className="vid-div fb-25" >
                <video id="3" className="vid" autoplay muted width="640" height="480" preload="metadata">
                </video>
            </div>
            <div id="group" className="vid-div fb-25" >
                <video id="4" className="vid" autoplay muted width="640" height="480" data-setup='{"preload":"auto"}'>
                </video>
            </div>
            <div id="group" className="vid-div fb-25" >
                <video id="5" className="vid" autoplay muted width="640" height="480" data-setup='{"preload":"auto"}'>
                </video>
            </div>
            <div id="group" className="vid-div fb-25" >
                <video id="6" className="vid" autoplay muted width="640" height="480" data-setup='{"preload":"auto"}'>
                </video>
            </div>
            <div id="group" className="vid-div fb-25" >
                <video id="7" className="vid" autoplay muted width="640" height="480" data-setup='{"preload":"auto"}'>
                </video>
            </div>
            <div id="group" className="vid-div fb-25" >
                <video id="8" className="vid" autoplay muted width="640" height="480" data-setup='{"preload":"auto"}'>
                </video>
            </div>
            <div id="group" className="vid-div fb-25" >
                <video id="9" className="vid" autoplay muted width="640" height="480" data-setup='{"preload":"auto"}'>
                </video>
            </div>
            <div id="group" className="vid-div fb-25" >
                <video id="10" className="vid" autoplay muted width="640" height="480" data-setup='{"preload":"auto"}'>
                </video>
            </div>
            <div id="group" className="vid-div fb-25" >
                <video id="11" className="vid" autoplay muted width="640" height="480" data-setup='{"preload":"auto"}'>
                </video>
            </div>
            <div id="group" className="vid-div fb-25" >
                <video id="12" className="vid" autoplay muted width="640" height="480" data-setup='{"preload":"auto"}'>
                </video>
            </div>
            <div id="group" className="vid-div fb-25" >
                <video id="13" className="vid" autoplay muted width="640" height="480" data-setup='{"preload":"auto"}'>
                </video>
            </div>
            <div id="group" className="vid-div fb-25" >
                <video id="14" className="vid" autoplay muted width="640" height="480" data-setup='{"preload":"auto"}'>
                </video>
            </div>
            <div id="group" className="vid-div fb-25" >
                <video id="15" className="vid" autoplay muted width="640" height="480" data-setup='{"preload":"auto"}'>
                </video>
            </div>
            <div id="group" className="vid-div fb-25" >
                <video id="16" className="vid" autoplay muted width="640" height="480" data-setup='{"preload":"auto"}'>
                </video>
            </div>
            <div id="group" className="vid-div fb-25" >
                <video id="17" className="vid" autoplay muted width="640" height="480" data-setup='{"preload":"auto"}'>
                </video>
            </div>
            <div id="group" className="vid-div fb-25" >
                <video id="18" className="vid" autoplay muted width="640" height="480" data-setup='{"preload":"auto"}'>
                </video>
            </div>
            <div id="group" className="vid-div fb-25" >
                <video id="19" className="vid" autoplay muted width="640" height="480" data-setup='{"preload":"auto"}'>
                </video>
            </div>
            <div id="group" className="vid-div fb-25" >
                <video id="20" className="vid" autoplay muted width="640" height="480" data-setup='{"preload":"auto"}'>
                </video>
            </div>
            <div id="group" className="vid-div fb-25" >
                <video id="21" className="vid" autoplay muted width="640" height="480" data-setup='{"preload":"auto"}'>
                </video>
            </div>
            <div id="group" className="vid-div fb-25" >
                <video id="22" className="vid" autoplay muted width="640" height="480" data-setup='{"preload":"auto"}'>
                </video>
            </div>
            <div id="group" className="vid-div fb-25" >
                <video id="23" className="vid" autoplay muted width="640" height="480" data-setup='{"preload":"auto"}'>
                </video>
            </div>
            <div id="group" className="vid-div fb-25" >
                <video id="24" className="vid" autoplay muted width="640" height="480" data-setup='{"preload":"auto"}'>
                </video>
            </div>
            <div id="group" className="vid-div fb-25" >
                <video id="25" className="vid" autoplay muted width="640" height="480" data-setup='{"preload":"auto"}'>
                </video>
            </div>
            <div id="group" className="vid-div fb-25" >
                <video id="26" className="vid" autoplay muted width="640" height="480" data-setup='{"preload":"auto"}'>
                </video>
            </div>
            <div id="group" className="vid-div fb-25" >
                <video id="27" className="vid" autoplay muted width="640" height="480" data-setup='{"preload":"auto"}'>
                </video>
            </div>
            <div id="group" className="vid-div fb-25" >
                <video id="28" className="vid" autoplay muted width="640" height="480" data-setup='{"preload":"auto"}'>
                </video>
            </div>
            <div id="group" className="vid-div fb-25" >
                <video id="29" className="vid" autoplay muted width="640" height="480" data-setup='{"preload":"auto"}'>
                </video>
            </div>
            <div id="group" className="vid-div fb-25" >
                <video id="30" className="vid" autoplay muted width="640" height="480" data-setup='{"preload":"auto"}'>
                </video>
            </div>
            <div id="group" className="vid-div fb-25" >
                <video id="31" className="vid" autoplay muted width="640" height="480" data-setup='{"preload":"auto"}'>
                </video>
            </div>
            <div id="group" className="vid-div fb-25" >
                <video id="32" className="vid" autoplay muted width="640" height="480" data-setup='{"preload":"auto"}'>
                </video>
            </div>
            <div id="group" className="vid-div fb-25" >
                <video id="33" className="vid" autoplay muted width="640" height="480" data-setup='{"preload":"auto"}'>
                </video>
            </div>
            <div id="group" className="vid-div fb-25" >
                <video id="34" className="vid" autoplay muted width="640" height="480" data-setup='{"preload":"auto"}'>
                </video>
            </div>
            <div id="group" className="vid-div fb-25" >
                <video id="35" className="vid" autoplay muted width="640" height="480" data-setup='{"preload":"auto"}'>
                </video>
            </div>
            <div id="group" className="vid-div fb-25" >
                <video id="36" className="vid" autoplay muted width="640" height="480" data-setup='{"preload":"auto"}'>
                </video>
            </div> 
            
           
            </div>
        </div>
        </>
    )
}