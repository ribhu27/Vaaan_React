import '../App.css';
import React, { useRef } from 'react';
import { useEffect } from 'react';
import Navbar from '../Components/Navbar';
import { FaArrowDown, FaCamera, FaChevronDown, FaVideo } from 'react-icons/fa';
import { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCamera, faRecordVinyl, faRectangleXmark, faSquareFull, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FaAlignCenter, FaArrowLeft, FaArrowRight, FaArrowUp, FaDotCircle, FaMinus, FaPlus } from 'react-icons/fa';
import Mpegts from 'mpegts.js';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
// import AddGroupModal from './AddGroupModal'
import RotateModal from './RotateModal'
import SnapModal from './SnapModal';
import MotionDetectionModal from './MotionDetectionModal';
import { Link } from 'react-router-dom';
export default function LLLive() {
    const api_node = localStorage.getItem('api_node')
    const apiUrl = localStorage.getItem('api')
    const wsUrl = localStorage.getItem('ws')
    const checkingInterval = useRef([])
    const interval = useRef()
    const [expand, setExpand] = useState(-1)
    var checkWaitOrPlay = useRef([])
    var waitOrPlay = useRef([])
    var media = useRef([])
    var recordedChunks = useRef([])
    var lastReload = useRef()
    const [eventPopUp, setEventPopUp] = useState(true)
    var ptzCamerasList = useRef({})
    var cameraList = useRef([])
    var rotateList = useRef([])
    var dataUrl = useRef([])
    // const [customRotate, setCustomRotate] = useState(false)
    // const [ptzCamerasList, setPtzCamerasList] = useState({})
    const [currentCam, setCurrentCam] = useState("")
    // const [cameraList, setCameraList] = useState([])
    // const [rotateList, setRotateList] = useState([])
    // const [dataUrl, setDataUrl] = useState("")
    const [ptzActive, setPtzActive] = useState(false)
    //   var setGriduseRef(2)
    const [grid, setGrid] = useState(2)
    const [groups, setGroups] = useState([])
    const [isActive, setIsActive] = useState(false);
    const [videoCount, setVideoCount] = useState(0);
    const [rotate, setRotate] = useState(0)
    const [showMotion, setShowMotion] = useState(false)
    const [motionVideo, setMotionVideo] = useState(false)
    const [showRotate, setShowRotateModal] = useState(false)
    const [showSnap, setShowSnap] = useState(false)
    var hlsArr = useRef([])
    // const [showModal, setShowModal] = useState(false)
    // const [hlsArr, setHlsArr] = useState([{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]);
    const [startStopRecording, setStartStopRecording] =
        useState([true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true,
            true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true,
            true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true,
            true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true,
            true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true,])

    var videoLoaded = useRef([])

    let flagForVideoDrag = false
    let flagForGroupDrag = false
    let i
    let motionVideoElement = document.createElement('video')
    const motionVideoRef = useRef(motionVideoElement)
    motionVideoElement.setAttribute('ref', motionVideoRef)
    function handleRotateModal() {
        setShowRotateModal(true)
    }
    function handleSnapModal() {
        setShowSnap(true)
    }
    function handleSnapClose() {
        setShowSnap(false)
    }
    function handleMotionClose(hls) {
        setShowMotion(false)
        hls.detachMediaElement();
        hls.destroy();
    }
    function handleMotion() {
        setShowMotion(true)
    }
    function handleRotateClose() {
        setShowRotateModal(false)
    }
    // async function handleOnClose() {
    //   setShowModal(false)
    //   const groupData = await axios.get(apiUrl+'camera_group_list/').catch((res)=>{
    //     console.log(res)
    //   })
    //   try{
    //     setGroups(groupData.data)

    //   }catch(e){
    //     console.log(e)
    //   }

    // }
    // function handleAddGroup() {
    //   setShowModal(true)
    // }
    async function createHLS(url, vid, i) {
        try {

            waitOrPlay.current[i] = 'l'
            checkWaitOrPlay.current[i] = Date.now()
            vid.controls = false
            var player = Mpegts.createPlayer({
                type: 'mpegts',  // could also be mpegts, m2ts, flv, mse
                isLive: true,
                // url: 'http://192.168.10.88:3001/cam9'
                url: url,
                hasAudio: false

            }, config);
            player.attachMediaElement(vid);
            player.on('error', (err) => {
                // player.destroy()
                // err.preventDefault()
                console.log(err)
            })
            player.load();
            // vid.addEventListener('canplay', ()=>{
            // player.play();
            // })
            player.on(Mpegts.Events.ERROR, (e) => {
                // player.destroy()
                console.log(e)
            });
            player.on(Mpegts.ErrorTypes.MEDIA_ERROR, (e) => {
                // player.destroy()
                console.log(e)
            });
            player.on(Mpegts.ErrorTypes.NETWORK_ERROR, (e) => {
                // player.destroy()
                console.log(e)
            });
            player.on(Mpegts.ErrorTypes.OTHER_ERROR, (e) => {
                // player.destroy()
                console.log(e)
            });
            // player.on(Mpegts.Events.LOADING_COMPLETE, (e) => {
            //   console.log("LOADING COMPLETE EVENT FIRED " + i + waitOrPlay.current[i])
            // })
            // setHlsArr((hlsArr) => {
            //   const tempArr = [...hlsArr];
            //   tempArr[i] = {
            //     'hls': player,
            //     'url': url,
            //     'video': vid,
            //   }
            //   return tempArr;
            // })
            hlsArr.current[i] = {
                'hls': player,
                'url': url,
                'video': vid,
            }

            // checkStall[i]=new Set();
        } catch (e) {
            console.log(e)
        }
        // vid.play().catch(e=>{console.log(e)})
    }



    useEffect(() => {
        for (let i = 0; i < (grid + 1) * (grid + 1); i++) {
            if (videoLoaded.current[i]) {
                checkingInterval.current[i] = setInterval(() => {
                    if (waitOrPlay.current[i] == 'l' && (Date.now() - checkWaitOrPlay.current[i]) <= 5000) {
                        console.log("returning from interval right now ")
                        return
                    }
                    // console.log("checking " + i + " " + waitOrPlay.current[i] + ' ' + (Date.now() - checkWaitOrPlay.current[i]) + ' ' + checkWaitOrPlay.current[i])
                    if ((waitOrPlay.current[i] !== 'p') && (Date.now() - checkWaitOrPlay.current[i] >= 2500)) {
                        // console.log("reloading " + i + " " + waitOrPlay.current[i])
                        try {
                            // reloadVideo(i)
                            // const center = document.getElementById('cen-' + parseInt(i))
                            // const innertext = center.innerText
                            const url = hlsArr.current[i].url
                            const video = hlsArr.current[i].video
                            // removeVideo(i)
                            // console.log("destroying " + i + " " + waitOrPlay.current[i] + ' ' + (Date.now() - checkWaitOrPlay.current[i]) + ' ' + checkWaitOrPlay.current[i])

                            hlsArr.current[i].hls.destroy()
                            hlsArr.current[i].hls.detachMediaElement()
                            createHLS(url, video, i)
                        } catch (e) {
                            console.log(e)
                        }
                        // return ()=>clearInterval(checkingInterval.current[numid])
                    }
                }, 5000);
            }
        }
        return () => {
            for (let i = 0; i < (grid + 1) * (grid + 1); i++) {
                // if (videoLoaded.current[i]) {

                //   if (waitOrPlay.current[i] !== 'p' && Date.now() - checkWaitOrPlay.current[i] >= 2500) {
                //     checkWaitOrPlay.current[i] = Date.now()
                //     const hls = hlsArr.current[i].hls
                //   // const center = document.getElementById('cen-' + parseInt(i))
                //   // const innertext = center.innerText
                //   const url = hlsArr.current[i].url
                //   const video = hlsArr.current[i].video
                //   // removeVideo(i)
                //   hlsArr.current[i].hls.destroy()
                //   hlsArr.current[i].hls.detachMediaElement()
                //   // createHLS(url, video, i)
                //     // return ()=>clearInterval(checkingInterval.current[numid])
                //   }
                // }
                if (checkingInterval.current[i]) {
                    clearInterval(checkingInterval.current[i])
                    checkingInterval.current[i] = null
                }
            }
        }
    })




    function checkwait(ev) {
        let numid
        let id = ev.target.id
        if (id.length === 5)
            numid = parseInt(id[4])
        else if (id.length === 6)
            numid = id[4] + id[5]
        else if (id.length === 7)
            numid = id[4] + id[5] + id[6]

        // if (waitOrPlay.current[numid] == 'r')
        //   return

        waitOrPlay.current[numid] = 'w'
        checkWaitOrPlay.current[numid] = Date.now()

    }

    function checkplay(ev) {
        let numid
        let id = ev.currentTarget.id
        if (id.length === 5)
            numid = parseInt(id[4])
        else if (id.length === 6)
            numid = id[4] + id[5]
        else if (id.length === 7)
            numid = id[4] + id[5] + id[6]

        waitOrPlay.current[numid] = 'p'
        checkWaitOrPlay.current[numid] = Date.now()

    }






    // const gridHandler = event => {
    //   if(event.target.id == "1-grid"){
    //     setGrid(0)
    //   }
    //   else if(event.target.id == "2-grid")
    //   setGrid(1)
    //   else
    //   setGrid(2)
    // }
    const handleClick = event => {
        // 👇️ toggle isActive state on click
        setIsActive(current => !current);
    };
    async function getCamerasList() {
        // const data = await axios.get('http://127.0.0.1:8080/Recordings')
        try {
            const groupData = await axios.get(apiUrl + 'camera_group_list/').catch((res) => {
                console.log(res)
            })
            groupData.data.map(group => {
                if (group.all_cameras_group) {
                    group.all_cameras.map(device => {
                        ptzCamerasList.current[device.device_name] = [device.ip_address, device.username, device.password];
                        cameraList.current.push(device.device_name)
                    })
                }
            })
            // console.log("List is" + cameraList)
            // const data = await axios.get('http://192.168.0.15:8000/Recordings')

            // console.log(data)
            setGroups(groupData.data)
            console.log(groupData.data)
        }
        catch (e) {
            console.log(e)
        }
        // setCameraList(cameraList => {
        //   return [...data.data]
        // })
        // console.log('hi')
        // console.log(cameraList)
    }
    async function firstLoad() {
        let gr = 225
        if (sessionStorage.getItem('grid')) {
            //   setGridparseInt(sessionStorage.getItem('grid'))
            setGrid(parseInt(sessionStorage.getItem('grid')))
            gr = parseInt(sessionStorage.getItem('grid'))
            gr = (gr + 1) * (gr + 1)
        }
        for (let i = 0; i < gr; i++) {
            let vid = document.getElementById('hls-' + parseInt(i))
            if (!vid) return
            vid.controls = false
            if (sessionStorage.getItem('hls-' + i)) {
                videoLoaded.current[i] = true
                // videoLoaded.current[videoCount]=true;
                // const hls = new Hls(config)
                const video = document.getElementById('hls-' + parseInt(i));
                const center = document.getElementById('cen-' + parseInt(i))
                center.innerText = sessionStorage.getItem('hls-' + i)
                const url = wsUrl + sessionStorage.getItem('hls-' + i)
                console.log("url is " + url)
                await createHLS(url, video, i)
                setVideoCount((i + 1) % ((grid + 1) * (grid + 1)))
            }
        }
    }



    // function handleTimer() {
    //   setToUse = new Set(cameraSet)
    //   i = 0
    //   interval.current = setInterval(() => {
    //     rotateCameras();
    //   }, 30000);
    // }

    // if (!rotate && interval.current) {
    //   clearInterval(interval.current);
    // }
    // if (rotate) {
    //   handleTimer();
    // }

    // window.addEventListener("unhandledrejection", (event) => {
    //   event.preventDefault();
    //   console.log({ message: event.reason.message });
    // });

    useEffect(() => {
        // console.log(groups)
        // console.log("heehaw")
        // for (let group of groups)
        //   console.log(group)
        function handleTimer() {
            i = 0
            interval.current = setInterval(() => {
                rotateCameras();
            }, rotate * 1000);
        }

        if (rotate === 0 && interval.current) {
            clearInterval(interval.current);
        }
        if (rotate != 0) {
            handleTimer();
        }
        return () => {
            if (interval.current) {
                clearInterval(interval.current);
            }
        }
        // if(rotate){
        //   setInterval(rotateCameras,10000)
        // }
    }, [rotate, grid, rotateList.current])

    useEffect(() => {
        getCamerasList();
        firstLoad();
        return () => {
            if (interval.current) {
                clearInterval(interval.current);
            }
            for (var i in hlsArr.current) {
                if (hlsArr.current[i].hls)
                    hlsArr.current[i].hls.destroy()
            }
        }

    }, [])

    function alertAudio() {
        const message = new SpeechSynthesisUtterance();
        const speechSynthesis = window.speechSynthesis;
        const voiceList = speechSynthesis.getVoices()
        message.voice = voiceList[2]
        message.text = "Motion Detected";
        speechSynthesis.speak(message);
    }

    const [videoURL, setVideoURL] = useState("")


    useEffect(() => {
        let motionURL = localStorage.getItem("motion")
        const socket = new WebSocket(motionURL, 'echo-protocol');
        socket.onconnect = function () {
            console.log("connected")
        }
        socket.onmessage = function (event) {
            const data = JSON.parse(event.data);
            // console.log('websocket data is ' + event.data)
            // console.log('devce is'+ data.device_name)
            localStorage.setItem('videoURL', data.device_name)
            // setVideoURL(data.device_name)

            // const message = new SpeechSynthesisUtterance();
            // const speechSynthesis = window.speechSynthesis;
            // const voiceList = speechSynthesis.getVoices()
            // message.voice = voiceList[2]
            // message.text = "Motion Detected";
            // speechSynthesis.speak(message);


            // create an instance of the speech synthesis object
            // set the text to be spoken
            // start speaking
            // console.log(speechSynthesis.getVoices())

            if (!eventPopUp) {
                if (!showMotion) {
                    handleMotion()
                    alertAudio()
                }
            }
            else {
                var x = document.getElementById("snackbar");
                // var y = document.createElement('video');

                //   // y.className = "vid fb-100"
                // const hls = new Hls(config)
                // createHLS(hls,'http://192.168.0.15:8000/LiveStreams/Main-Gate/index.m3u8',motionVideoElement)
                //   x.appendChild(y)
                // motionVideoElement.play()
                //   // Add the "show" class to DIV
                x.className = "show";
                alertAudio()

                //   // After 3 seconds, remove the show class from DIV
                setTimeout(function () {
                    x.className = x.className.replace("show", "");
                    //     hls.detachMedia()
                    //     hls.destroy()
                    //     x.removeChild(y)
                }, 3000);
                // const dataJSON = JSON.stringify(data.data, null, 2);
            }
        };

        socket.onclose = function (event) {
            console.error('WebSocket closed unexpectedly');
        };
        return (() => {
            socket.close()
        })
    }, [eventPopUp])




    const config = {
        enableWorkerForMSE: true,
        isLive: true,
        liveBufferLatencyChasing: true,
        liveBufferLatencyChasingOnPaused: true,
        enableStashBuffer: false,
        liveBufferLatencyMaxLatency: 0.7,  //0.7
        liveBufferLatencyMinRemain: 0.3,  //0.3
        liveSync: true,
        // liveSyncTargetLatency: 0.3,
        // liveSyncMaxLatency: 0.7,
        // liveSyncPlaybackRate: 2,

        // deferLoadAfterSourceOpen: false,
        autoCleanupSourceBuffer: true,
        autoCleanupMaxBackwardDuration: 4,
        autoCleanupMinBackwardDuration: 2,


    }




    async function addVideo(event) {
        console.log("event.target.value = " + event.target.innerText)
        // cameraSet.add(event.target.innerText)
        rotateList.current.push(event.target.innerText)
        sessionStorage.setItem('hls-' + parseInt(videoCount), event.target.innerText)
        
        if (videoLoaded.current[videoCount]) {
            if (waitOrPlay.current[videoCount] == 'l' && (Date.now() - checkWaitOrPlay.current[videoCount]) <= 5000) {
                console.log("returning from addVideo right now ")
                return
            }
            // removeVideo(videoCount)
            document.getElementById('hls-' + parseInt(videoCount)).controls = false
            var url = wsUrl + event.target.innerText
            hlsArr.current[videoCount].hls.detachMediaElement()
            hlsArr.current[videoCount].hls.destroy()
            //   hlsArr.current[videoCount].hls = new Hls(config)
            //   hlsArr.current[videoCount].hls.loadSource(url)
            //   hlsArr.current[videoCount].hls.attachMedia(document.getElementById('hls-' + parseInt(videoCount)))
            createHLS(url, document.getElementById('hls-' + parseInt(videoCount)), videoCount)
            // cameraSet.delete(document.getElementById('cen-' + parseInt(videoCount)).innerText)



            document.getElementById('cen-' + parseInt(videoCount)).innerText = event.target.innerText
            setVideoCount((videoCount + 1) % ((grid + 1) * (grid + 1)))
            return
        }
        videoLoaded.current[videoCount] = true
        // videoLoaded.current[videoCount]=true;
        // var hls = new Hls(config)
        var video = document.getElementById('hls-' + parseInt(videoCount));
        const center = document.getElementById('cen-' + parseInt(videoCount))
        center.innerText = event.target.innerText
        console.log("text = " + document.getElementById('cen-' + parseInt(videoCount)).innerText)

        console.log("video id = " + 'hls-' + parseInt(videoCount))
        var url = wsUrl + event.target.innerText
        await createHLS(url, video, videoCount)
        setVideoCount((videoCount + 1) % ((grid + 1) * (grid + 1)))
    }
    function sessionremove(videoC) {
        sessionStorage.removeItem('hls-' + parseInt(videoC))
        return
    }



    function stopRecording(i) {
        media.current[i].stop()
        // const blob = new Blob(recordedChunks.current[i], { type:'video/webm'})
        // const formData = new FormData();
        //     formData.append('video', blob, 'recording.webm');
        // recordedChunks.current[i] = []
        //   // const url = URL.createObjectURL(blob)
        //   axios.post(api_node+'uploadClip',formData,{
        //     headers: {
        //       'Content-Type':'multipart/form-data'
        //     }
        //   }).then(res=>{
        //     console.log(res)
        //   }).catch(err=>{console.log(err)})
        setStartStopRecording(prev => {
            let temp = [...prev]
            temp[i] = !temp[i]
            return temp
        })
    }



    function startRecording(i) {
        if (!videoLoaded.current[i])
            return
        const video = document.getElementById('hls-' + parseInt(i))
        const stream = video.captureStream()
        recordedChunks.current[i] = []
        const options = { mimeType: "video/webm;codecs=h264" }
        const mediaRecorder = new MediaRecorder(stream, options)
        media.current[i] = mediaRecorder
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.start()
        setStartStopRecording(prev => {
            let temp = [...prev]
            temp[i] = !temp[i]
            return temp
        })


        function handleDataAvailable(e) {
            if (e.data.size > 0) {
                recordedChunks.current[i].push(e.data)
                download()
            }
        }

        function download() {
            const blob = new Blob(recordedChunks.current[i], { type: 'video/webm' })
            const url = URL.createObjectURL(blob)
            const formData = new FormData();
            formData.append('video', blob, 'recording.webm');
            axios.post(api_node + 'uploadClip', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                console.log(res)
            }).catch(err => { console.log(err) })
            const a = document.createElement('a')
            a.href = url;
            a.download = "video.webm"
            a.click();
            window.URL.revokeObjectURL(url)
        }
    }


    async function reloadVideo(i) {
        try {


            if (videoLoaded.current[i]) {
                if (waitOrPlay.current[i] == 'l' && (Date.now() - checkWaitOrPlay.current[i]) <= 5000) {
                    console.log("returning right now ")
                    return
                }
                // const center = document.getElementById('cen-' + parseInt(i))
                // const innertext = center.innerText
                const url = hlsArr.current[i].url
                const video = hlsArr.current[i].video
                // removeVideo(i)
                hlsArr.current[i].hls.destroy()
                hlsArr.current[i].hls.detachMediaElement()
                await createHLS(url, video, i)
                // document.getElementById('cen-' + parseInt(i)).innerText = innertext

            }
        } catch (e) { console.log(e) }
    }

    function removeVideo(videoC) {
        if (videoLoaded.current[videoC]) {
            try {
                if (waitOrPlay.current[videoC] == 'l' && (Date.now() - checkWaitOrPlay.current[videoC]) <= 5000) {
                    console.log("returning from interval right now ")
                    return
                }
                document.getElementById('hls-' + parseInt(videoC)).controls = false
                const center = document.getElementById('cen-' + parseInt(videoC))
                // cameraSet.delete(center.innerText)

                center.innerText = ""
                // console.log(hlsArr.current[videoC].hls)
                hlsArr.current[videoC].hls.unload()
                hlsArr.current[videoC].hls.pause()

                hlsArr.current[videoC].hls.destroy()

                hlsArr.current[videoC].hls.detachMediaElement()
                console.log("url = " + hlsArr.current[videoC].url)
                console.log("index = " + videoC)
                videoLoaded.current[videoC] = false;
                setVideoCount((videoC) % 6)
                // setHlsArr((hlsArr) => {
                //   let tempArr = hlsArr;
                //   tempArr[videoC] = {}
                //   return tempArr;
                // })
                hlsArr.current[videoC] = {}
                sessionremove(videoC)
                return

            } catch (e) {
                console.log(e)
            }
        }
        if (checkingInterval.current[videoC]) {
            clearInterval(checkingInterval.current[videoC])
        }

    }


    function dragStartHandle(ev) {
        // ev.preventDefault()
        const dd = ev.target.getElementsByTagName('span')
        flagForVideoDrag = false
        flagForGroupDrag = false
        ev.dataTransfer.setData("text", dd[0].innerText)

    }

    function dragOverHandler(ev) {
        ev.preventDefault()
    }

    function dragStartHandleGroup(ev) {
        const dd = ev.target.innerText
        flagForGroupDrag = true
        flagForVideoDrag = false
        ev.dataTransfer.setData("text", dd)
    }

    function dragStartHandleVideo(ev) {
        const dd = ev.target.id
        flagForGroupDrag = false
        flagForVideoDrag = true
        ev.dataTransfer.setData("text", dd)
    }

    async function dropHandler(ev) {
        if (flagForVideoDrag == false && flagForGroupDrag == false) {
            const cameraName = ev.dataTransfer.getData("text")
            console.log("text = " + cameraName)
            const id = ev.target.id
            rotateList.current.push(cameraName)
            setVideoCount(parseInt(id[4]))
            // videoCount = parseInt(id[4])
            let vidc
            if (id.length === 5)
                vidc = parseInt(id[4])
            else if (id.length === 6)
                vidc = id[4] + id[5]
            else if (id.length === 7)
                vidc = id[4] + id[5] + id[6]
            else return
            sessionStorage.setItem('hls-' + parseInt(vidc), cameraName)
            if (videoLoaded.current[vidc]) {
                if (waitOrPlay.current[vidc] == 'l' && (Date.now() - checkWaitOrPlay.current[vidc]) <= 5000) {
                    console.log("returning from interval right now ")
                    return
                }
                document.getElementById('hls-' + parseInt(vidc)).control = false
                // removeVideo(videoCount)
                var url = wsUrl + cameraName
                hlsArr.current[vidc].hls.detachMediaElement()
                hlsArr.current[vidc].hls.destroy()
                // hlsArr.current[vidc].hls = new Hls(config)
                // hlsArr.current[vidc].hls.loadSource(url)
                await createHLS(url, document.getElementById('hls-' + parseInt(vidc)), vidc)
                // hlsArr.current[vidc].hls.attachMedia(document.getElementById('hls-' + parseInt(vidc)))
                document.getElementById('cen-' + parseInt(vidc)).innerText = cameraName
                setVideoCount((vidc + 1) % ((grid + 1) * (grid + 1)))
                return
            }
            videoLoaded.current[vidc] = true
            // videoLoaded.current[videoCount]=true;
            //   var hls = new Hls(config)
            var video = document.getElementById('hls-' + parseInt(vidc));
            const center = document.getElementById('cen-' + parseInt(vidc))
            center.innerText = cameraName
            console.log("text = " + document.getElementById('cen-' + parseInt(vidc)).innerText)

            console.log("video id = " + 'hls-' + parseInt(vidc))
            var url = wsUrl + cameraName
            await createHLS(url, video, vidc)
            setVideoCount((vidc + 1) % ((grid + 1) * (grid + 1)))
        }
        else if (flagForVideoDrag == true) {
            const video1Id = ev.dataTransfer.getData("text")
            const video2Id = ev.target.id
            let vidcount1, vidcount2;

            if (video1Id.length === 5)
                vidcount1 = video1Id[4]
            else if (video1Id.length === 6)
                vidcount1 = video1Id[4] + video1Id[5]
            else if (video1Id.length === 7)
                vidcount1 = video1Id[4] + video1Id[5] + video1Id[6]

            if (video2Id.length === 5)
                vidcount2 = video2Id[4]
            else if (video2Id.length === 6)
                vidcount2 = video2Id[4] + video2Id[5]
            else if (video2Id.length === 7)
                vidcount2 = video2Id[4] + video2Id[5] + video2Id[6]

            console.log("vid 1  = " + vidcount1)
            console.log("vid 2  = " + vidcount2)


            const cameraName1 = document.getElementById('cen-' + vidcount1).innerText
            const cameraName2 = document.getElementById('cen-' + vidcount2).innerText
            console.log("camera1 " + cameraName1)
            console.log("camera2 " + cameraName2)
            sessionStorage.setItem('hls-' + parseInt(vidcount2), cameraName1)
            sessionStorage.setItem('hls-' + parseInt(vidcount1), cameraName2)
            if (videoLoaded.current[vidcount1] && videoLoaded.current[vidcount2]) {
                if (waitOrPlay.current[vidcount1] == 'l' && (Date.now() - checkWaitOrPlay.current[vidcount1]) <= 5000) {
                    console.log("returning from interval right now ")
                    return
                }
                if (waitOrPlay.current[vidcount2] == 'l' && (Date.now() - checkWaitOrPlay.current[vidcount2]) <= 5000) {
                    console.log("returning from interval right now ")
                    return
                }
                document.getElementById('hls-' + parseInt(vidcount1)).controls = false
                let url = wsUrl + cameraName2
                hlsArr.current[vidcount1].hls.detachMediaElement()
                hlsArr.current[vidcount1].hls.destroy()
                // hlsArr.current[vidcount1].hls = new Hls(config)
                // hlsArr.current[vidcount1].hls.loadSource(url)
                createHLS(url, document.getElementById('hls-' + parseInt(vidcount1)), vidcount1)
                // hlsArr.current[vidcount1].hls.attachMedia(document.getElementById('hls-' + parseInt(vidcount1)))
                document.getElementById('cen-' + parseInt(vidcount1)).innerText = cameraName2


                document.getElementById('hls-' + parseInt(vidcount2)).controls = false
                url = wsUrl + cameraName1
                hlsArr.current[vidcount2].hls.detachMediaElement()
                hlsArr.current[vidcount2].hls.destroy()
                // hlsArr.current[vidcount2].hls = new Hls(config).
                // hlsArr.current[vidcount2].hls.loadSource(url)
                createHLS(url, document.getElementById('hls-' + parseInt(vidcount2)), vidcount2)
                // hlsArr.current[vidcount2].hls.attachMedia(document.getElementById('hls-' + parseInt(vidcount2)))
                document.getElementById('cen-' + parseInt(vidcount2)).innerText = cameraName1
                setVideoCount((vidcount2) % ((grid + 1) * (grid + 1)))
            }
            else if (videoLoaded.current[vidcount1] && !videoLoaded.current[vidcount2]) {
                document.getElementById('hls-' + parseInt(vidcount1)).controls = false
                document.getElementById('hls-' + parseInt(vidcount2)).controls = false
                hlsArr.current[vidcount1].hls.detachMediaElement()
                hlsArr.current[vidcount1].hls.destroy()
                videoLoaded.current[vidcount1] = false
                videoLoaded.current[vidcount2] = true
                // var hls = new Hls(config)
                var video = document.getElementById('hls-' + parseInt(vidcount2));
                const center = document.getElementById('cen-' + parseInt(vidcount2))
                document.getElementById('cen-' + parseInt(vidcount1)).innerText = ""
                center.innerText = cameraName1
                // console.log("text = " + document.getElementById('cen-' + parseInt(vidc)).innerText)
                // console.log("video id = " + 'hls-' + parseInt(vidc))
                var url = wsUrl + cameraName1
                await createHLS(url, video, vidcount2)
                setVideoCount((vidcount1) % ((grid + 1) * (grid + 1)))

            }
            else {
                return
            }


        }
        else if (flagForGroupDrag == true) {
            let maxElement = 0
            const id = ev.target.id
            // setVideoCount(parseInt(id[4]))
            // videoCount = parseInt(id[4])
            let count
            let temprotateList = []
            if (id.length === 5)
                count = parseInt(id[4])
            else if (id.length === 6)
                count = parseInt(id[4] + id[5])
            else if (id.length === 7)
                count = parseInt(id[4] + id[5] + id[6])
            const groupName = ev.dataTransfer.getData("text")
            for (let group of groups) {
                let arr
                if (group.group_name == groupName || group.all_cameras_group == groupName) {
                    if (group.group_name == groupName) arr = group.camera_groups
                    else if (group.all_cameras_group == groupName) arr = group.all_cameras
                    for (let device of arr) {
                        console.log(device.device_name)
                        temprotateList.push(device.device_name)
                        sessionStorage.setItem('hls-' + parseInt(count), device.device_name)
                        // cameraSet.add(event.target.innerText)

                        if (videoLoaded.current[count]) {
                            if (waitOrPlay.current[count] == 'l' && (Date.now() - checkWaitOrPlay.current[count]) <= 5000) {
                                console.log("returning from interval right now ")
                                return
                            }
                            console.log("inside" + parseInt(count))
                            // removeVideo(videoCount)
                            document.getElementById('hls-' + parseInt(count)).controls = false
                            const url = wsUrl + device.device_name
                            hlsArr.current[count].hls.detachMediaElement()
                            hlsArr.current[count].hls.destroy()
                            //   hlsArr.current[count].hls = new Hls(config)
                            //   hlsArr.current[count].hls.loadSource(url)
                            await createHLS(url, document.getElementById('hls-' + parseInt(count)), count)
                            //   hlsArr.current[count].hls.attachMedia(document.getElementById('hls-' + parseInt(count)))
                            // cameraSet.delete(document.getElementById('cen-' + parseInt(videoCount)).innerText)


                            document.getElementById('cen-' + parseInt(count)).innerText = device.device_name
                            // setVideoCount((videoCount + 1) % ((grid + 1) * (grid + 1)))
                            // count = ((count + 1) % ((grid + 1) * (grid + 1)))

                            // if (grid == 5) {
                            //   count = ((count + 1) % ((grid + 1) * (grid + 1)))
                            // }
                            // else
                            // count = count + 1
                            // if (count == (grid + 1) * (grid + 1)) setGrid(grid => grid + 1)

                            count = (count + 1) % 225
                            // if (count >= (grid + 1) * (grid + 1)) setGrid(grid => grid + 1)

                            console.log(hlsArr)

                            continue;
                        }
                        videoLoaded.current[count] = true
                        // videoLoaded.current[videoCount]=true;
                        // const hls = new Hls(config)
                        console.log("count is=" + count)
                        const video = document.getElementById('hls-' + parseInt(count));
                        const center = document.getElementById('cen-' + parseInt(count))
                        center.innerText = device.device_name
                        console.log("text = " + document.getElementById('cen-' + parseInt(count)).innerText)

                        console.log("video id = " + 'hls-' + parseInt(count))
                        const url = wsUrl + device.device_name
                        await createHLS(url, video, count)
                        // setVideoCount((videoCount + 1) % ((grid + 1) * (grid + 1)))

                        // if (grid == 5) {
                        //   count = ((count + 1) % ((grid + 1) * (grid + 1)))
                        // }
                        // else if (count == (grid + 1) * (grid + 1)) setGrid(grid => grid + 1)
                        // count = count + 1
                        maxElement = Math.max(maxElement, count)
                        count = (count + 1) % 225
                        // if (count >= (grid + 1) * (grid + 1)) setGrid(grid => grid + 1)

                        console.log(hlsArr)
                        // count = ((count + 1) % ((grid + 1) * (grid + 1)))
                    }
                }
            }

            for (let item of temprotateList)
                rotateList.current.push(item)




            if (maxElement > 99) setGrid(Math.max(grid, 14))

            else if (maxElement > 80) setGrid(Math.max(grid, 9))

            else if (maxElement > 63) setGrid(Math.max(grid, 8))

            else if (maxElement > 48) setGrid(Math.max(grid, 7))

            else if (maxElement > 35) setGrid(Math.max(grid, 6))

            else if (maxElement > 24) setGrid(Math.max(grid, 5))
            else if (maxElement > 15) setGrid(Math.max(grid, 4))
            else if (maxElement > 8) setGrid(Math.max(grid, 3))
            else if (maxElement > 3) setGrid(Math.max(grid, 2))
            else if (maxElement > 0) setGrid(Math.max(grid, 1))
            // if ((grid + 1) * (grid + 1) <= count) setGrid(grid => grid + 1)

            setVideoCount(count)

        }

    }

    async function rotateCameras() {
        // let storeHLS = []
        let index = videoCount
        console.log("index of first rotate is  " + index)
        index = (index + 1) % ((grid + 1) * (grid + 1))


        // console.log("x-fired" + index)
        // const setToUse = new Set()
        // for (let i = 0; i < 36; i++) {
        //   if (sessionStorage.getItem('hls-' + i)) {
        //     setToUse.add(sessionStorage.getItem('hls-' + i))
        //   }
        // }
        let rotating = [...rotateList.current]
        if (rotateList.current.length == 0)
            rotating = [...cameraList.current]
        let count = 0
        let stop = i       // If i loops back to value of stop then break the loop
        const length = rotating.length
        while (count < ((grid + 1) * (grid + 1))) {                                      //This will turn into an infinite loop if..
            if (document.fullscreenElement === document.getElementById('hls-' + parseInt(count))) {
                console.log("inside fullscreen ahahahaha")
                count = (count + 1) % ((grid + 1) * (grid + 1));
                count++;
                continue;
            }
            sessionStorage.setItem('hls-' + parseInt(count), rotating[i])
            console.log("x-entered " + rotating[i])
            // cameraSet.add(event.target.innerText)
            document.getElementById('hls-' + parseInt(count)).controls = false


            if (videoLoaded.current[count]) {
                if (waitOrPlay.current[count] == 'l' && (Date.now() - checkWaitOrPlay.current[count]) <= 5000) {
                    console.log("returning from interval right now ")
                    return
                }
                // removeVideo(videoCount)
                const url = wsUrl + rotating[i]
                console.log("index of rotate is  " + count)
                try {

                    hlsArr.current[count].hls.unload()
                    hlsArr.current[count].hls.detachMediaElement()
                    hlsArr.current[count].hls.destroy()

                } catch (e) { console.log(e) }
                // hlsArr.current[index].hls = new Hls(config)
                // hlsArr.current[index].hls.loadSource(url)
                await createHLS(url, document.getElementById('hls-' + parseInt(count)), count)
                // hlsArr.current[index].hls.attachMedia(document.getElementById('hls-' + parseInt(index)))
                // cameraSet.delete(document.getElementById('cen-' + parseInt(videoCount)).innerText)
                document.getElementById('cen-' + parseInt(count)).innerText = rotating[i]
                i = (i + 1) % length
                if (i == stop) return
                // index = (index + 1) % ((grid+1)*(grid+1))
                // count = (count + 1) % ((grid + 1) * (grid + 1))
            }
            else {
                console.log("inside else ahahahaha")

                videoLoaded.current[count] = true
                sessionStorage.setItem('hls-' + parseInt(count), rotating[i])

                // videoLoaded.current[videoCount]=true;
                // const hls = new Hls(config)
                const video = document.getElementById('hls-' + parseInt(count));
                const center = document.getElementById('cen-' + parseInt(count))
                center.innerText = rotating[i]
                // console.log("text = " + document.getElementById('cen-' + parseInt(videoCount)).innerText)

                // console.log("video id = " + 'hls-' + parseInt(index))
                const url = wsUrl + rotating[i]
                await createHLS(url, video, count)
                i = (i + 1) % length
                if (i == stop) return
                // index = (index + 1) % ((grid+1)*(grid+1))
                // count = (count + 1) % ((grid + 1) * (grid + 1))


            }
            count++;
        }
        // setToUse.clear()

        // setCameraSet(()=>new Set)
        setVideoCount(index)

        // setCameraSet((prev)=>new Set(prev).add(item))
    }


    function reloadAll() {
        if (lastReload && Date.now() - lastReload.current <= 5000) {
            return
        }
        lastReload.current = Date.now()
        for (let i = 0; i < (grid + 1) * (grid + 1); i++) {
            reloadVideo(i)
        }
    }

    function removeAll() {
        rotateList.current = []
        for (let i = 0; i < (grid + 1) * (grid + 1); i++) {
            removeVideo(i);
        }
    }



    async function playGroup(group) {
        let maxElement = 0;
        let count = videoCount
        let arr
        if (group.all_cameras) arr = group.all_cameras
        else
            arr = group.camera_groups
        let temprotateList = []

        for (let device of arr) {
            temprotateList.push(device.device_name)
            console.log("start-" + count)
            // console.log(device.device_name)
            sessionStorage.setItem('hls-' + parseInt(count), device.device_name)
            // cameraSet.add(event.target.innerText)
            document.getElementById('hls-' + parseInt(count)).controls = false
            if (videoLoaded.current[count]) {
                if (waitOrPlay.current[count] == 'l' && (Date.now() - checkWaitOrPlay.current[count]) <= 5000) {
                    console.log("returning from interval right now ")
                    return
                }
                console.log("entered-" + count)
                // removeVideo(videoCount)
                const url = wsUrl + device.device_name
                console.log("livestream is " + url)
                hlsArr.current[count].hls.detachMediaElement()
                hlsArr.current[count].hls.destroy()
                // hlsArr.current[count].hls = new Hls(config)
                // hlsArr.current[count].hls.loadSource(url)
                await createHLS(url, document.getElementById('hls-' + parseInt(count)), count)
                // hlsArr.current[count].hls.attachMedia(document.getElementById('hls-' + parseInt(count)))
                // cameraSet.delete(document.getElementById('cen-' + parseInt(videoCount)).innerText)


                document.getElementById('cen-' + parseInt(count)).innerText = device.device_name
                // setVideoCount((videoCount + 1) % ((grid + 1) * (grid + 1)))
                count = (count + 1) % 225

            }
            else {
                videoLoaded.current[count] = true
                // videoLoaded.current[videoCount]=true;
                // const hls = new Hls(config)
                const video = document.getElementById('hls-' + parseInt(count));
                const center = document.getElementById('cen-' + parseInt(count))
                center.innerText = device.device_name
                // console.log("text = " + document.getElementById('cen-' + parseInt(count)).innerText)

                // console.log("video id = " + 'hls-' + parseInt(count))
                const url = wsUrl + device.device_name
                await createHLS(url, video, count)
                console.log("else-" + count)
                // setVideoCount((videoCount + 1) % ((grid + 1) * (grid + 1)))

                maxElement = Math.max(maxElement, count)
                count = (count + 1) % 252

                // if (count == (grid + 1) * (grid + 1) && grid!=5){

                //   // setGrid(grid => grid + 1)
                //   count = parseInt(count + 1)
                // } 
                // else if (grid == 5) {
                //   count = parseInt((count + 1) % ((grid + 1) * (grid + 1)))
                // }
                // else
                //   count = parseInt(count + 1)

                // count = ((count + 1) % ((grid + 1) * (grid + 1)))
            }
        }
        for (let item of temprotateList)
            rotateList.current.push(item)
        if (maxElement > 99) setGrid(Math.max(grid, 14))

        else if (maxElement > 80) setGrid(Math.max(grid, 9))

        else if (maxElement > 63) setGrid(Math.max(grid, 8))

        else if (maxElement > 48) setGrid(Math.max(grid, 7))

        else if (maxElement > 35) setGrid(Math.max(grid, 6))

        else if (maxElement > 24) setGrid(Math.max(grid, 5))
        else if (maxElement > 15) setGrid(Math.max(grid, 4))
        else if (maxElement > 8) setGrid(Math.max(grid, 3))
        else if (maxElement > 3) setGrid(Math.max(grid, 2))
        else if (maxElement > 0) setGrid(Math.max(grid, 1))
        setVideoCount(count)
    }

    let canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    let ctx = canvas.getContext('2d');


    function snapshot(e) {
        let id = e
        let video = document.getElementById('hls-' + id)
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        let camera = document.getElementById('cen-' + id).innerText
        let time = new Date()
        time = time.toLocaleString().replaceAll("/", '').replaceAll('T', '').replaceAll(',', '').replaceAll(' ', '').replaceAll(':', '')
        //convert to desired file format
        let dataURI = canvas.toDataURL('image/jpeg');
        dataUrl.current = [dataURI, camera, time]
        // setDataUrl([dataURI, camera, time])
        handleSnapModal()

    }



    let mouse = ""

    function ptzUp() {
        mouse = "click"
        // console.log(subtract - Date.now())
        // console.log("surrentcam: "+currentCam)
        if (ptzCamerasList.current[currentCam])
            axios.get(api_node + 'up/' + ptzCamerasList.current[currentCam][0].split(':')[0] + '/' + ptzCamerasList.current[currentCam][1] + '/' + ptzCamerasList.current[currentCam][2])
                .then(res => { console.log(res) }).catch(e => console.log(e))
    }
    function ptzUpLeft() {
        mouse = "click"
        if (ptzCamerasList.current[currentCam])
            axios.get(api_node + 'ul/' + ptzCamerasList.current[currentCam][0].split(':')[0] + '/' + ptzCamerasList.current[currentCam][1] + '/' + ptzCamerasList.current[currentCam][2])
                .then(res => { console.log(res) }).catch(e => console.log(e))
    }
    function ptzUpRight() {
        mouse = "click"
        if (ptzCamerasList.current[currentCam])
            axios.get(api_node + 'ur/' + ptzCamerasList.current[currentCam][0].split(':')[0] + '/' + ptzCamerasList.current[currentCam][1] + '/' + ptzCamerasList.current[currentCam][2])
                .then(res => { console.log(res) }).catch(e => console.log(e))
    }
    function ptzLeft() {
        mouse = "click"
        if (ptzCamerasList.current[currentCam])
            axios.get(api_node + 'lt/' + ptzCamerasList.current[currentCam][0].split(':')[0] + '/' + ptzCamerasList.current[currentCam][1] + '/' + ptzCamerasList.current[currentCam][2])
                .then(res => { console.log(res) }).catch(e => console.log(e))
    }
    function ptzRight() {
        mouse = "click"
        if (ptzCamerasList.current[currentCam])
            axios.get(api_node + 'rt/' + ptzCamerasList.current[currentCam][0].split(':')[0] + '/' + ptzCamerasList.current[currentCam][1] + '/' + ptzCamerasList.current[currentCam][2])
                .then(res => { console.log(res) }).catch(e => console.log(e))
    }
    function ptzDownLeft() {
        mouse = "click"
        if (ptzCamerasList.current[currentCam])
            axios.get(api_node + 'dl/' + ptzCamerasList.current[currentCam][0].split(':')[0] + '/' + ptzCamerasList.current[currentCam][1] + '/' + ptzCamerasList.current[currentCam][2])
                .then(res => { console.log(res) }).catch(e => console.log(e))
    }
    function ptzDownRight() {
        mouse = "click"
        if (ptzCamerasList.current[currentCam])
            axios.get(api_node + 'dr/' + ptzCamerasList.current[currentCam][0].split(':')[0] + '/' + ptzCamerasList.current[currentCam][1] + '/' + ptzCamerasList.current[currentCam][2])
                .then(res => { console.log(res) }).catch(e => console.log(e))
    }
    function ptzDown() {
        mouse = "click"
        if (ptzCamerasList.current[currentCam])
            axios.get(api_node + 'dn/' + ptzCamerasList.current[currentCam][0].split(':')[0] + '/' + ptzCamerasList.current[currentCam][1] + '/' + ptzCamerasList.current[currentCam][2])
                .then(res => { console.log(res) }).catch(e => console.log(e))
    }
    function ptzZoomIn() {
        mouse = "click"
        if (ptzCamerasList.current[currentCam])
            axios.get(api_node + 'zi/' + ptzCamerasList.current[currentCam][0].split(':')[0] + '/' + ptzCamerasList.current[currentCam][1] + '/' + ptzCamerasList.current[currentCam][2])
                .then(res => { console.log(res) }).catch(e => console.log(e))
    }
    function ptzZoomOut() {
        mouse = "click"
        if (ptzCamerasList.current[currentCam])
            axios.get(api_node + 'zo/' + ptzCamerasList.current[currentCam][0].split(':')[0] + '/' + ptzCamerasList.current[currentCam][1] + '/' + ptzCamerasList.current[currentCam][2])
                .then(res => { console.log(res) }).catch(e => console.log(e))
    }



    function continuePtzUpLeft() {
        setTimeout(() => {
            console.log("waiting")
        }, 110);
        if (ptzCamerasList.current[currentCam])
            axios.get(api_node + 'contUl/' + ptzCamerasList.current[currentCam][0].split(':')[0] + '/' + ptzCamerasList.current[currentCam][1] + '/' + ptzCamerasList.current[currentCam][2])
                .then(res => { console.log(res) }).catch(e => console.log(e))
    }
    function continuePtzUp() {
        // console.log(Date.now())
        // subtract = Date.now()

        if (ptzCamerasList.current[currentCam])
            axios.get(api_node + 'contUp/' + ptzCamerasList.current[currentCam][0].split(':')[0] + '/' + ptzCamerasList.current[currentCam][1] + '/' + ptzCamerasList.current[currentCam][2])
                .then(res => { console.log(res) }).catch(e => console.log(e))
    }
    function continuePtzUpRight() {
        if (ptzCamerasList.current[currentCam])
            axios.get(api_node + 'contUr/' + ptzCamerasList.current[currentCam][0].split(':')[0] + '/' + ptzCamerasList.current[currentCam][1] + '/' + ptzCamerasList.current[currentCam][2])
                .then(res => { console.log(res) }).catch(e => console.log(e))
    }
    function continuePtzLeft() {
        if (ptzCamerasList.current[currentCam])
            axios.get(api_node + 'contLt/' + ptzCamerasList.current[currentCam][0].split(':')[0] + '/' + ptzCamerasList.current[currentCam][1] + '/' + ptzCamerasList.current[currentCam][2])
                .then(res => { console.log(res) }).catch(e => console.log(e))
    }
    function continuePtzRight() {
        if (ptzCamerasList.current[currentCam])
            axios.get(api_node + 'contRt/' + ptzCamerasList.current[currentCam][0].split(':')[0] + '/' + ptzCamerasList.current[currentCam][1] + '/' + ptzCamerasList.current[currentCam][2])
                .then(res => { console.log(res) }).catch(e => console.log(e))
    }
    function continuePtzDownLeft() {
        if (ptzCamerasList.current[currentCam])
            axios.get(api_node + 'contDl/' + ptzCamerasList.current[currentCam][0].split(':')[0] + '/' + ptzCamerasList.current[currentCam][1] + '/' + ptzCamerasList.current[currentCam][2])
                .then(res => { console.log(res) }).catch(e => console.log(e))
    }
    function continuePtzDownRight() {
        if (ptzCamerasList.current[currentCam])
            axios.get(api_node + 'contDr/' + ptzCamerasList.current[currentCam][0].split(':')[0] + '/' + ptzCamerasList.current[currentCam][1] + '/' + ptzCamerasList.current[currentCam][2])
                .then(res => { console.log(res) }).catch(e => console.log(e))
    }
    function continuePtzDown() {
        if (ptzCamerasList.current[currentCam])
            axios.get(api_node + 'contDn/' + ptzCamerasList.current[currentCam][0].split(':')[0] + '/' + ptzCamerasList.current[currentCam][1] + '/' + ptzCamerasList.current[currentCam][2])
                .then(res => { console.log(res) }).catch(e => console.log(e))
    }
    function continuePtzZoomIn() {
        if (ptzCamerasList.current[currentCam])
            axios.get(api_node + 'contZi/' + ptzCamerasList.current[currentCam][0].split(':')[0] + '/' + ptzCamerasList.current[currentCam][1] + '/' + ptzCamerasList.current[currentCam][2])
                .then(res => { console.log(res) }).catch(e => console.log(e))
    }
    function continuePtzZoomOut() {
        if (ptzCamerasList.current[currentCam])
            axios.get(api_node + 'contZo/' + ptzCamerasList.current[currentCam][0].split(':')[0] + '/' + ptzCamerasList.current[currentCam][1] + '/' + ptzCamerasList.current[currentCam][2])
                .then(res => { console.log(res) }).catch(e => console.log(e))
    }
    function increaseFocus() {
        if (ptzCamerasList.current[currentCam])
            axios.get(api_node + 'If/' + ptzCamerasList.current[currentCam][0].split(':')[0] + '/' + ptzCamerasList.current[currentCam][1] + '/' + ptzCamerasList.current[currentCam][2])
                .then(res => { console.log(res) }).catch(e => console.log(e))
    }
    function decreaseFocus() {
        if (ptzCamerasList.current[currentCam])
            axios.get(api_node + 'Df/' + ptzCamerasList.current[currentCam][0].split(':')[0] + '/' + ptzCamerasList.current[currentCam][1] + '/' + ptzCamerasList.current[currentCam][2])
                .then(res => { console.log(res) }).catch(e => console.log(e))
    }
    function increaseIris() {
        if (ptzCamerasList.current[currentCam])
            axios.get(api_node + 'Ii/' + ptzCamerasList.current[currentCam][0].split(':')[0] + '/' + ptzCamerasList.current[currentCam][1] + '/' + ptzCamerasList.current[currentCam][2])
                .then(res => { console.log(res) }).catch(e => console.log(e))
    }
    function decreaseIris() {
        if (ptzCamerasList.current[currentCam])
            axios.get(api_node + 'Di/' + ptzCamerasList.current[currentCam][0].split(':')[0] + '/' + ptzCamerasList.current[currentCam][1] + '/' + ptzCamerasList.current[currentCam][2])
                .then(res => { console.log(res) }).catch(e => console.log(e))
    }
    function setHomePosition() {
        if (ptzCamerasList.current[currentCam])
            axios.get(api_node + 'Sh/' + ptzCamerasList.current[currentCam][0].split(':')[0] + '/' + ptzCamerasList.current[currentCam][1] + '/' + ptzCamerasList.current[currentCam][2])
                .then(res => { console.log(res) }).catch(e => console.log(e))
    }
    function gotoHomePosition() {
        if (ptzCamerasList.current[currentCam])
            axios.get(api_node + 'Gh/' + ptzCamerasList.current[currentCam][0].split(':')[0] + '/' + ptzCamerasList.current[currentCam][1] + '/' + ptzCamerasList.current[currentCam][2])
                .then(res => { console.log(res) }).catch(e => console.log(e))
    }
    function ptzStop() {
        if (ptzCamerasList.current[currentCam])
            axios.get(api_node + 'stop/' + ptzCamerasList.current[currentCam][0].split(':')[0] + '/' + ptzCamerasList.current[currentCam][1] + '/' + ptzCamerasList.current[currentCam][2])
                .then(res => { console.log(res) }).catch(e => console.log(e))
    }


    const [previousGrid, setPreviousGrid] = useState([])



    async function fullscreen(e) {
        e.preventDefault()
        const element = document.getElementById(e.target.parentNode.id)
        // console.log(element)
        if (!element) {
            console.log("returning")
            return
        }
        const id = element.id.length == 9 ? parseInt(element.id[8]) : (element.id.length == 10 ? (element.id[8]) + (element.id[9]) : (element.id[8]) + (element.id[9]) + element.id[10])

        // console.log("Fullscreen " + id + " " + Date.now() - checkWaitOrPlay.current[id])
        console.log("grid id is" + id)
        const gridValue = grid
        if (element.classList.contains('fb-100')) {
            if (waitOrPlay.current[id] == 'l' && (Date.now() - checkWaitOrPlay.current[id]) <= 2500) {
                return
            }
            // setGrid(previousGrid)
            element.classList.toggle('fb-100')

            for (let i = 0; i < ((gridValue + 1) * (gridValue + 1)); i++) {
                document.getElementById('vid-div-' + parseInt(i)).classList.toggle('hidden')
            }
            element.classList.toggle('hidden')
            if (videoLoaded.current[id]) {
                // removeVideo(videoCount)
                // document.getElementById('cen-'+parseInt(id))
                // document.getElementById('hls-' + parseInt(videoCount)).controls = false
                var url = wsUrl + document.getElementById('cen-' + parseInt(id)).innerText
                hlsArr.current[id].hls.detachMediaElement()
                hlsArr.current[id].hls.destroy()
                // hlsArr.current[id].hls = new Hls(config)
                // hlsArr.current[id].hls.loadSource(url)
                await createHLS(url, document.getElementById('hls-' + parseInt(id)), id)
                // hlsArr.current[id].hls.attachMedia(document.getElementById('hls-' + parseInt(id)))
                // cameraSet.delete(document.getElementById('cen-' + parseInt(videoCount)).innerText)
                return
            }
        }
        else {

            if (waitOrPlay.current[id] == 'l') {
                return
            }
            setPreviousGrid(grid)
            element.classList.toggle('fb-100')

            for (let i = 0; i < ((gridValue + 1) * (gridValue + 1)); i++) {
                console.log("i is = " + i)
                document.getElementById('vid-div-' + parseInt(i)).classList.toggle('hidden')
            }
            element.classList.toggle('hidden')
            if (videoLoaded.current[id]) {
                // removeVideo(videoCount)
                // document.getElementById('cen-'+parseInt(id))
                // document.getElementById('hls-' + parseInt(videoCount)).controls = false
                var url = wsUrl + document.getElementById('cen-' + parseInt(id)).innerText + '*'
                hlsArr.current[id].hls.detachMediaElement()
                hlsArr.current[id].hls.destroy()
                // hlsArr.current[id].hls = new Hls(config)
                // hlsArr.current[id].hls.loadSource(url)
                await createHLS(url, document.getElementById('hls-' + parseInt(id)), id)
                // hlsArr.current[id].hls.attachMedia(document.getElementById('hls-' + parseInt(id)))
                // cameraSet.delete(document.getElementById('cen-' + parseInt(videoCount)).innerText)
                return
            }
            // setGrid(0)
        }

    }







    // function recordClip(){
    //   if(startVideo==false){
    //     setStartVideo(true)
    //     const video =  document.getElementById('hls-0')
    //   }
    // }





    return (
        <>
            <Navbar />
            <div id="snackbar">Motion Detected</div>
            <div className="w-full text-left bg-gray-700">
                <button onClick={() => setIsActive(current => !current)} className="mt-1 mb-1 ml-2 text-white focus:ring-4 font-medium rounded-md text-sm px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800" type="button" data-drawer-target="drawer-navigation" data-drawer-show="drawer-navigation" aria-controls="drawer-navigation">
                    Select Cameras <FontAwesomeIcon className='ml-1' icon={faCamera} />
                </button>
                <button onClick={() => setPtzActive(current => {
                    if (current)
                        return current
                    else
                        return !current
                })} className="mt-1 mb-1 ml-2 text-white focus:ring-4 font-medium rounded-md text-sm px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800" type="button" data-drawer-target="drawer-right" data-drawer-show="drawer-right" data-drawer-placement="right" aria-controls="drawer-right">
                    PTZ Controls
                </button>
                <button id="dropdownNavbarLinkx" data-dropdown-toggle="dropdownNavbargrid" className="inline-flex items-center mt-1 mb-1 ml-2 text-white focus:ring-4 font-medium rounded-md text-sm px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800">
                    Grid<svg className="w-5 h-5 ml-1" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    <div id="dropdownNavbargrid" className="z-10 hidden font-normal divide-y rounded-lg shadow w-16 bg-white divide-gray-600">
                        <ul className="text-sm text-gray-700 text-black" aria-labelledby="dropdownLargeButton">
                            <li>

                                <button id="1-grid" onClick={() => {
                                    sessionStorage.setItem('grid', 0)
                                    setGrid(0)
                                }
                                }
                                    className="mt-1 mb-1 ml-1 text-white focus:ring-4 font-medium rounded-md text-md px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800" >
                                    1x1
                                </button>
                            </li>
                            <li>

                                <button id="2-grid" onClick={() => {
                                    sessionStorage.setItem('grid', 1)
                                    setGrid(1)
                                }} className="mt-1 mb-1 ml-1 text-white focus:ring-4 font-medium rounded-md text-md px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800" >
                                    2x2
                                </button>
                            </li>
                            <li>

                                <button id="3-grid" onClick={() => {
                                    sessionStorage.setItem('grid', 2)
                                    setGrid(2)
                                }} className="mt-1 mb-1 ml-1 text-white focus:ring-4 font-medium rounded-md text-md px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800" >
                                    3x3
                                </button>
                            </li>
                            <li>

                                <button id="4-grid" onClick={() => {
                                    sessionStorage.setItem('grid', 3)
                                    setGrid(3)
                                }} className="mt-1 mb-1 ml-1 text-white focus:ring-4 font-medium rounded-md text-md px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800" >
                                    4x4
                                </button>
                            </li>
                            <li>

                                <button id="5-grid" onClick={() => {
                                    sessionStorage.setItem('grid', 4)
                                    setGrid(4)
                                }} className="mt-1 mb-1 ml-1 text-white focus:ring-4 font-medium rounded-md text-md px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800" >
                                    5x5
                                </button>
                            </li>
                            <li>

                                <button id="6-grid" onClick={() => {
                                    sessionStorage.setItem('grid', 5)
                                    setGrid(5)
                                }} className="mt-1 mb-1 ml-1 text-white focus:ring-4 font-medium rounded-md text-md px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800" >
                                    6x6
                                </button>
                            </li>
                            <li>

                                <button id="7-grid" onClick={() => {
                                    sessionStorage.setItem('grid', 6)
                                    setGrid(6)
                                }} className="mt-1 mb-1 ml-1 text-white focus:ring-4 font-medium rounded-md text-md px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800" >
                                    7x7
                                </button>
                            </li>
                            <li>

                                <button id="8-grid" onClick={() => {
                                    sessionStorage.setItem('grid', 7)
                                    setGrid(7)
                                }} className="mt-1 mb-1 ml-1 text-white focus:ring-4 font-medium rounded-md text-md px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800" >
                                    8x8
                                </button>
                            </li>
                            <li>

                                <button id="9-grid" onClick={() => {
                                    sessionStorage.setItem('grid', 8)
                                    setGrid(8)
                                }} className="mt-1 mb-1 ml-1 text-white focus:ring-4 font-medium rounded-md text-md px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800" >
                                    9x9
                                </button>
                            </li>
                            <li>

                                <button id="10-grid" onClick={() => {
                                    sessionStorage.setItem('grid', 9)

                                    setGrid(9)
                                }} className="mt-1 mb-1 ml-1 text-white focus:ring-4 font-medium rounded-md text-xs px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800" >
                                    10x10
                                </button>
                            </li>
                            <li>

                                <button id="10-grid" onClick={() => {
                                    sessionStorage.setItem('grid', 14)
                                    setGrid(14)
                                }} className="mt-1 mb-1 ml-1 text-white focus:ring-4 font-medium rounded-md text-xs px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800" >
                                    15x15
                                </button>
                            </li>
                        </ul>
                    </div>
                </button>
                <button id="dropdownNavbarLinkR" data-dropdown-toggle="dropdownNavbarrotate" className="inline-flex items-center mt-1 mb-1 ml-2 text-white focus:ring-4 font-medium rounded-md text-sm px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800">
                    Rotate<svg className="w-5 h-5 ml-1" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    <div id="dropdownNavbarrotate" className="z-10 hidden font-normal divide-y rounded-lg shadow w-16 bg-white divide-gray-600">
                        <ul onClick={(e) => { e.preventDefault() }} className="text-sm text-gray-700 text-black" aria-labelledby="dropdownLargeButton">
                            <li>

                                <button onClick={() => setRotate(15)} className="mt-1 mb-1 ml-1 text-white focus:ring-4 font-medium rounded-md text-md px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800" >
                                    15s
                                </button>
                            </li>
                            <li>

                                <button onClick={() => setRotate(30)} className="mt-1 mb-1 ml-1 text-white focus:ring-4 font-medium rounded-md text-md px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800" >
                                    30s
                                </button>
                            </li>
                            <li>

                                <button onClick={() => setRotate(45)} className="mt-1 mb-1 ml-1 text-white focus:ring-4 font-medium rounded-md text-md px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800" >
                                    45s
                                </button>
                            </li>
                            <li>

                                <button onClick={() => setRotate(60)} className="mt-1 mb-1 ml-1 text-white focus:ring-4 font-medium rounded-md text-md px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800" >
                                    60s
                                </button>
                            </li>
                            <li>
                                <button onClick={handleRotateModal} className="mt-1 mb-1 ml-1 text-white focus:ring-4 font-medium rounded-md text-sm px-1 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800">
                                    Custom</button>
                            </li>

                            <li>

                                <button onClick={() => setRotate(0)} className="mt-1 mb-1 ml-1 text-white focus:ring-4 font-medium rounded-md text-xs px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800" >
                                    No Rotate
                                </button>
                            </li>
                        </ul>
                    </div>
                </button>

                <button onClick={() => { removeAll() }} className="mt-1 mb-1 ml-2 text-white focus:ring-4 rounded-md text-sm px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800" type="button">
                    Remove All <FontAwesomeIcon className='ml-1' icon={faTimes} />
                </button>

                <button onClick={() => { reloadAll() }} className="mt-1 mb-1 ml-2 text-white focus:ring-4 rounded-md text-sm px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800" type="button">
                    Reload All <FontAwesomeIcon className='ml-1' icon={faRefresh} />
                </button>

                <button onClick={() => {
                    setEventPopUp(popUp => {
                        return !popUp
                    })
                }} className="mt-1 ml-2 text-white focus:ring-4 rounded-md text-sm px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800">
                    {eventPopUp ?
                        <label htmlFor="Event Pop-Up Off" className=" inline-flex items-center cursor-pointer">
                            <span className="relative">
                                <span className="block w-10 h-4 bg-gray-400 rounded-full shadow-inner"></span>
                                <span className="absolute block w-4 h-2 mt-1 ml-1 bg-white rounded-full shadow inset-y-0 left-0 focus-within:shadow-outline transition-transform duration-300 ease-in-out">
                                    <input id="unchecked" type="checkbox" className="absolute opacity-0 w-0 h-0" />
                                </span>
                            </span>
                            <span className="ml-3 text-sm">Event Pop-Up Off</span>
                        </label>
                        :
                        <label htmlFor="Event Pop-Up On" className=" inline-flex items-center cursor-pointer">
                            <span className="relative">
                                <span className="block w-10 h-4 bg-gray-400 rounded-full shadow-inner"></span>
                                <span className="absolute block w-4 h-2 mt-1 ml-1 rounded-full shadow inset-y-0 left-0 focus-within:shadow-outline transition-transform duration-300 ease-in-out bg-blue-500 transform translate-x-full">
                                    <input id="checked" type="checkbox" class="absolute opacity-0 w-0 h-0" />
                                </span>
                            </span>
                            <span className="ml-3 text-sm">Event Pop-Up On</span>
                        </label>

                    }
                </button>
                {/* <button onClick={() => setRotate(rotate => !rotate)} className={"mt-1 mb-1 ml-2 text-white focus:ring-4 font-medium rounded-md text-sm px-2.5 py-1.5 mr-2 hover:bg-blue-700 focus:outline-none focus:ring-blue-800 " + (rotate ? " bg-blue-700" : " bg-gray-600")} type="button">
          Rotate<FontAwesomeIcon className='ml-1' icon={faRetweet} />
        </button> */}

            </div>
            <div id="drawer-navigation" className="fixed top-12 left-0 z-40 w-64 h-screen p-4 overflow-y-auto transition-transform -translate-x-full bg-gray-800" tabIndex="-1" aria-labelledby="drawer-navigation-label">
                {/* <h5 id="drawer-navigation-label" className="text-base font-semibold uppercase text-gray-400">Menu</h5> */}
                <Link
                    to="/AddGroup"
                    className='text-base font-semibold uppercase text-gray-400'
                >
                    Add Group +
                </Link>
                {/* <button onClick={handleAddGroup} id="drawer-group-add" className='text-base font-semibold uppercase text-gray-400'>Add Group +</button> */}
                <button onClick={() => handleClick()} type="button" data-drawer-hide="drawer-navigation" aria-controls="drawer-navigation" className="text-gray-400 bg-transparent rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center hover:bg-gray-600 hover:text-white" >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <span className="sr-only">Close menu</span>
                </button>
                <div className="py-4 overflow-y-auto">
                    <ul className="space-y-2 font-medium mt-2">
                        {
                            groups.map((group, index) => {
                                return (
                                    <li>
                                        <ul className="space-y-2 text-white font-medium mt-2">
                                            <div className='flex'>

                                                <span draggable="true" onDragStart={(ev) => dragStartHandleGroup(ev)} onClick={() => {
                                                    playGroup(group)
                                                }} className='flex'>
                                                    {group.group_name ? group.group_name : group.all_cameras_group}
                                                </span>
                                                <FaChevronDown onClick={() => {
                                                    if (expand != index)
                                                        setExpand(index)
                                                    else
                                                        setExpand(-1)
                                                    console.log(index)
                                                }
                                                } className='ml-1 mt-1' />
                                            </div>

                                            {(expand == index) && (group.camera_groups ? group.camera_groups.map(device => {
                                                if (device.device_name)
                                                    return (
                                                        <li onClick={() => setExpand(index)} draggable="true" onDragStart={(ev) => dragStartHandle(ev)}>
                                                            <a onClick={() => setExpand(index)} href="#" className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700">
                                                                <FaVideo />
                                                                <span onClick={(event) => { console.log(index); addVideo(event) }} className="w-full ml-3">{device.device_name}</span>
                                                            </a>
                                                        </li>
                                                    )
                                                else
                                                    return
                                            }) : group.all_cameras.map(device => {
                                                if (device.device_name)
                                                    return (
                                                        <li onClick={() => setExpand(index)} draggable="true" onDragStart={(ev) => dragStartHandle(ev)}>
                                                            <a onClick={() => setExpand(index)} href="#" className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700">
                                                                <FaVideo />
                                                                <span onClick={(event) => { console.log(index); addVideo(event) }} className="w-full ml-3">{device.device_name}</span>
                                                            </a>
                                                        </li>
                                                    )
                                                else
                                                    return
                                            }))}

                                        </ul>
                                    </li>
                                )
                            })
                        }
                        {/* {
              cameraList.map(camera => {
                return (
                  <li draggable="true" onDragStart={(ev) => dragStartHandle(ev)}>
                    <a href="#" className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700">
                      <FaVideo />
                      <span onClick={(event) => addVideo(event)} className="w-full ml-3">{camera}</span>
                    </a>
                  </li>
                )
              })
            } */}
                    </ul>
                </div>
            </div>


            <div id="drawer-right" className="fixed top-12 right-0 z-40 w-64 h-screen p-4 overflow-y-auto transition-transform translate-x-full bg-gray-800" tabindex="-1" aria-labelledby="drawer-right-label">
                <h2 id="drawer-right-label" className="inline-flex items-center mb-4 font-semibold text-gray-400">
                    PTZ Controls</h2>

                <div className='left-12 flex flex-col'>
                    <div className="inline-flex items-center text-center mb-4 font-semibold text-gray-400">Selected Camera: {currentCam}</div>
                    <div className="ml-3 inline-flex rounded-md shadow-sm" role="group">
                        <button onMouseDown={() => { continuePtzUpLeft() }} onClick={() => { ptzUpLeft() }} type="button" className="px-4 py-2 text-4xl font-medium bg-transparent border rounded-s-lg focus:z-10 focus:ring-2 focus:ring-gray-500 focus:text-white border-white text-white hover:text-blue-500 hover:bg-gray-700 focus:bg-gray-700">
                            <FaArrowUp className='up-left' />
                        </button>
                        <button onMouseDown={() => { continuePtzUp() }} onClick={() => { ptzUp() }} type="button" className="px-4 py-2 text-4xl font-medium bg-transparent border rounded-s-lg focus:z-10 focus:ring-2 focus:ring-gray-500 focus:text-white border-white text-white hover:text-blue-500 hover:bg-gray-700 focus:bg-gray-700">
                            <FaArrowUp />
                        </button>
                        <button onMouseDown={() => { continuePtzUpRight() }} onClick={() => { ptzUpRight() }} type="button" className="px-4 py-2 text-4xl font-medium bg-transparent border rounded-s-lg focus:z-10 focus:ring-2 focus:ring-gray-500 focus:text-white border-white text-white hover:text-blue-500 hover:bg-gray-700 focus:bg-gray-700">
                            <FaArrowUp className='up-right' />
                        </button>
                    </div>
                    <div className="ml-3 inline-flex rounded-md shadow-sm" role="group">
                        <button onMouseDown={() => { continuePtzLeft() }} onClick={() => { ptzLeft() }} type="button" className="px-4 py-2 text-4xl font-medium bg-transparent border rounded-s-lg focus:z-10 focus:ring-2 focus:ring-gray-500 focus:text-white border-white text-white hover:text-blue-500 hover:bg-gray-700 focus:bg-gray-700">
                            <FaArrowLeft />
                        </button>
                        <button onClick={() => { gotoHomePosition() }} type="button" className="px-4 py-2 text-4xl font-medium bg-transparent border rounded-s-lg focus:z-10 focus:ring-2 focus:ring-gray-500 focus:text-white border-white text-white hover:text-blue-500 hover:bg-gray-700 focus:bg-gray-700">
                            <FaDotCircle />
                        </button>
                        <button onMouseDown={() => { continuePtzRight() }} onClick={() => { ptzRight() }} type="button" className="px-4 py-2 text-4xl font-medium bg-transparent border rounded-s-lg focus:z-10 focus:ring-2 focus:ring-gray-500 focus:text-white border-white text-white hover:text-blue-500 hover:bg-gray-700 focus:bg-gray-700">
                            <FaArrowRight />
                        </button>
                    </div>
                    <div className="ml-3 inline-flex rounded-md shadow-sm" role="group">
                        <button onMouseDown={() => { continuePtzDownLeft() }} onClick={() => { ptzDownLeft() }} type="button" className="px-4 py-2 text-4xl font-medium bg-transparent border rounded-s-lg focus:z-10 focus:ring-2 focus:ring-gray-500 focus:text-white border-white text-white hover:text-blue-500 hover:bg-gray-700 focus:bg-gray-700">
                            <FaArrowLeft className='down-left' />
                        </button>
                        <button onMouseDown={() => { continuePtzDown() }} onClick={() => { ptzDown() }} type="button" className="px-4 py-2 text-4xl font-medium bg-transparent border rounded-s-lg focus:z-10 focus:ring-2 focus:ring-gray-500 focus:text-white border-white text-white hover:text-blue-500 hover:bg-gray-700 focus:bg-gray-700">
                            <FaArrowDown />
                        </button>
                        <button onMouseDown={() => { continuePtzDownRight() }} onClick={() => { ptzDownRight() }} type="button" className="px-4 py-2 text-4xl font-medium bg-transparent border rounded-s-lg focus:z-10 focus:ring-2 focus:ring-gray-500 focus:text-white border-white text-white hover:text-blue-500 hover:bg-gray-700 focus:bg-gray-700">
                            <FaArrowRight className='down-right' />
                        </button>
                    </div>
                </div>
                <button onClick={() => { setPtzActive(current => !current) }} type="button" data-drawer-hide="drawer-right" aria-controls="drawer-right" className="text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center hover:bg-gray-600 hover:text-blue-500" >
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                    <span className="sr-only">Close menu</span>
                </button>
                <div className='flex justify-between text-lg text-white mt-8'>
                    <FaPlus onMouseDown={() => { continuePtzZoomIn() }} onClick={() => { ptzZoomIn() }} className='rounded-full border-2 border-white hover:text-blue-500' />
                    Zoom
                    <FaMinus onMouseDown={() => { continuePtzZoomOut() }} onClick={() => { ptzZoomOut() }} className='rounded-full border-2 border-white hover:text-blue-500' />
                </div>
                <div className='flex justify-between text-lg text-white mt-8'>
                    <FaPlus onClick={() => { increaseFocus() }} className='rounded-full border-2 border-white hover:text-blue-500' />
                    Focus
                    <FaMinus onClick={() => { decreaseFocus() }} className='rounded-full border-2 border-white hover:text-blue-500' />
                </div>
                <div className='flex justify-between text-lg text-white mt-8'>
                    <FaPlus onClick={() => { increaseIris() }} className='rounded-full border-2 border-white hover:text-blue-500' />
                    Iris
                    <FaMinus onClick={() => { decreaseIris() }} className='rounded-full border-2 border-white hover:text-blue-500' />
                </div>
                <div onClick={() => { setHomePosition() }} className='text-center text-lg text-white mt-8 rounded-full border-2 border-white hover:text-blue-500 hover:bg-gray-700'>
                    Set Home Position
                </div>
            </div>
            {/* <aside id="logo-sidebar" className="fixed left-0 z-0 w-60 h-screen transition-transform -translate-x-full border-r sm:translate-x-0 bg-gray-900 border-gray-900" aria-label="Sidebar">
        <div className="h-full px-3 pb-4 overflow-y-auto bg-gray-900">
          <ul className="space-y-2 font-medium mt-2">
            {
              cameraList.map(camera => {
                return (
                  <li>
                    <a href="#" className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700">
                      <FaVideo />
                      <span onClick={(event) => addVideo(event)} className="w-full ml-3">{camera}</span>
                    </a>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </aside> */}
            <div id="vid-box" className={"h-full" + (isActive ? " sm:ml-64" : " ") + (ptzActive ? " sm:mr-64" : " ")}>
                <div className="rounded-lg border-gray-700">

                    <div className={"flexing "}>
                        {/* <VideoMatrix grid = {grid} setGrid = {setGrid}/> */}
                        {(() => {
                            let list = []
                            for (let i = 0; i < 225; i++) {
                                list.push(
                                    <div id={"vid-div-" + i} onDoubleClick={(e) => { fullscreen(e) }} className={"vid-div" +
                                        ((grid == 0) ? (i <= 0 ? " fb-100 " : " hidden") :
                                            ((grid == 1) ? (i <= 3 ? " fb-50" : " hidden") :
                                                ((grid == 2) ? (i <= 8 ? " fb-33" : " hidden") :
                                                    ((grid == 3) ? (i <= 15 ? " fb-25" : " hidden") :
                                                        ((grid == 4) ? (i <= 24 ? " fb-20" : " hidden") :
                                                            ((grid == 5) ? (i <= 35 ? " fb-16" : " hidden") :
                                                                ((grid == 6) ? (i <= 48 ? " fb-14" : " hidden") :
                                                                    ((grid == 7) ? (i <= 63 ? " fb-12" : " hidden") :
                                                                        ((grid == 8) ? (i <= 80 ? " fb-11" : " hidden") :
                                                                            ((grid == 9) ? (i <= 99 ? " fb-10" : " hidden") :
                                                                                ((grid == 14) ? (i <= 224 ? " fb-5" : " hidden") : " hidden")))))))))))}>
                                        <div className={'remover flex justify-between h-min w-full text-xs text-white bg-gray-900'}>
                                            <div>
                                                <button className="ml-1 mt-1 text-xs" onClick={() => snapshot(i)}>
                                                    <FontAwesomeIcon className='mr-2' icon={faCamera} />
                                                </button>
                                                <button onClick={() => reloadVideo(i)}>
                                                    <FontAwesomeIcon className='mr-2' icon={faRefresh} />
                                                </button>
                                                {startStopRecording[i] ?
                                                    <button onClick={() => startRecording(i)}>
                                                        <FontAwesomeIcon className='mr-2' icon={faRecordVinyl} />
                                                    </button> :
                                                    <button onClick={() => stopRecording(i)}>
                                                        <FontAwesomeIcon className='mr-2 text-red-500' icon={faRecordVinyl} />
                                                    </button>
                                                }
                                            </div>
                                            <div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id={"cen-" + i}></div>
                                            <button onClick={() => removeVideo(i)}>
                                                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                            </button>
                                        </div>
                                        <video onEnded={(e) => { checkwait(e) }} onWaiting={(e) => { checkwait(e) }} onPlaying={(e) => { checkplay(e) }} onStalled={(e) => { checkwait(e) }} onSuspend={(e) => { checkwait(e) }} muted onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id={'hls-' + i} poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                                    </div>
                                )
                            }
                            return list
                        })()}
                        <RotateModal showRotate={showRotate} setRotate={setRotate} onClose={handleRotateClose} />
                        <SnapModal dataUrl={dataUrl.current} showSnap={showSnap} onClose={handleSnapClose} />
                        <MotionDetectionModal motionVideo={motionVideoRef} video={videoURL} showMotion={showMotion} onClose={handleMotionClose} />
                    </div>
                </div>
            </div>
        </>
    );
}
