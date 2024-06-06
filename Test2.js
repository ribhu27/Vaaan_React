import React, { useEffect } from "react";
import Mpegts from "mpegts.js";

export default function Test() {
    const config = {
        liveBufferLatencyChasing : true,
        // enableStashBuffer: false,
        liveSync: true,
        // liveSyncTargetLatency: 0.05,
        // liveBufferLatencyMaxLatency: 0.5,
        // liveBufferLatencyMinRemain: 0.1,
        // enableWorker: true,
        // enableWorkerForMSE: true
        // autoCleanupSourceBuffer: true,
        // autoCleanupMaxBackwardDuration: 15
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
                url: 'http://192.168.11.144:3001/cam1'
            },config);
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
                url: 'http://192.168.11.144:3001/cam2'
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
        //         url: 'http://localhost:3001/cam25'
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
        //         url: 'http://localhost:3001/cam26'
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
        //         url: 'http://localhost:3001/cam27'
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
        //         url: 'http://localhost:3001/cam28'
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
        //         url: 'http://localhost:3001/cam29'
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
        //         url: 'http://localhost:3001/cam30'
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
        //         url: 'http://localhost:3001/cam31'
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
        //         url: 'http://localhost:3001/cam32'
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
        //         url: 'http://localhost:3001/cam33'
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
        //         url: 'http://localhost:3001/cam34'
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
        //         url: 'http://localhost:3001/cam35'
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
        //         url: 'http://localhost:3001/cam36'
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

            

            <div id="group" className="vid-div fb-50" >
                <video id="1" className="vid" autoplay muted width="640" height="480" data-setup='{"preload":"auto"}'>
                </video>
            </div>
            <div id="group" className="vid-div fb-50" >
                <video id="2" className="vid" autoplay muted width="640" height="480" data-setup='{"preload":"auto"}'>
                </video>
            </div>
            
           
            </div>
        </div>
        </>
    )
}