import '../App.css';
import Hls from 'hls.js';
import React, { useRef } from 'react';
import { useEffect } from 'react';
import Navbar from '../Components/Navbar';
import { FaArrowDown, FaCamera, FaChevronDown, FaVideo } from 'react-icons/fa';
import { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCamera, faRectangleXmark, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FaAlignCenter, FaArrowLeft, FaArrowRight, FaArrowUp, FaDotCircle, FaMinus, FaPlus } from 'react-icons/fa';

import AddGroupModal from './AddGroupModal'
import RotateModal from './RotateModal'
import SnapModal from './SnapModal';
import MotionDetectionModal from './MotionDetectionModal';
import { Link } from 'react-router-dom';
export default function LiveStream() {
  const api_node = localStorage.getItem('api_node')
  const apiUrl = localStorage.getItem('api')
  const interval = useRef()
  const [expand, setExpand] = useState(-1)
  const [eventPopUp, setEventPopUp] = useState(true)
  const [customRotate, setCustomRotate] = useState(false)
  const [ptzCamerasList, setPtzCamerasList] = useState({})
  const [currentCam, setCurrentCam] = useState("")
  const [cameraList, setCameraList] = useState([])
  const [rotateList, setRotateList] = useState([])
  const [dataUrl, setDataUrl] = useState("")
  const [ptzActive, setPtzActive] = useState(false)
  const [grid, setGrid] = useState(2)
  const [groups, setGroups] = useState([])
  const [isActive, setIsActive] = useState(false);
  const [videoCount, setVideoCount] = useState(0);
  const [rotate, setRotate] = useState(0)
  const [showMotion, setShowMotion] = useState(false)
  const [motionVideo, setMotionVideo] = useState(false)
  const [showRotate, setShowRotateModal] = useState(false)
  const [showSnap, setShowSnap] = useState(false)
  // const [showModal, setShowModal] = useState(false)
  const [hlsArr, setHlsArr] = useState([{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]);
  const [vidLoadArr, setVidLoadArr] = useState([false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false])
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
    hls.detachMedia();
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
  async function createHLS(hls, url, vid) {
    vid.controls = false
    hls.on(Hls.Events.MEDIA_ATTACHED, function () {
      console.log('video and hls.js are now bound together !');
    });
    hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
      console.log(
        'manifest loaded, found ' + data.levels.length + ' quality level'
      );
    });

    hls.on(Hls.Events.ERROR, function (event, data) {
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            // try to recover network error
            console.log('fatal network error encountered, try to recover');
            hls.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            console.log('fatal media error encountered, try to recover');
            hls.recoverMediaError();
            break;
          default:
            // cannot recover
            hls.destroy();
            break;
        }
      }
    });
    hls.loadSource(url);
    // bind them together
    hls.attachMedia(vid);
    // vid.play().catch(e=>{console.log(e)})
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

      setPtzCamerasList(() => {
        let retlist = {};
        groupData.data.map(group => {
          if (group.all_cameras_group) {
            group.all_cameras.map(device => { retlist[device.device_name] = [device.ip_address, device.username, device.password] })
          }
        })
        return retlist
      })

      setCameraList(() => {
        let retlist = []
        try {

          groupData.data.map(group => {
            if (group.all_cameras_group) {
              group.all_cameras.map(device => { retlist.push(device.device_name) })
            }
          })
        } catch (e) { console.log(e) }
        return retlist
      })
      console.log("List is" + cameraList)
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
    if (sessionStorage.getItem('grid')) {
      setGrid(parseInt(sessionStorage.getItem('grid')))
    }
    for (let i = 0; i < 36; i++) {
      let vid = document.getElementById('hls-' + parseInt(i))
      vid.controls = false
      vid.addEventListener('canplay', () => {
        // vid.controls = true
      })
      if (sessionStorage.getItem('hls-' + i)) {
        setVidLoadArr(vidLoadArr => {
          const tempArr = vidLoadArr;
          tempArr[i] = true;
          return tempArr
        })
        // vidLoadArr[videoCount]=true;
        const hls = new Hls(config)
        const video = document.getElementById('hls-' + parseInt(i));
        const center = document.getElementById('cen-' + parseInt(i))
        center.innerText = sessionStorage.getItem('hls-' + i)
        const url = apiUrl + "LiveStreams/" + sessionStorage.getItem('hls-' + i) + "/2"+"/index2.m3u8"
        console.log("url is " + url)
        setHlsArr((hlsArr) => {
          const tempArr = [...hlsArr];
          tempArr[i] = {
            'hls': hls,
            'url': url,
            'video': video,
          }
          return tempArr;
        })
        await createHLS(hls, url, video)
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
  window.addEventListener("error", (event) => {
    event.preventDefault();
    console.log({ message: event.message });
  });

  window.addEventListener("unhandledrejection", (event) => {
    event.preventDefault();
    console.log({ message: event.reason.message });
  });

  window.onerror = function (message, source, lineno, colno, error) {
    // Log the error details or send them to a logging service
    console.error('Error:', message);
    console.error('Source:', source);
    console.error('Line Number:', lineno);
    console.error('Column Number:', colno);
    console.error('Error Object:', error);

    // Return true to prevent the default browser error handling
    return true;
  };

  useEffect(() => {
    console.log(groups)
    console.log("heehaw")
    for (let group of groups)
      console.log(group)
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
  }, [rotate, grid, rotateList])

  useEffect(() => {
    getCamerasList();
    firstLoad();
    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
      for (var i in hlsArr) {
        if (hlsArr[i].hls)
          hlsArr[i].hls.destroy()
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
      console.log('websocket data is ' + event.data)
      console.log('devce is'+ data.device_name)
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
        if(!showMotion){
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


  

  var config = {
    maxBufferLength: 30,
    liveSyncDurationCount: 1,
    liveMaxLatencyDurationCount: 2,
  }





  async function addVideo(event) {
    setRotateList(rotateList => {
      const anr = [...rotateList]
      anr.push(event.target.innerText)
      return anr
    })
    console.log("event.target.value = " + event.target.innerText)
    sessionStorage.setItem('hls-' + parseInt(videoCount), event.target.innerText)
    // cameraSet.add(event.target.innerText)

    if (vidLoadArr[videoCount]) {
      // removeVideo(videoCount)
      document.getElementById('hls-' + parseInt(videoCount)).controls = false
      var url = apiUrl + "LiveStreams/" + event.target.innerText + "/2"+"/index2.m3u8"
      hlsArr[videoCount].hls.detachMedia()
      hlsArr[videoCount].hls.destroy()
      hlsArr[videoCount].hls = new Hls(config)
      hlsArr[videoCount].hls.loadSource(url)
      hlsArr[videoCount].hls.attachMedia(document.getElementById('hls-' + parseInt(videoCount)))
      // cameraSet.delete(document.getElementById('cen-' + parseInt(videoCount)).innerText)



      document.getElementById('cen-' + parseInt(videoCount)).innerText = event.target.innerText
      setVideoCount((videoCount + 1) % ((grid + 1) * (grid + 1)))
      return
    }
    setVidLoadArr(vidLoadArr => {
      let tempArr = vidLoadArr;
      tempArr[videoCount] = true;
      return tempArr
    })
    // vidLoadArr[videoCount]=true;
    var hls = new Hls(config)
    var video = document.getElementById('hls-' + parseInt(videoCount));
    const center = document.getElementById('cen-' + parseInt(videoCount))
    center.innerText = event.target.innerText
    console.log("text = " + document.getElementById('cen-' + parseInt(videoCount)).innerText)

    console.log("video id = " + 'hls-' + parseInt(videoCount))
    var url = apiUrl + "LiveStreams/" + event.target.innerText + "/2"+"/index2.m3u8"
    await createHLS(hls, url, video)
    setHlsArr((hlsArr) => {
      let tempArr = hlsArr;
      tempArr[videoCount] = {
        'hls': hls,
        'url': url,
        'video': video,
      }
      return tempArr;
    })
    setVideoCount((videoCount + 1) % ((grid + 1) * (grid + 1)))

  }
  function sessionremove(videoC) {
    sessionStorage.removeItem('hls-' + parseInt(videoC))
    return
  }

  function removeVideo(videoC) {
    if (vidLoadArr[videoC]) {
      try {
        document.getElementById('hls-' + parseInt(videoC)).controls = false
        const center = document.getElementById('cen-' + parseInt(videoC))
        // cameraSet.delete(center.innerText)

        center.innerText = ""
        hlsArr[videoC].hls.detachMedia()
        hlsArr[videoC].hls.destroy()
        console.log("url = " + hlsArr[videoC].url)
        console.log("index = " + videoC)
        vidLoadArr[videoC] = false;
        setVideoCount((videoC) % 6)
        setHlsArr((hlsArr) => {
          let tempArr = hlsArr;
          tempArr[videoC] = {}
          return tempArr;
        })
        sessionremove(videoC)
        return

      } catch (e) {
        console.log(e)
      }
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
      setRotateList(rotateList => {
        const anr = [...rotateList]
        anr.push(cameraName)
        return anr
      })
      setVideoCount(parseInt(id[4]))
      // videoCount = parseInt(id[4])
      let vidc
      if (id.length === 5)
        vidc = parseInt(id[4])
      else
        vidc = id[4] + id[5]
      sessionStorage.setItem('hls-' + parseInt(vidc), cameraName)
      if (vidLoadArr[vidc]) {
        document.getElementById('hls-' + parseInt(vidc)).control = false
        // removeVideo(videoCount)
        var url = apiUrl + "LiveStreams/" + cameraName + "/2"+"/index2.m3u8"
        hlsArr[vidc].hls.detachMedia()
        hlsArr[vidc].hls.destroy()
        hlsArr[vidc].hls = new Hls(config)
        hlsArr[vidc].hls.loadSource(url)
        hlsArr[vidc].hls.attachMedia(document.getElementById('hls-' + parseInt(vidc)))
        document.getElementById('cen-' + parseInt(vidc)).innerText = cameraName
        setVideoCount((vidc + 1) % ((grid + 1) * (grid + 1)))
        return
      }
      setVidLoadArr(vidLoadArr => {
        let tempArr = vidLoadArr;
        tempArr[vidc] = true;
        return tempArr
      })
      // vidLoadArr[videoCount]=true;
      var hls = new Hls(config)
      var video = document.getElementById('hls-' + parseInt(vidc));
      const center = document.getElementById('cen-' + parseInt(vidc))
      center.innerText = cameraName
      console.log("text = " + document.getElementById('cen-' + parseInt(vidc)).innerText)

      console.log("video id = " + 'hls-' + parseInt(vidc))
      var url = apiUrl + "LiveStreams/" + cameraName + "/2"+"/index2.m3u8"
      await createHLS(hls, url, video)
      setHlsArr((hlsArr) => {
        let tempArr = hlsArr;
        tempArr[vidc] = {
          'hls': hls,
          'url': url,
          'video': video,
        }
        return tempArr;
      })
      setVideoCount((vidc + 1) % ((grid + 1) * (grid + 1)))
    }
    else if (flagForVideoDrag == true) {
      const video1Id = ev.dataTransfer.getData("text")
      const video2Id = ev.target.id
      let vidcount1, vidcount2;
      if (video1Id.length === 5)
        vidcount1 = video1Id[4]
      else
        vidcount1 = video1Id[4] + video1Id[5]
      if (video2Id.length === 5)
        vidcount2 = video2Id[4]
      else
        vidcount2 = video2Id[4] + video2Id[5]
      const cameraName1 = document.getElementById('cen-' + vidcount1).innerText
      const cameraName2 = document.getElementById('cen-' + vidcount2).innerText
      console.log("camera1 " + cameraName1)
      console.log("camera2 " + cameraName2)
      sessionStorage.setItem('hls-' + parseInt(vidcount2), cameraName1)
      sessionStorage.setItem('hls-' + parseInt(vidcount1), cameraName2)
      if (vidLoadArr[vidcount1] && vidLoadArr[vidcount2]) {
        document.getElementById('hls-' + parseInt(vidcount1)).controls = false
        var url = apiUrl + "LiveStreams/" + cameraName2 + "/2"+"/index2.m3u8"
        hlsArr[vidcount1].hls.detachMedia()
        hlsArr[vidcount1].hls.destroy()
        hlsArr[vidcount1].hls = new Hls(config)
        hlsArr[vidcount1].hls.loadSource(url)
        hlsArr[vidcount1].hls.attachMedia(document.getElementById('hls-' + parseInt(vidcount1)))
        document.getElementById('cen-' + parseInt(vidcount1)).innerText = cameraName2


        document.getElementById('hls-' + parseInt(vidcount2)).controls = false
        url = apiUrl + "LiveStreams/" + cameraName1 + "/2"+"/index2.m3u8"
        hlsArr[vidcount2].hls.detachMedia()
        hlsArr[vidcount2].hls.destroy()
        hlsArr[vidcount2].hls = new Hls(config)
        hlsArr[vidcount2].hls.loadSource(url)
        hlsArr[vidcount2].hls.attachMedia(document.getElementById('hls-' + parseInt(vidcount2)))
        document.getElementById('cen-' + parseInt(vidcount2)).innerText = cameraName1
        setVideoCount((vidcount2) % ((grid + 1) * (grid + 1)))
      }
      else if (vidLoadArr[vidcount1] && !vidLoadArr[vidcount2]) {
        document.getElementById('hls-' + parseInt(vidcount1)).controls = false
        document.getElementById('hls-' + parseInt(vidcount2)).controls = false
        hlsArr[vidcount1].hls.detachMedia()
        hlsArr[vidcount1].hls.destroy()
        setVidLoadArr(vidLoadArr => {
          let tempArr = vidLoadArr;
          tempArr[vidcount1] = false;
          tempArr[vidcount2] = true;
          return tempArr
        })
        var hls = new Hls(config)
        var video = document.getElementById('hls-' + parseInt(vidcount2));
        const center = document.getElementById('cen-' + parseInt(vidcount2))
        document.getElementById('cen-' + parseInt(vidcount1)).innerText = ""
        center.innerText = cameraName1
        // console.log("text = " + document.getElementById('cen-' + parseInt(vidc)).innerText)
        // console.log("video id = " + 'hls-' + parseInt(vidc))
        var url = apiUrl + "LiveStreams/" + cameraName1 + "/2"+"/index2.m3u8"
        await createHLS(hls, url, video)
        setHlsArr((hlsArr) => {
          let tempArr = hlsArr;
          tempArr[vidcount2] = {
            'hls': hls,
            'url': url,
            'video': video,
          }
          return tempArr;
        })
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
      else
        count = parseInt(id[4] + id[5])
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

            if (vidLoadArr[count]) {
              console.log("inside" + parseInt(count))
              // removeVideo(videoCount)
              document.getElementById('hls-' + parseInt(count)).controls = false
              const url = apiUrl + "LiveStreams/" + device.device_name + "/2"+"/index2.m3u8"
              hlsArr[count].hls.detachMedia()
              hlsArr[count].hls.destroy()
              hlsArr[count].hls = new Hls(config)
              hlsArr[count].hls.loadSource(url)
              hlsArr[count].hls.attachMedia(document.getElementById('hls-' + parseInt(count)))
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

              count = (count + 1) % 36
              // if (count >= (grid + 1) * (grid + 1)) setGrid(grid => grid + 1)

              console.log(hlsArr)

              continue;
            }
            setVidLoadArr(vidLoadArr => {
              const tempArr = vidLoadArr;
              tempArr[count] = true;
              return tempArr
            })
            // vidLoadArr[videoCount]=true;
            const hls = new Hls(config)
            console.log("count is=" + count)
            const video = document.getElementById('hls-' + parseInt(count));
            const center = document.getElementById('cen-' + parseInt(count))
            center.innerText = device.device_name
            console.log("text = " + document.getElementById('cen-' + parseInt(count)).innerText)

            console.log("video id = " + 'hls-' + parseInt(count))
            const url = apiUrl + "LiveStreams/" + device.device_name + "/2"+"/index2.m3u8"
            await createHLS(hls, url, video)
            setHlsArr((hlsArr) => {
              console.log("inide hls - " + count)
              const tempArr = hlsArr;
              tempArr[count] = {
                'hls': hls,
                'url': url,
                'video': video,
              }
              return tempArr;
            })
            // setVideoCount((videoCount + 1) % ((grid + 1) * (grid + 1)))

            // if (grid == 5) {
            //   count = ((count + 1) % ((grid + 1) * (grid + 1)))
            // }
            // else if (count == (grid + 1) * (grid + 1)) setGrid(grid => grid + 1)
            // count = count + 1
            maxElement = Math.max(maxElement, count)
            count = (count + 1) % 36
            // if (count >= (grid + 1) * (grid + 1)) setGrid(grid => grid + 1)

            console.log(hlsArr)
            // count = ((count + 1) % ((grid + 1) * (grid + 1)))
          }
        }
      }
      setRotateList(rotateList => {
        let anr = [...rotateList]
        for (let item of temprotateList)
          anr.push(item)
        return anr
      })
      if (maxElement > 24) setGrid(Math.max(grid, 5))
      else if (maxElement > 15) setGrid(Math.max(grid, 4))
      else if (maxElement > 8) setGrid(Math.max(grid, 3))
      else if (maxElement > 3) setGrid(Math.max(grid, 2))
      else if (maxElement > 0) setGrid(Math.max(grid, 1))
      // if ((grid + 1) * (grid + 1) <= count) setGrid(grid => grid + 1)

      setVideoCount(count)

    }

  }

  async function rotateCameras() {
    let index = videoCount
    // console.log("x-fired" + index)
    // const setToUse = new Set()
    // for (let i = 0; i < 36; i++) {
    //   if (sessionStorage.getItem('hls-' + i)) {
    //     setToUse.add(sessionStorage.getItem('hls-' + i))
    //   }
    // }
    let rotating = [...rotateList]
    if (rotateList.length == 0)
      rotating = [...cameraList]
    let count = 0
    let stop = i       // If i loops back to value of stop then break the loop
    const length = rotating.length
    while (count <= ((grid + 1) * (grid + 1))) {                                      //This will turn into an infinite loop if..
      if (document.fullscreenElement === document.getElementById('hls-' + parseInt(index))) {
        index = (index + 1) % ((grid + 1) * (grid + 1));
        count++;
        continue;
      }
      count++;
      sessionStorage.setItem('hls-' + parseInt(index), rotating[i])
      console.log("x-entered " + rotating[i])
      // cameraSet.add(event.target.innerText)
      document.getElementById('hls-' + parseInt(index)).controls = false
      if (vidLoadArr[index]) {
        // removeVideo(videoCount)
        const url = apiUrl + "LiveStreams/" + rotating[i] + "/2"+"/index2.m3u8"
        hlsArr[index].hls.detachMedia()
        hlsArr[index].hls.destroy()
        hlsArr[index].hls = new Hls(config)
        hlsArr[index].hls.loadSource(url)
        hlsArr[index].hls.attachMedia(document.getElementById('hls-' + parseInt(index)))
        // cameraSet.delete(document.getElementById('cen-' + parseInt(videoCount)).innerText)
        document.getElementById('cen-' + parseInt(index)).innerText = rotating[i]
        i = (i + 1) % length
        if (i == stop) return
        // index = (index + 1) % ((grid+1)*(grid+1))
        index = (index + 1) % ((grid + 1) * (grid + 1))
      }
      else {

        setVidLoadArr(vidLoadArr => {
          const tempArr = vidLoadArr;
          tempArr[index] = true;
          return tempArr
        })
        sessionStorage.setItem('hls-' + parseInt(index), rotating[i])

        // vidLoadArr[videoCount]=true;
        const hls = new Hls(config)
        const video = document.getElementById('hls-' + parseInt(index));
        const center = document.getElementById('cen-' + parseInt(index))
        center.innerText = rotating[i]
        // console.log("text = " + document.getElementById('cen-' + parseInt(videoCount)).innerText)

        // console.log("video id = " + 'hls-' + parseInt(index))
        const url = apiUrl + "LiveStreams/" + rotating[i] + "/2"+"/index2.m3u8"
        await createHLS(hls, url, video)
        setHlsArr((hlsArr) => {
          let tempArr = hlsArr;
          tempArr[index] = {
            'hls': hls,
            'url': url,
            'video': video,
          }
          return tempArr;
        })
        i = (i + 1) % length
        if (i == stop) return
        // index = (index + 1) % ((grid+1)*(grid+1))
        index = (index + 1) % ((grid + 1) * (grid + 1))


      }
    }
    // setToUse.clear()

    // setCameraSet(()=>new Set)
    setVideoCount(index)

    // setCameraSet((prev)=>new Set(prev).add(item))
  }

  function removeAll() {
    setRotateList([])
    for (let i = 0; i <= 35; i++) {
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
      if (vidLoadArr[count]) {
        console.log("entered-" + count)
        // removeVideo(videoCount)
        const url = apiUrl + "LiveStreams/" + device.device_name + "/2"+"/index2.m3u8"
        console.log("livestream is " + url)
        hlsArr[count].hls.detachMedia()
        hlsArr[count].hls.destroy()
        hlsArr[count].hls = new Hls(config)
        hlsArr[count].hls.loadSource(url)
        hlsArr[count].hls.attachMedia(document.getElementById('hls-' + parseInt(count)))
        // cameraSet.delete(document.getElementById('cen-' + parseInt(videoCount)).innerText)


        document.getElementById('cen-' + parseInt(count)).innerText = device.device_name
        // setVideoCount((videoCount + 1) % ((grid + 1) * (grid + 1)))
        count = (count + 1) % 36

      }
      else {

        setVidLoadArr(vidLoadArr => {
          const tempArr = vidLoadArr;
          tempArr[count] = true;
          return tempArr
        })
        // vidLoadArr[videoCount]=true;
        const hls = new Hls(config)
        const video = document.getElementById('hls-' + parseInt(count));
        const center = document.getElementById('cen-' + parseInt(count))
        center.innerText = device.device_name
        // console.log("text = " + document.getElementById('cen-' + parseInt(count)).innerText)

        // console.log("video id = " + 'hls-' + parseInt(count))
        const url = apiUrl + "LiveStreams/" + device.device_name +"/2"+"/index2.m3u8"
        await createHLS(hls, url, video)
        setHlsArr((hlsArr) => {
          console.log("inside hls -" + count)
          const tempArr = hlsArr;
          tempArr[parseInt(count)] = {
            'hls': hls,
            'url': url,
            'video': video,
          }
          return tempArr;
        })
        console.log("else-" + count)
        // setVideoCount((videoCount + 1) % ((grid + 1) * (grid + 1)))

        maxElement = Math.max(maxElement, count)
        count = (count + 1) % 36

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
    setRotateList(rotateList => {
      let anr = [...rotateList]
      for (let item of temprotateList)
        anr.push(item)
      return anr
    })
    if (maxElement > 24) setGrid(Math.max(grid, 5))
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

    //convert to desired file format
    let dataURI = canvas.toDataURL('image/jpeg');
    setDataUrl(dataURI)
    handleSnapModal()

  }



  let mouse = ""

  function ptzUp() {
    mouse = "click"
    // console.log(subtract - Date.now())
    // console.log("surrentcam: "+currentCam)
    if (ptzCamerasList[currentCam])
      axios.get(api_node + 'up/' + ptzCamerasList[currentCam][0].split(':')[0] + '/' + ptzCamerasList[currentCam][1] + '/' + ptzCamerasList[currentCam][2])
        .then(res => { console.log(res) }).catch(e => console.log(e))
  }
  function ptzUpLeft() {
    mouse = "click"
    if (ptzCamerasList[currentCam])
      axios.get(api_node + 'ul/' + ptzCamerasList[currentCam][0].split(':')[0] + '/' + ptzCamerasList[currentCam][1] + '/' + ptzCamerasList[currentCam][2])
        .then(res => { console.log(res) }).catch(e => console.log(e))
  }
  function ptzUpRight() {
    mouse = "click"
    if (ptzCamerasList[currentCam])
      axios.get(api_node + 'ur/' + ptzCamerasList[currentCam][0].split(':')[0] + '/' + ptzCamerasList[currentCam][1] + '/' + ptzCamerasList[currentCam][2])
        .then(res => { console.log(res) }).catch(e => console.log(e))
  }
  function ptzLeft() {
    mouse = "click"
    if (ptzCamerasList[currentCam])
      axios.get(api_node + 'lt/' + ptzCamerasList[currentCam][0].split(':')[0] + '/' + ptzCamerasList[currentCam][1] + '/' + ptzCamerasList[currentCam][2])
        .then(res => { console.log(res) }).catch(e => console.log(e))
  }
  function ptzRight() {
    mouse = "click"
    if (ptzCamerasList[currentCam])
      axios.get(api_node + 'rt/' + ptzCamerasList[currentCam][0].split(':')[0] + '/' + ptzCamerasList[currentCam][1] + '/' + ptzCamerasList[currentCam][2])
        .then(res => { console.log(res) }).catch(e => console.log(e))
  }
  function ptzDownLeft() {
    mouse = "click"
    if (ptzCamerasList[currentCam])
      axios.get(api_node + 'dl/' + ptzCamerasList[currentCam][0].split(':')[0] + '/' + ptzCamerasList[currentCam][1] + '/' + ptzCamerasList[currentCam][2])
        .then(res => { console.log(res) }).catch(e => console.log(e))
  }
  function ptzDownRight() {
    mouse = "click"
    if (ptzCamerasList[currentCam])
      axios.get(api_node + 'dr/' + ptzCamerasList[currentCam][0].split(':')[0] + '/' + ptzCamerasList[currentCam][1] + '/' + ptzCamerasList[currentCam][2])
        .then(res => { console.log(res) }).catch(e => console.log(e))
  }
  function ptzDown() {
    mouse = "click"
    if (ptzCamerasList[currentCam])
      axios.get(api_node + 'dn/' + ptzCamerasList[currentCam][0].split(':')[0] + '/' + ptzCamerasList[currentCam][1] + '/' + ptzCamerasList[currentCam][2])
        .then(res => { console.log(res) }).catch(e => console.log(e))
  }
  function ptzZoomIn() {
    mouse = "click"
    if (ptzCamerasList[currentCam])
      axios.get(api_node + 'zi/' + ptzCamerasList[currentCam][0].split(':')[0] + '/' + ptzCamerasList[currentCam][1] + '/' + ptzCamerasList[currentCam][2])
        .then(res => { console.log(res) }).catch(e => console.log(e))
  }
  function ptzZoomOut() {
    mouse = "click"
    if (ptzCamerasList[currentCam])
      axios.get(api_node + 'zo/' + ptzCamerasList[currentCam][0].split(':')[0] + '/' + ptzCamerasList[currentCam][1] + '/' + ptzCamerasList[currentCam][2])
        .then(res => { console.log(res) }).catch(e => console.log(e))
  }



  function continuePtzUpLeft() {
    setTimeout(() => {
      console.log("waiting")
    }, 110);
    if (ptzCamerasList[currentCam])
      axios.get(api_node + 'contUl/' + ptzCamerasList[currentCam][0].split(':')[0] + '/' + ptzCamerasList[currentCam][1] + '/' + ptzCamerasList[currentCam][2])
        .then(res => { console.log(res) }).catch(e => console.log(e))
  }
  function continuePtzUp() {
    // console.log(Date.now())
    // subtract = Date.now()

    if (ptzCamerasList[currentCam])
      axios.get(api_node + 'contUp/' + ptzCamerasList[currentCam][0].split(':')[0] + '/' + ptzCamerasList[currentCam][1] + '/' + ptzCamerasList[currentCam][2])
        .then(res => { console.log(res) }).catch(e => console.log(e))
  }
  function continuePtzUpRight() {
    if (ptzCamerasList[currentCam])
      axios.get(api_node + 'contUr/' + ptzCamerasList[currentCam][0].split(':')[0] + '/' + ptzCamerasList[currentCam][1] + '/' + ptzCamerasList[currentCam][2])
        .then(res => { console.log(res) }).catch(e => console.log(e))
  }
  function continuePtzLeft() {
    if (ptzCamerasList[currentCam])
      axios.get(api_node + 'contLt/' + ptzCamerasList[currentCam][0].split(':')[0] + '/' + ptzCamerasList[currentCam][1] + '/' + ptzCamerasList[currentCam][2])
        .then(res => { console.log(res) }).catch(e => console.log(e))
  }
  function continuePtzRight() {
    if (ptzCamerasList[currentCam])
      axios.get(api_node + 'contRt/' + ptzCamerasList[currentCam][0].split(':')[0] + '/' + ptzCamerasList[currentCam][1] + '/' + ptzCamerasList[currentCam][2])
        .then(res => { console.log(res) }).catch(e => console.log(e))
  }
  function continuePtzDownLeft() {
    if (ptzCamerasList[currentCam])
      axios.get(api_node + 'contDl/' + ptzCamerasList[currentCam][0].split(':')[0] + '/' + ptzCamerasList[currentCam][1] + '/' + ptzCamerasList[currentCam][2])
        .then(res => { console.log(res) }).catch(e => console.log(e))
  }
  function continuePtzDownRight() {
    if (ptzCamerasList[currentCam])
      axios.get(api_node + 'contDr/' + ptzCamerasList[currentCam][0].split(':')[0] + '/' + ptzCamerasList[currentCam][1] + '/' + ptzCamerasList[currentCam][2])
        .then(res => { console.log(res) }).catch(e => console.log(e))
  }
  function continuePtzDown() {
    if (ptzCamerasList[currentCam])
      axios.get(api_node + 'contDn/' + ptzCamerasList[currentCam][0].split(':')[0] + '/' + ptzCamerasList[currentCam][1] + '/' + ptzCamerasList[currentCam][2])
        .then(res => { console.log(res) }).catch(e => console.log(e))
  }
  function continuePtzZoomIn() {
    if (ptzCamerasList[currentCam])
      axios.get(api_node + 'contZi/' + ptzCamerasList[currentCam][0].split(':')[0] + '/' + ptzCamerasList[currentCam][1] + '/' + ptzCamerasList[currentCam][2])
        .then(res => { console.log(res) }).catch(e => console.log(e))
  }
  function continuePtzZoomOut() {
    if (ptzCamerasList[currentCam])
      axios.get(api_node + 'contZo/' + ptzCamerasList[currentCam][0].split(':')[0] + '/' + ptzCamerasList[currentCam][1] + '/' + ptzCamerasList[currentCam][2])
        .then(res => { console.log(res) }).catch(e => console.log(e))
  }
  function increaseFocus() {
    if (ptzCamerasList[currentCam])
      axios.get(api_node + 'If/' + ptzCamerasList[currentCam][0].split(':')[0] + '/' + ptzCamerasList[currentCam][1] + '/' + ptzCamerasList[currentCam][2])
        .then(res => { console.log(res) }).catch(e => console.log(e))
  }
  function decreaseFocus() {
    if (ptzCamerasList[currentCam])
      axios.get(api_node + 'Df/' + ptzCamerasList[currentCam][0].split(':')[0] + '/' + ptzCamerasList[currentCam][1] + '/' + ptzCamerasList[currentCam][2])
        .then(res => { console.log(res) }).catch(e => console.log(e))
  }
  function increaseIris() {
    if (ptzCamerasList[currentCam])
      axios.get(api_node + 'Ii/' + ptzCamerasList[currentCam][0].split(':')[0] + '/' + ptzCamerasList[currentCam][1] + '/' + ptzCamerasList[currentCam][2])
        .then(res => { console.log(res) }).catch(e => console.log(e))
  }
  function decreaseIris() {
    if (ptzCamerasList[currentCam])
      axios.get(api_node + 'Di/' + ptzCamerasList[currentCam][0].split(':')[0] + '/' + ptzCamerasList[currentCam][1] + '/' + ptzCamerasList[currentCam][2])
        .then(res => { console.log(res) }).catch(e => console.log(e))
  }
  function setHomePosition() {
    if (ptzCamerasList[currentCam])
      axios.get(api_node + 'Sh/' + ptzCamerasList[currentCam][0].split(':')[0] + '/' + ptzCamerasList[currentCam][1] + '/' + ptzCamerasList[currentCam][2])
        .then(res => { console.log(res) }).catch(e => console.log(e))
  }
  function gotoHomePosition() {
    if (ptzCamerasList[currentCam])
      axios.get(api_node + 'Gh/' + ptzCamerasList[currentCam][0].split(':')[0] + '/' + ptzCamerasList[currentCam][1] + '/' + ptzCamerasList[currentCam][2])
        .then(res => { console.log(res) }).catch(e => console.log(e))
  }
  function ptzStop() {
    if (ptzCamerasList[currentCam])
      axios.get(api_node + 'stop/' + ptzCamerasList[currentCam][0].split(':')[0] + '/' + ptzCamerasList[currentCam][1] + '/' + ptzCamerasList[currentCam][2])
        .then(res => { console.log(res) }).catch(e => console.log(e))
  }


const [previousGrid, setPreviousGrid] = useState([])



  function fullscreen(e){
    e.preventDefault()
    const element = document.getElementById(e.target.parentNode.id)
    const id = element.id.length == 9? parseInt(element.id[8]) : (element.id[8]) +(element.id[9])
    console.log("grid id is"+ id)
    const gridValue = grid
    if(element.classList.contains('fb-100')){
      // setGrid(previousGrid)
      element.classList.toggle('fb-100')
      
      for( let i=0; i<((gridValue+1) * (gridValue+1) ); i++){
        document.getElementById('vid-div-'+parseInt(i)).classList.toggle('hidden')
      }
      element.classList.toggle('hidden')
      if (vidLoadArr[id]) {
        // removeVideo(videoCount)
        // document.getElementById('cen-'+parseInt(id))
        // document.getElementById('hls-' + parseInt(videoCount)).controls = false
        var url = apiUrl + "LiveStreams/" + document.getElementById('cen-'+parseInt(id)).innerText + "/2"+"/index2.m3u8"
        hlsArr[id].hls.detachMedia()
        hlsArr[id].hls.destroy()
        hlsArr[id].hls = new Hls(config)
        hlsArr[id].hls.loadSource(url)
        hlsArr[id].hls.attachMedia(document.getElementById('hls-' + parseInt(id)))
        // cameraSet.delete(document.getElementById('cen-' + parseInt(videoCount)).innerText)
        return
      }
    }
    else{
      
      setPreviousGrid(grid)
      element.classList.toggle('fb-100')
      
      for( let i=0; i<((gridValue+1) * (gridValue+1) ); i++){
        document.getElementById('vid-div-'+parseInt(i)).classList.toggle('hidden')
      }
      element.classList.toggle('hidden')
      if (vidLoadArr[id]) {
        // removeVideo(videoCount)
        // document.getElementById('cen-'+parseInt(id))
        // document.getElementById('hls-' + parseInt(videoCount)).controls = false
        var url = apiUrl + "LiveStreams/" + document.getElementById('cen-'+parseInt(id)).innerText + "/1"+"/index1.m3u8"
        hlsArr[id].hls.detachMedia()
        hlsArr[id].hls.destroy()
        hlsArr[id].hls = new Hls(config)
        hlsArr[id].hls.loadSource(url)
        hlsArr[id].hls.attachMedia(document.getElementById('hls-' + parseInt(id)))
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
              {/* <li>

                <button id="7-grid" onClick={() => setGrid(6)} className="mt-1 mb-1 ml-1 text-white focus:ring-4 font-medium rounded-md text-md px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800" >
                  7x7
                </button>
              </li>
              <li>

                <button id="8-grid" onClick={() => setGrid(7)} className="mt-1 mb-1 ml-1 text-white focus:ring-4 font-medium rounded-md text-md px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800" >
                  8x8
                </button>
              </li>
              <li>

                <button id="9-grid" onClick={() => setGrid(8)} className="mt-1 mb-1 ml-1 text-white focus:ring-4 font-medium rounded-md text-md px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800" >
                  9x9
                </button>
              </li>
              <li>

                <button id="10-grid" onClick={() => setGrid(9)} className="mt-1 mb-1 ml-1 text-white focus:ring-4 font-medium rounded-md text-xs px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800" >
                  10x10
                </button>
              </li> */}
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
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between h-min w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(0)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button>
                <div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-0"></div><button onClick={() => removeVideo(0)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button>
              </div>
              <video onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-0' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-1" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(1)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-1"></div><button onClick={() => removeVideo(1)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>
              <video onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-1' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-2" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(2)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-2"></div><button onClick={() => removeVideo(2)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-2' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-3" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(3)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-3"></div><button onClick={() => removeVideo(3)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-3' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-4" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(4)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-4"></div><button onClick={() => removeVideo(4)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-4' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-5" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(5)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-5"></div><button onClick={() => removeVideo(5)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-5' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-6" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(6)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-6"></div><button onClick={() => removeVideo(6)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-6' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>

             <div id="vid-div-7" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(7)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-7"></div><button onClick={() => removeVideo(7)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-7' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-8" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(8)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-8"></div><button onClick={() => removeVideo(8)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-8' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-9" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(9)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-9"></div><button onClick={() => removeVideo(9)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-9' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>



             <div id="vid-div-10" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(10)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-10"></div><button onClick={() => removeVideo(10)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button>
              </div>
              <video onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-10' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-11" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(11)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-11"></div><button onClick={() => removeVideo(11)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>
              <video onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-11' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-12" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(12)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-12"></div><button onClick={() => removeVideo(12)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-12' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-13" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(13)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-13"></div><button onClick={() => removeVideo(13)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-13' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-14" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(14)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-14"></div><button onClick={() => removeVideo(14)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-14' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-15" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(15)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-15"></div><button onClick={() => removeVideo(15)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-15' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-16" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(16)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-16"></div><button onClick={() => removeVideo(16)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-16' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>

             <div id="vid-div-17" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(17)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-17"></div><button onClick={() => removeVideo(17)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-17' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-18" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(18)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-18"></div><button onClick={() => removeVideo(18)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-18' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-19" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(19)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-19"></div><button onClick={() => removeVideo(19)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-19' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>



             <div id="vid-div-20" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(20)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-20"></div><button onClick={() => removeVideo(20)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button>
              </div>
              <video onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-20' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-21" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(21)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-21"></div><button onClick={() => removeVideo(21)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>
              <video onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-21' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-22" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(22)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-22"></div><button onClick={() => removeVideo(22)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-22' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-23" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(23)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-23"></div><button onClick={() => removeVideo(23)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-23' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-24" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(24)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-24"></div><button onClick={() => removeVideo(24)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-24' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-25" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " hidden fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(25)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-25"></div><button onClick={() => removeVideo(25)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-25' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-26" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " hidden fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(26)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-26"></div><button onClick={() => removeVideo(26)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-26' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>

             <div id="vid-div-27" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " hidden fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(27)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-27"></div><button onClick={() => removeVideo(27)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-27' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-28" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " hidden fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(28)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-28"></div><button onClick={() => removeVideo(28)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-28' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-29" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " hidden fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(29)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-29"></div><button onClick={() => removeVideo(29)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-29' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>




             <div id="vid-div-30" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " hidden fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(30)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-30"></div><button onClick={() => removeVideo(30)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button>
              </div>
              <video onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-30' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-31" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " hidden fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(31)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-31"></div><button onClick={() => removeVideo(31)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>
              <video onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-31' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-32" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " hidden fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(32)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-32"></div><button onClick={() => removeVideo(32)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-32' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-33" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " hidden fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(33)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-33"></div><button onClick={() => removeVideo(33)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-33' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-34" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " hidden fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(34)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-34"></div><button onClick={() => removeVideo(34)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-34' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-35" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " hidden fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(35)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-35"></div><button onClick={() => removeVideo(35)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-35' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <RotateModal showRotate={showRotate} setRotate={setRotate} onClose={handleRotateClose} />
            <SnapModal dataUrl={dataUrl} showSnap={showSnap} onClose={handleSnapClose} />
            <MotionDetectionModal motionVideo={motionVideoRef} video={videoURL} showMotion={showMotion} onClose={handleMotionClose} />
            {/* <AddGroupModal cameraList={cameraList} show={showModal} onClose={handleOnClose} /> */}
            {/*  <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-36"></div><button onClick={() => removeVideo(36)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-36' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>

             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-37"></div><button onClick={() => removeVideo(37)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-37' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-38"></div><button onClick={() => removeVideo(38)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-38' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-39"></div><button onClick={() => removeVideo(39)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-39' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>





             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-40"></div><button onClick={() => removeVideo(40)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button>
              </div>
              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-40' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-41"></div><button onClick={() => removeVideo(41)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>
              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-41' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-42"></div><button onClick={() => removeVideo(42)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-42' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-43"></div><button onClick={() => removeVideo(43)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-43' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-44"></div><button onClick={() => removeVideo(44)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-44' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-45"></div><button onClick={() => removeVideo(45)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-45' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-46"></div><button onClick={() => removeVideo(46)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-46' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>

             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-47"></div><button onClick={() => removeVideo(47)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-47' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-48"></div><button onClick={() => removeVideo(48)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-48' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-49"></div><button onClick={() => removeVideo(49)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-49' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>




             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-50"></div><button onClick={() => removeVideo(50)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button>
              </div>
              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-50' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-51"></div><button onClick={() => removeVideo(51)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>
              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-51' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-52"></div><button onClick={() => removeVideo(52)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-52' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-53"></div><button onClick={() => removeVideo(53)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-53' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-54"></div><button onClick={() => removeVideo(54)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-54' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-55"></div><button onClick={() => removeVideo(55)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-55' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-56"></div><button onClick={() => removeVideo(56)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-56' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>

             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-57"></div><button onClick={() => removeVideo(57)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-57' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-58"></div><button onClick={() => removeVideo(58)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-58' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-59"></div><button onClick={() => removeVideo(59)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-59' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>


             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-60"></div><button onClick={() => removeVideo(60)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button>
              </div>
              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-60' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-61"></div><button onClick={() => removeVideo(61)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>
              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-61' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-62"></div><button onClick={() => removeVideo(62)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-62' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-63"></div><button onClick={() => removeVideo(63)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-63' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-64"></div><button onClick={() => removeVideo(64)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-64' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-65"></div><button onClick={() => removeVideo(65)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-65' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-66"></div><button onClick={() => removeVideo(66)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-66' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>

             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-67"></div><button onClick={() => removeVideo(67)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-67' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-68"></div><button onClick={() => removeVideo(68)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-68' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-69"></div><button onClick={() => removeVideo(69)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-69' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>




             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-70"></div><button onClick={() => removeVideo(70)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button>
              </div>
              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-70' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-71"></div><button onClick={() => removeVideo(71)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>
              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-71' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-72"></div><button onClick={() => removeVideo(72)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-72' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-73"></div><button onClick={() => removeVideo(73)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-73' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-74"></div><button onClick={() => removeVideo(74)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-74' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-75"></div><button onClick={() => removeVideo(75)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-75' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-76"></div><button onClick={() => removeVideo(76)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-76' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>

             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-77"></div><button onClick={() => removeVideo(77)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-77' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-78"></div><button onClick={() => removeVideo(78)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-78' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-79"></div><button onClick={() => removeVideo(79)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-79' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>





             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-80"></div><button onClick={() => removeVideo(80)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button>
              </div>
              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-80' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-81"></div><button onClick={() => removeVideo(81)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>
              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-81' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-82"></div><button onClick={() => removeVideo(82)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-82' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-83"></div><button onClick={() => removeVideo(83)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-83' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-84"></div><button onClick={() => removeVideo(84)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-84' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-85"></div><button onClick={() => removeVideo(85)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-85' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-86"></div><button onClick={() => removeVideo(86)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-86' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>

             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-87"></div><button onClick={() => removeVideo(87)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-87' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-88"></div><button onClick={() => removeVideo(88)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-88' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-89"></div><button onClick={() => removeVideo(89)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-89' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>




             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-90"></div><button onClick={() => removeVideo(90)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button>
              </div>
              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-90' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-91"></div><button onClick={() => removeVideo(91)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>
              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-91' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-92"></div><button onClick={() => removeVideo(92)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-92' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-93"></div><button onClick={() => removeVideo(93)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-93' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-94"></div><button onClick={() => removeVideo(94)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-94' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-95"></div><button onClick={() => removeVideo(95)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-95' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-96"></div><button onClick={() => removeVideo(96)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-96' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>

             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-97"></div><button onClick={() => removeVideo(97)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-97' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-98"></div><button onClick={() => removeVideo(98)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-98' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div id="vid-div-0" onDoubleClick={(e)=>{fullscreen(e)}} className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-99"></div><button onClick={() => removeVideo(99)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-99' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div> */}

          </div>
        </div>
      </div>
    </>
  );
}
