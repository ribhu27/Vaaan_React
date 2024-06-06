import React from "react";
import Mpegts from "mpegts.js";
export default function MotionDetectionModal(props) {



  const apiUrl = localStorage.getItem('api')
  const wsUrl = localStorage.getItem('ws')
  var player
  

  let videoURL = localStorage.getItem('videoURL')

    if (!props.showMotion) {
        return null;
    } else {
      const config = {
        liveBufferLatencyChasing : true,
        liveBufferLatencyChasingOnPaused: true,
        // enableStashBuffer: false,
        // liveBufferLatencyMaxLatency: 0.5,
        // liveBufferLatencyMinRemain: 0.55,
        liveSync: true,
        liveSyncTargetLatency: 0,
        liveSyncMaxLatency: 0.2,
        liveSyncPlaybackRate: 2,
        // enableWorker: true,
        deferLoadAfterSourceOpen: false,
        // enableWorkerForMSE: true
        autoCleanupSourceBuffer: true,
        autoCleanupMaxBackwardDuration: 10,
        autoCleanupMinBackwardDuration: 5,
    
    
    }

          async function createHLS(url, vid) {
            try{
        
                vid.controls = false
                player = Mpegts.createPlayer({
                        type: 'mpegts',  // could also be mpegts, m2ts, flv
                        isLive: true,
                        // url: 'http://192.168.10.88:3001/cam9'
                        url: url,
                        hasAudio:false
                        
                    }, config);
                    player.attachMediaElement(vid);
                    player.on('error',(err)=>{
                        err.preventDefault()
                        console.log(err)
                    })
                    player.load();
                    // vid.addEventListener('canplay', ()=>{
                        // player.play();
                    // })
                    player.on(Mpegts.Events.ERROR,(e)=>{
                        e.preventDefault()
                        console.log(e)
                    });
                    player.on(Mpegts.ErrorTypes.MEDIA_ERROR,(e)=>{
                        e.preventDefault()
                        console.log(e)
                    });
                    player.on(Mpegts.ErrorTypes.NETWORK_ERROR,(e)=>{
                        e.preventDefault()
                        console.log(e)
                    });
                    player.on(Mpegts.ErrorTypes.OTHER_ERROR,(e)=>{
                        e.preventDefault()
                        console.log(e)
                    });
                    player.on("error", (err)=>{console.log(err)})
                    }catch(e){
                        console.log(e)
                    }
            // vid.play().catch(e=>{console.log(e)})
          }


          // const hls = new Hls(config)
          setTimeout(function () { 
              var x = document.getElementById("motion-detection-video");
              // y.className = "vid fb-100"
              createHLS(wsUrl+videoURL ,x)
             }, 50);

      // Add the "show" class to DIV

      // After 3 seconds, remove the show class from DIV
        return (
        <div className="motion-detection-modal">
        <div className="motion-detection-modal-content">
            Motion Detected on {videoURL}
            {/* <h1 className="mt-3 text-lg font-bold">Snapshot</h1> */}
            <button className="modal-button" onClick={()=>props.onClose(player)}>
                X
            </button>
            <div className="modal-body mt-0">
                <video autoPlay muted id="motion-detection-video" className="vid"></video>
                {/* <img className="w-full" src={props.dataUrl} id="snapshot"/> */}
            </div >
        </div>
    </div>
        );
    }
}