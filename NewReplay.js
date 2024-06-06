import React, { useEffect } from "react";
import Navbar from "../Components/Navbar"
import { useState } from "react";
import { useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaFastForward, FaFastBackward, FaPlay, FaPause } from "react-icons/fa";
import { FaArrowDown, FaCamera, FaChevronDown, FaVideo } from 'react-icons/fa';
import { faArrowLeft, faCamera, faRectangleXmark, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FaAlignCenter, FaArrowLeft, FaArrowRight, FaArrowUp, FaDotCircle, FaMinus, FaPlus } from 'react-icons/fa';
import SnapModal from './SnapModal';
import MotionDetectionModal from './MotionDetectionModal';
import axios from "axios";



export default function NewReplay() {
  const api_node = localStorage.getItem('api_node')
  const apiUrl = localStorage.getItem('api')
  const [grid, setGrid] = useState(1)
  const [eventPopUp, setEventPopUp] = useState(true)
  const [isActive, setIsActive] = useState(false);
  const [currentCam, setCurrentCam] = useState("")
  const [dataUrl, setDataUrl] = useState("")
  const [cameraList, setCameraList] = useState([])
  const [groups, setGroups] = useState([])
  const [datetime, setDatetime] = useState(new Date())
  const [videoList, setVideoList] = useState([])
  const [videoCount, setVideoCount] = useState(0);
  const [vidListsarr, setVidsListarr] = useState([[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []])
  const [vidLoadArr, setVidLoadArr] = useState([false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,])
  const [duration, setDuration] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,])
  const [showSnap, setShowSnap] = useState(false)
  const [showMotion, setShowMotion] = useState(false)
  const [expand, setExpand] = useState(-1)
  const [cameraName, setCameraName] = useState("")


  var varDate = new Date()
  let currvid = 0;



  let motionVideoElement = document.createElement('video')
  const motionVideoRef = useRef(motionVideoElement)
  motionVideoElement.setAttribute('ref', motionVideoRef)
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







  async function getCamerasList() {
    // const data = await axios.get('http://127.0.0.1:8080/Recordings')
    try {
      const groupData = await axios.get(apiUrl + 'camera_group_list/').catch((res) => {
        console.log(res)
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








  let canvasx = document.createElement('canvas');
  canvasx.width = 1920;
  canvasx.height = 1080;
  let ctx = canvasx.getContext('2d');

  async function snapshot(e) {
    let id = e
    let video = document.getElementById('hls-' + id)
    ctx.drawImage(video, 0, 0, canvasx.width, canvasx.height);

    //convert to desired file format
    return (canvasx.toDataURL('image/jpeg'))
    // setDataUrl(dataURI)
    // handleSnapModal()
    // return dataURI

  }

  async function getVideoList(cameraName) {
    // let url = 'http://127.0.0.1:8080/Recordings/' + cameraName
    let url = api_node + 'Recordings/' + cameraName

    const data = axios.get(url).then((res) => {
      // if (videoCount == 0 && videoList.length == 0) setVidsarr(() => { return res.data })
      // else if (videoCount == 3 && videoList.length != 0) setVidsarr(() => { return res.data })
      // else if (videoCount == 0) setVidsarr(() => { return res.data })
      // else if (videoCount == 1) setVidsarr(() => { return res.data })
      // else if (videoCount == 2) setVidsarr(() => { return res.data })

      setVideoList(() => {
        return res.data;
      })
      // setFilteredList(() => {
      //     return res.data
      // })
      addVideo(cameraName, res.data.sort())
      setVidsListarr(vidsarr => {
        let temp = [...vidsarr]
        temp[videoCount] = res.data.sort();
        return temp;
      })
      console.log(res.data)
    }).catch(e => { console.log(e) })
    // filterbyDate(document.getElementById("by-date"))/
    // console.log(data.data)
  }

  function dragStartHandle() {

  }

  function playGroup() {

  }

  function dragStartHandleGroup() {

  }

  function dragStartHandleVideo(ev) {

  }

  function dragOverHandler(ev) {

  }

  function dropHandler(ev) {

  }
  function removeVideo(e) {

  }
  function removeAll() {

  }








  async function addVideo(camera, videos) {
    console.log('apiurl is ' + apiUrl)

    // setFlag(false)
    console.log("event.target.value = " + camera)
    currvid = videoCount
    const center = document.getElementById('cen-' + parseInt(videoCount))
    center.innerText = camera
    if (vidLoadArr[videoCount]) {
      const video = document.getElementById('hls-' + parseInt(videoCount))
      video.pause();
      video.removeAttribute('src')
      video.load();
      video.setAttribute('src', api_node + 'Recordings/' + camera + '/' + videos[0])
      video.load();
      video.addEventListener('canplay', () => {
        video.play();
      })
      setVideoCount((videoCount + 1) % ((grid + 1) * (grid + 1)))
      return;

    }
    // setSidebarVids(sidebarvids =>{
    //     let tempsidebarvids = sidebarvids
    //     tempsidebarvids[videoCount] = videos
    //     return tempsidebarvids
    // });
    console.log("camera name = " + camera)
    setVidLoadArr(vidLoadArr => {
      let tempArr = vidLoadArr;
      tempArr[videoCount] = true;
      return tempArr
    })
    const video = document.getElementById('hls-' + parseInt(videoCount))
    video.setAttribute('src', api_node + 'Recordings/' + camera + '/' + videos[0])
    video.load();
    video.addEventListener('canplay', () => {
      video.play();
    })
    setVideoCount((videoCount + 1) % ((grid + 1) * (grid + 1)))

  }








  function setIST(val) {
    try {
      for (let i = 0; i < ((grid + 1) * (grid + 1)); i++) {

        const videoplayer = document.getElementById('hls-' + parseInt(i))
        const time = document.getElementById('time-' + parseInt(0))
        const duration = document.getElementById('duration-' + parseInt(0))
        var percentage = (videoplayer.currentTime / videoplayer.duration) * 100;
        var customSeekbar = document.querySelector("#custom-seekbar-" + parseInt(0) + " span");
        customSeekbar.style.width = percentage + "%";
        document.getElementById('custom-seekbar-' + parseInt(0)).addEventListener('click', function (e) {
          var offset = e.currentTarget.getBoundingClientRect();
          var left = e.pageX - offset.left;
          var totalWidth = e.currentTarget.clientWidth;
          var percentage = (left / totalWidth);
          var vidTime = videoplayer.duration * percentage;
          if (isNaN(vidTime))
            return
          videoplayer.currentTime = vidTime;
        })
        const currvidTime = videoplayer.currentSrc.slice(-19);
        const vidDuration = videoplayer.duration;
        if (currvidTime.split('T')[1] != undefined) {
          varDate.setHours(parseInt(currvidTime.split('T')[1].slice(0, 2)))
          varDate.setMinutes(parseInt(currvidTime.split('T')[1].slice(2, 4)))
          varDate.setSeconds(parseInt(currvidTime.split('T')[1].slice(4, 6)))
          let forDuration = new Date(varDate)
          var timeinseconds = videoplayer.currentTime

          forDuration.setHours(forDuration.getHours() + ((vidDuration / 60) / 60))
          forDuration.setMinutes(forDuration.getMinutes() + (vidDuration / 60))
          forDuration.setSeconds(forDuration.getSeconds() + (vidDuration % 60))
          varDate.setHours(varDate.getHours() + ((timeinseconds / 60) / 60))
          varDate.setMinutes(varDate.getMinutes() + (timeinseconds / 60))
          varDate.setSeconds(varDate.getSeconds() + (timeinseconds % 60))
          time.innerText = varDate.toLocaleTimeString() + "/" + forDuration.toLocaleTimeString()
        }

      }
    }
    catch (e) { console.log(e) }
  }








  async function prevfunction(val) {
    console.log('prev')
    const videoplayer = document.getElementById('hls-' + parseInt(val))
    videoplayer.controls = false;

    const newVideoPlayer = document.createElement('video');
    newVideoPlayer.id = 'hls-' + parseInt(val);
    newVideoPlayer.className = 'vid';
    // newVideoPlayer.setAttribute('controls', '');
    newVideoPlayer.setAttribute('autoplay', '');
    const currentsource = videoplayer.currentSrc;
    const currentIndex = vidListsarr[val].indexOf(currentsource.split('/')[5]);
    console.log(currentIndex)
    const nextIndex = currentIndex - 1;

    if (nextIndex >= 0) {
      const nextVideo = vidListsarr[val][nextIndex];
      const nextSourceElement = document.createElement('source');
      const center = document.getElementById('cen-' + parseInt(val))
      // nextSourceElement.setAttribute('src', 'http://127.0.0.1:8080/Recordings/' + center.innerText + '/' + nextVideo);
      nextSourceElement.setAttribute('src', api_node + 'Recordings/' + center.innerText + '/' + nextVideo);

      nextSourceElement.setAttribute('type', 'video/mp4');

      newVideoPlayer.appendChild(nextSourceElement);
      newVideoPlayer.load();
      newVideoPlayer.addEventListener('canplaythrough', () => {
        try {
          videoplayer.parentNode.replaceChild(newVideoPlayer, videoplayer);
          videoplayer.remove();

          newVideoPlayer.play();
          // newVideoPlayer.ontimeupdate
          newVideoPlayer.addEventListener('timeupdate', () => {
            // setIST(i);
          })
        }
        catch (err) { console.log(err) }

      })
      newVideoPlayer.addEventListener('ended', () => {
        endfunction(val);
      })
    }
    if (val + 1 < ((grid + 1) * (grid + 1))) {
      prevfunction(val + 1)
    }
  }


















  //   async function endfunction(val) {
  //     console.log('ended')
  //     const videoplayer = document.getElementById('hls-' + parseInt(val))
  //     videoplayer.controls = false;
  //     // let posterUrl = await snapshot(val)
  //     // videoplayer.poster = posterUrl
  //     videoplayer.poster = process.env.PUBLIC_URL + 'vid-load.png'

  //     console.log("poseter is "+ videoplayer.poster)

  //     const currentsource = videoplayer.currentSrc;
  //     console.log("ans = " + vidListsarr[val])
  //     const currentIndex = vidListsarr[val].indexOf(currentsource.split('/')[5]);
  //     console.log(currentIndex)
  //     const nextIndex = currentIndex + 1;

  //     if (nextIndex < vidListsarr[val].length) {
  //       const nextVideo = vidListsarr[val][nextIndex];
  //       const center = document.getElementById('cen-' + parseInt(val))
  //       // nextSourceElement.setAttribute('src', 'http://127.0.0.1:8080/Recordings/' + center.innerText + '/' + nextVideo);
  //       console.log("inside")
  //       // videoplayer.pause();
  //             videoplayer.removeAttribute('src')
  //             // videoplayer.load();
  //             videoplayer.setAttribute('src', api_node + 'Recordings/' + center.innerText + '/' + nextVideo);
  //             videoplayer.load();
  //             videoplayer.addEventListener('canplay',()=>{
  //                 videoplayer.play();
  //             })
  //     }
  //   if(val+1<((grid+1)  *  (grid+1))){
  //     endfunction(val+1)
  //   }
  // }








  //TRY HIDDEN CLASS ATTRIBUTE WITH TWO VIDEO ELEMENTS
  async function endfunction(val) {
    console.log('ended')
    let videoplayer = document.getElementById('hls-' + parseInt(val))
    let videoplayerx = document.getElementById('hls-' + parseInt(val) + 'x')
    if (videoplayer.classList.contains('hidden')) {
      let temp = videoplayer
      videoplayer = videoplayerx
      videoplayerx = temp
    }
    videoplayerx.controls = false
    videoplayer.controls = false;
    // videoplayerx.poster = process.env.PUBLIC_URL + 'vid-load.png'
    const currentsource = videoplayer.currentSrc;
    // console.log("ans = " + vidListsarr[val])
    console.log("vidListarr is = " + vidListsarr[val])
    const currentIndex = vidListsarr[val].indexOf(currentsource.split('/')[5]);
    console.log(currentIndex)
    const nextIndex = currentIndex + 1;

    if (nextIndex < vidListsarr[val].length) {
      const nextVideo = vidListsarr[val][nextIndex];
      const center = document.getElementById('cen-' + parseInt(val))
      // nextSourceElement.setAttribute('src', 'http://127.0.0.1:8080/Recordings/' + center.innerText + '/' + nextVideo);
      console.log("inside")
      // videoplayer.pause();

      videoplayerx.removeAttribute('src')
      // videoplayer.load();
      videoplayerx.setAttribute('src', api_node + 'Recordings/' + center.innerText + '/' + nextVideo);
      console.log("next source is = " + api_node + 'Recordings/' + center.innerText + '/' + nextVideo)
      videoplayerx.load();

      videoplayerx.addEventListener('canplay', () => {
        let temp = videoplayer.id
        console.log("id to be of x is" + temp)
        // videoplayer.id = videoplayerx.id
        // videoplayerx.id = temp
        videoplayerx.classList.remove('hidden')
        videoplayer.classList.add('hidden')
        videoplayer.removeAttribute('src')
        videoplayerx.play();
      })
    }
    if (val + 1 < ((grid + 1) * (grid + 1))) {
      endfunction(val + 1)
    }
  }










  // async function endfunction(val) {
  //     console.log('ended')
  //     const videoplayer = document.getElementById('hls-' + parseInt(val))
  //     videoplayer.controls = false;

  //     const newVideoPlayer = document.createElement('video');
  //     newVideoPlayer.id = 'hls-' + parseInt(val);
  //     newVideoPlayer.className = 'vid-r';
  //     newVideoPlayer.poster = process.env.PUBLIC_URL + 'vid-load.png'
  //     // newVideoPlayer.setAttribute('controls', '');
  //     newVideoPlayer.setAttribute('autoplay', '');
  //     const currentsource = videoplayer.currentSrc;
  //     console.log("ans = " + vidListsarr[val])
  //     const currentIndex = vidListsarr[val].indexOf(currentsource.split('/')[5]);
  //     console.log(currentIndex)
  //     const nextIndex = currentIndex + 1;

  //     if (nextIndex < vidListsarr[val].length) {
  //       const nextVideo = vidListsarr[val][nextIndex];
  //       const nextSourceElement = document.createElement('source');
  //       const center = document.getElementById('cen-' + parseInt(val))
  //       // nextSourceElement.setAttribute('src', 'http://127.0.0.1:8080/Recordings/' + center.innerText + '/' + nextVideo);
  //       console.log("inside")
  //       nextSourceElement.setAttribute('src', api_node + 'Recordings/' + center.innerText + '/' + nextVideo);

  //       nextSourceElement.setAttribute('type', 'video/mp4');

  //       newVideoPlayer.appendChild(nextSourceElement);
  //       newVideoPlayer.load();
  //       newVideoPlayer.addEventListener('canplay', () => {
  //         try {
  //           videoplayer.parentNode.replaceChild(newVideoPlayer, videoplayer);
  //           videoplayer.remove();

  //           newVideoPlayer.play();
  //           // newVideoPlayer.ontimeupdate
  //           newVideoPlayer.addEventListener('timeupdate', () => {
  //             // setIST(i);
  //           })
  //         }
  //         catch (err) {  }

  //       })
  //       newVideoPlayer.addEventListener('ended', () => {
  //         endfunction(val);
  //       })
  //     }
  //   if(val+1<((grid+1)  *  (grid+1))){
  //     endfunction(val+1)
  //   }
  // }




  function convertDateToVideoName(date) {
    // return (date.toISOString().replaceAll(":", "").replaceAll("-", "").replace(".000Z", ""))
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    if (month.toString().length == 1) {
      month = "0" + month.toString()
    }
    let day = date.getDate()
    if (day.toString().length == 1) {
      day = "0" + day.toString()
    }
    let hours = date.getHours()
    if (hours.toString().length == 1) {
      hours = "0" + hours.toString()
    }
    let minutes = date.getMinutes()
    if (minutes.toString().length == 1) {
      minutes = "0" + minutes.toString()
    }
    // console.log(date)
    return year + month + day + "T" + hours + minutes
  }


  function updateDatetime(e) {
    const selectedDate = new Date(e.target.value)
    setDatetime(selectedDate)
    console.log("selected date is " + selectedDate)
  }


  function startPlaying() {
    let durationArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    let inputDateTime = datetime
    for (let j = 0; j < ((grid + 1) * (grid + 1)); j++) {

      for (let i = 0; i <= 30; i++) {
        let timeToCheck = inputDateTime.valueOf() - i * 60 * 1000
        let videoToCheck = convertDateToVideoName(new Date(timeToCheck));
        // console.log(videoToCheck)
        let ans = vidListsarr[j].filter(vid => {
          let videochecker = vid.slice(0, -6)
          return (videoToCheck.localeCompare(videochecker) == 0)
        })

        if (ans.length >= 1 && vidLoadArr[j]) {
          let val = j
          let videoName = ans
          console.log("ans is " + ans)
          let videochecker = ans[0].slice(0, -6)
          // console.log("videochecker is " + videochecker)
          let minutes = videochecker.slice(11, 13)
          let seconds = ans[0].slice(-6, -4)
          // console.log("seconds are " + seconds)
          // console.log("minutes to subtract " + inputDateTime.getMinutes())
          // console.log("minutes are " + minutes)
          let duration = inputDateTime.getMinutes() - minutes
          // console.log("duration is " + parseInt(seconds + duration * 60))
          duration = parseInt(parseInt(duration * 60) + seconds)                                 //should be duration*60 + seconds
          durationArr[j] = duration
          let videoplayer = document.getElementById('hls-' + parseInt(val))
          let videoplayerx = document.getElementById('hls-' + parseInt(val) + 'x')
          if (videoplayer.classList.contains('hidden')) {
            let temp = videoplayer
            videoplayer = videoplayerx
            videoplayerx = temp
          }
          videoplayerx.controls = false
          videoplayer.controls = false;
          const nextVideo = videoName;
          const center = document.getElementById('cen-' + parseInt(val))
          // nextSourceElement.setAttribute('src', 'http://127.0.0.1:8080/Recordings/' + center.innerText + '/' + nextVideo);
          console.log("inside")
          videoplayerx.pause();

          videoplayerx.removeAttribute('src')
          // videoplayer.load();
          videoplayerx.setAttribute('src', api_node + 'Recordings/' + center.innerText + '/' + nextVideo);
          console.log("next source is = " + api_node + 'Recordings/' + center.innerText + '/' + nextVideo)
          videoplayerx.load();

          videoplayerx.addEventListener('canplay', () => {
            let temp = videoplayer.id
            console.log("id to be of x is" + temp)
            // videoplayer.id = videoplayerx.id
            // videoplayerx.id = temp
            videoplayerx.classList.remove('hidden')
            videoplayer.classList.add('hidden')
            videoplayer.pause()
            videoplayer.removeAttribute('src')
            videoplayerx.play();
          })
          i = 31
        }


        // let videochecker = vidListsarr[i].substring(0,vidListsarr[i].length-6)
      }
    }
    durationArr.map((duration, index) => {
      let videoplayer = document.getElementById('hls-' + parseInt(index))
      let videoplayerx = document.getElementById('hls-' + parseInt(index) + 'x')
      if (videoplayer.classList.contains('hidden')) {
        let temp = videoplayer
        videoplayer = videoplayerx
        videoplayerx = temp
      }
      if(vidLoadArr[index]){
        console.log("adding " + duration)
        videoplayerx.currentTime = duration
      }

    })

  }


  // function startPlayingVideo(val, videoName, duration) {
  //   let videoplayer = document.getElementById('hls-' + parseInt(val))
  //   let videoplayerx = document.getElementById('hls-' + parseInt(val) + 'x')
  //   if (videoplayer.classList.contains('hidden')) {
  //     let temp = videoplayer
  //     videoplayer = videoplayerx
  //     videoplayerx = temp
  //   }
  //   videoplayerx.controls = false
  //   videoplayer.controls = false;
  //   const nextVideo = videoName;
  //   const center = document.getElementById('cen-' + parseInt(val))
  //   // nextSourceElement.setAttribute('src', 'http://127.0.0.1:8080/Recordings/' + center.innerText + '/' + nextVideo);
  //   console.log("inside")
  //   // videoplayer.pause();

  //   videoplayerx.removeAttribute('src')
  //   // videoplayer.load();
  //   videoplayerx.setAttribute('src', api_node + 'Recordings/' + center.innerText + '/' + nextVideo);
  //   console.log("next source is = " + api_node + 'Recordings/' + center.innerText + '/' + nextVideo)
  //   videoplayerx.load();

  //   videoplayerx.addEventListener('canplay', () => {
  //     let temp = videoplayer.id
  //     console.log("id to be of x is" + temp)
  //     // videoplayer.id = videoplayerx.id
  //     // videoplayerx.id = temp
  //     videoplayerx.classList.remove('hidden')
  //     videoplayer.classList.add('hidden')
  //     videoplayer.removeAttribute('src')
  //     videoplayerx.play();
  //     videoplayerx.currentTime = duration
  //   })
  // }




  function zoomIn(event) {
    // e.currentTarget.requestFullscreen()
    setGrid(0)
    setTimeout(() => {
      // e.target.scrollIntoView(true)
      event.target.scrollIntoView({ block: "end", inline: "nearest" })

    }, 500)
  }




  useEffect(() => {
    getCamerasList()
  }, [])




  return (
    <>
      <Navbar />
      <div className="fixed w-full text-left bg-gray-700">
        <button onClick={() => setIsActive(current => !current)} className="mt-1 mb-1 ml-2 text-white focus:ring-4 font-medium rounded-md text-sm px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800" type="button" data-drawer-target="drawer-navigation" data-drawer-show="drawer-navigation" aria-controls="drawer-navigation">
          Select Cameras <FontAwesomeIcon className='ml-1' icon={faCamera} />
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
        <button onClick={() => { removeAll() }} className="mt-1 mb-1 ml-2 text-white focus:ring-4 rounded-md text-sm px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800" type="button">
          Remove All <FontAwesomeIcon className='ml-1' icon={faTimes} />
        </button>
        {/* <button onClick={() => {
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
                </button> */}

        {/* <button onClick={() => pausefunction(0)} className="mt-1 mb-1 ml-2 text-white focus:ring-4 rounded-md text-sm px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800"><FaPause /></button> */}
        {/* <button onClick={() => playfunction(0)} className="mt-1 mb-1 ml-2 text-white focus:ring-4 rounded-md text-sm px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800"><FaPlay /></button> */}
        {/* <button onClick={() => setRotate(rotate => !rotate)} className={"mt-1 mb-1 ml-2 text-white focus:ring-4 font-medium rounded-md text-sm px-2.5 py-1.5 mr-2 hover:bg-blue-700 focus:outline-none focus:ring-blue-800 " + (rotate ? " bg-blue-700" : " bg-gray-600")} type="button">
          Rotate<FontAwesomeIcon className='ml-1' icon={faRetweet} />
        </button> */}
        <span className="mt-1 mb-1 ml-2 text-white focus:ring-4 rounded-md text-sm px-2.5 py-2 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800">
          Enter Date Time:
          <input onChange={(e) => { updateDatetime(e) }} type="datetime-local" id="by-date" className=" ml-2 text-white focus:ring-4 rounded-md text-sm bg-gray-500 focus:outline-none focus:ring-blue-800" name="date-search" />
        </span>
        <button onClick={() => { startPlaying() }} className="mt-2  ml-2 text-white focus:ring-4 rounded-md text-sm px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800">Play</button>

        <button onClick={() => prevfunction(0)} className="mt-1  ml-2 text-white focus:ring-4 rounded-md text-sm px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800"><FaFastBackward /></button>
        <button onClick={() => endfunction(0)} className="mt-1  ml-2 text-white focus:ring-4 rounded-md text-sm px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800"><FaFastForward /></button>


        <div id="custom-seekbar-0" className="mt-1 mb-1 ml-2 text-white focus:ring-4 rounded-md text-sm px-2.5 py-1.5 mr-2 bg-gray-600 focus:outline-none focus:ring-blue-800">
          <span>

          </span>
        </div>
        <div id="time-0" className="time">
          {/* {dateState.toLocaleString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                  hour12: true,
                })} */

          }
        </div>

      </div>

      <div id="drawer-navigation" className="fixed top-12 left-0 z-40 w-64 h-screen p-4 overflow-y-auto transition-transform -translate-x-full bg-gray-800" tabIndex="-1" aria-labelledby="drawer-navigation-label">
        {/* <h5 id="drawer-navigation-label" className="text-base font-semibold uppercase text-gray-400">Menu</h5> */}
        {/* <button onClick={handleAddGroup} id="drawer-group-add" className='text-base font-semibold uppercase text-gray-400'>Add Group +</button> */}
        <button onClick={() => setIsActive(current => !current)} type="button" data-drawer-hide="drawer-navigation" aria-controls="drawer-navigation" className="text-gray-400 bg-transparent rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center hover:bg-gray-600 hover:text-white" >
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
                                <span onClick={(e) => {
                                  setCameraName(e.target.innerText)
                                  getVideoList(e.target.innerText);
                                  // addVideo(e)
                                }} className="w-full ml-3">{device.device_name}</span>
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
                                <span onClick={(e) => {
                                  setCameraName(e.target.innerText)
                                  getVideoList(e.target.innerText);
                                  // addVideo(e)
                                }} className="w-full ml-3">{device.device_name}</span>
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

      <div id="vid-box" className={"mt-16 h-full" + (isActive ? " sm:ml-64" : " ")}>
        <div className="rounded-lg border-gray-700">

          <div className={"flexing"}>
            <div onDoubleClick={(e) => { zoomIn(e) }} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between h-min w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(0)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button>
                <div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-0"></div><button onClick={() => removeVideo(0)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button>
              </div>
              <video onTimeUpdate={() => setIST(0)} onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-0' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
              <video onTimeUpdate={() => setIST(0)} onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-0x' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid hidden'></video>
            </div>
            <div onDoubleClick={(e) => { zoomIn(e) }} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(1)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-1"></div><button onClick={() => removeVideo(1)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-1' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-1x' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid hidden'></video>

            </div>
            <div onDoubleClick={(e) => { zoomIn(e) }} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(2)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-2"></div><button onClick={() => removeVideo(2)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-2' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-2x' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid hidden'></video>

            </div>
            <div onDoubleClick={(e) => { zoomIn(e) }} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(3)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-3"></div><button onClick={() => removeVideo(3)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-3' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-3x' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid hidden'></video>

            </div>
            <div onDoubleClick={(e) => { zoomIn(e) }} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(4)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-4"></div><button onClick={() => removeVideo(4)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-4' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-4x' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid hidden'></video>

            </div>
            <div onDoubleClick={(e) => { zoomIn(e) }} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(5)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-5"></div><button onClick={() => removeVideo(5)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-5' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-5x' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid hidden'></video>

            </div>
            <div onDoubleClick={(e) => { zoomIn(e) }} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(6)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-6"></div><button onClick={() => removeVideo(6)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-6' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-6x' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid hidden'></video>

            </div>

            <div onDoubleClick={(e) => { zoomIn(e) }} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(7)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-7"></div><button onClick={() => removeVideo(7)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-7' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-7x' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid hidden'></video>

            </div>
            <div onDoubleClick={(e) => { zoomIn(e) }} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(8)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-8"></div><button onClick={() => removeVideo(8)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-8' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-8x' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid hidden'></video>

            </div>
            <div onDoubleClick={(e) => { zoomIn(e) }} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(9)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-9"></div><button onClick={() => removeVideo(9)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-9' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-9x' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid hidden'></video>

            </div>



            <div onDoubleClick={(e) => { zoomIn(e) }} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(10)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-10"></div><button onClick={() => removeVideo(10)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button>
              </div>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-10' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-10x' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid hidden'></video>

            </div>
            <div onDoubleClick={(e) => { zoomIn(e) }} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(11)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-11"></div><button onClick={() => removeVideo(11)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-11' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-11x' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid hidden'></video>

            </div>
            <div onDoubleClick={(e) => { zoomIn(e) }} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(12)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-12"></div><button onClick={() => removeVideo(12)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-12' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-12x' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid hidden'></video>

            </div>
            <div onDoubleClick={(e) => { zoomIn(e) }} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(13)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-13"></div><button onClick={() => removeVideo(13)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-13' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-13x' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid hidden'></video>

            </div>
            <div onDoubleClick={(e) => { zoomIn(e) }} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(14)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-14"></div><button onClick={() => removeVideo(14)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-14' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-14x' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid hidden'></video>

            </div>
            <div onDoubleClick={(e) => { zoomIn(e) }} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(15)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-15"></div><button onClick={() => removeVideo(15)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-15' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-15x' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid hidden'></video>

            </div>
            <div onDoubleClick={(e) => { zoomIn(e) }} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(16)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-16"></div><button onClick={() => removeVideo(16)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-16' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-16x' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid hidden'></video>

            </div>

            <div onDoubleClick={(e) => { zoomIn(e) }} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(17)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-17"></div><button onClick={() => removeVideo(17)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-17x' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid hidden'></video>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-17' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div onDoubleClick={(e) => { zoomIn(e) }} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(18)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-18"></div><button onClick={() => removeVideo(18)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-18x' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid hidden'></video>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-18' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div onDoubleClick={(e) => { zoomIn(e) }} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(19)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-19"></div><button onClick={() => removeVideo(19)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-19x' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid hidden'></video>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-19' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>



            <div onDoubleClick={(e) => { zoomIn(e) }} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(20)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-20"></div><button onClick={() => removeVideo(20)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button>
              </div>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-20x' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid hidden'></video>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-20' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div onDoubleClick={(e) => { zoomIn(e) }} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(21)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-21"></div><button onClick={() => removeVideo(21)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-21x' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid hidden'></video>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-21' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div onDoubleClick={(e) => { zoomIn(e) }} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(22)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-22"></div><button onClick={() => removeVideo(22)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-22x' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid hidden'></video>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-22' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div onDoubleClick={(e) => { zoomIn(e) }} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(23)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-23"></div><button onClick={() => removeVideo(23)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-23x' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid hidden'></video>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-23' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div onDoubleClick={(e) => { zoomIn(e) }} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(24)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-24"></div><button onClick={() => removeVideo(24)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-24x' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid hidden'></video>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-24' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div onDoubleClick={(e) => { zoomIn(e) }} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " hidden fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(25)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-25"></div><button onClick={() => removeVideo(25)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-25x' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid hidden'></video>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-25' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div onDoubleClick={(e) => { zoomIn(e) }} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " hidden fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(26)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-26"></div><button onClick={() => removeVideo(26)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-26x' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid hidden'></video>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-26' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>

            <div onDoubleClick={(e) => { zoomIn(e) }} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " hidden fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(27)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-27"></div><button onClick={() => removeVideo(27)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-27x' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid hidden'></video>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-27' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div onDoubleClick={(e) => { zoomIn(e) }} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " hidden fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(28)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-28"></div><button onClick={() => removeVideo(28)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-28x' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid hidden'></video>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-28' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div onDoubleClick={(e) => { zoomIn(e) }} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " hidden fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(29)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-29"></div><button onClick={() => removeVideo(29)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-29x' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid hidden'></video>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-29' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>




            <div onDoubleClick={(e) => { zoomIn(e) }} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " hidden fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(30)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-30"></div><button onClick={() => removeVideo(30)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button>
              </div>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-30x' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid hidden'></video>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-30' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div onDoubleClick={(e) => { zoomIn(e) }} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " hidden fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(31)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-31"></div><button onClick={() => removeVideo(31)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-31x' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid hidden'></video>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-31' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div onDoubleClick={(e) => { zoomIn(e) }} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " hidden fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(32)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-32"></div><button onClick={() => removeVideo(32)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-32x' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid hidden'></video>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-32' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div onDoubleClick={(e) => { zoomIn(e) }} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " hidden fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(33)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-33"></div><button onClick={() => removeVideo(33)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-33x' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid hidden'></video>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-33' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div onDoubleClick={(e) => { zoomIn(e) }} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " hidden fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(34)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-34"></div><button onClick={() => removeVideo(34)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-34x' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid hidden'></video>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-34' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div onDoubleClick={(e) => { zoomIn(e) }} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " hidden fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(35)}>
                <FontAwesomeIcon className='mr-2' icon={faCamera} />
              </button><div onClick={(e) => setCurrentCam(e.target.innerText)} className="ml-1 mt-1 text-xs" id="cen-35"></div><button onClick={() => removeVideo(35)}>
                  <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                </button></div>

              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-35x' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid hidden'></video>
              <video onEnded={() => endfunction(0)} onError={(e) => { e.preventDefault() }} draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-35' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <SnapModal dataUrl={dataUrl} showSnap={showSnap} onClose={handleSnapClose} />
            <MotionDetectionModal motionVideo={motionVideoRef} showMotion={showMotion} onClose={handleMotionClose} />
            {/* <AddGroupModal cameraList={cameraList} show={showModal} onClose={handleOnClose} /> */}
            {/*  <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-36"></div><button onClick={() => removeVideo(36)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-36' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>

             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-37"></div><button onClick={() => removeVideo(37)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-37' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-38"></div><button onClick={() => removeVideo(38)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-38' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-39"></div><button onClick={() => removeVideo(39)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-39' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>





             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-40"></div><button onClick={() => removeVideo(40)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button>
              </div>
              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-40' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-41"></div><button onClick={() => removeVideo(41)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>
              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-41' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-42"></div><button onClick={() => removeVideo(42)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-42' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-43"></div><button onClick={() => removeVideo(43)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-43' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-44"></div><button onClick={() => removeVideo(44)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-44' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-45"></div><button onClick={() => removeVideo(45)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-45' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-46"></div><button onClick={() => removeVideo(46)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-46' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>

             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-47"></div><button onClick={() => removeVideo(47)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-47' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-48"></div><button onClick={() => removeVideo(48)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-48' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-49"></div><button onClick={() => removeVideo(49)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-49' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>




             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-50"></div><button onClick={() => removeVideo(50)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button>
              </div>
              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-50' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-51"></div><button onClick={() => removeVideo(51)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>
              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-51' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-52"></div><button onClick={() => removeVideo(52)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-52' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-53"></div><button onClick={() => removeVideo(53)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-53' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-54"></div><button onClick={() => removeVideo(54)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-54' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-55"></div><button onClick={() => removeVideo(55)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-55' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-56"></div><button onClick={() => removeVideo(56)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-56' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>

             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-57"></div><button onClick={() => removeVideo(57)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-57' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-58"></div><button onClick={() => removeVideo(58)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-58' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-59"></div><button onClick={() => removeVideo(59)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-59' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>


             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-60"></div><button onClick={() => removeVideo(60)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button>
              </div>
              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-60' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-61"></div><button onClick={() => removeVideo(61)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>
              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-61' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-62"></div><button onClick={() => removeVideo(62)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-62' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-63"></div><button onClick={() => removeVideo(63)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-63' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-64"></div><button onClick={() => removeVideo(64)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-64' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-65"></div><button onClick={() => removeVideo(65)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-65' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-66"></div><button onClick={() => removeVideo(66)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-66' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>

             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-67"></div><button onClick={() => removeVideo(67)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-67' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-68"></div><button onClick={() => removeVideo(68)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-68' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-69"></div><button onClick={() => removeVideo(69)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-69' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>




             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-70"></div><button onClick={() => removeVideo(70)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button>
              </div>
              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-70' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-71"></div><button onClick={() => removeVideo(71)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>
              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-71' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-72"></div><button onClick={() => removeVideo(72)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-72' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-73"></div><button onClick={() => removeVideo(73)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-73' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-74"></div><button onClick={() => removeVideo(74)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-74' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-75"></div><button onClick={() => removeVideo(75)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-75' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-76"></div><button onClick={() => removeVideo(76)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-76' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>

             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-77"></div><button onClick={() => removeVideo(77)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-77' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-78"></div><button onClick={() => removeVideo(78)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-78' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-79"></div><button onClick={() => removeVideo(79)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-79' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>





             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-80"></div><button onClick={() => removeVideo(80)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button>
              </div>
              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-80' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-81"></div><button onClick={() => removeVideo(81)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>
              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-81' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-82"></div><button onClick={() => removeVideo(82)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-82' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-83"></div><button onClick={() => removeVideo(83)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-83' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-84"></div><button onClick={() => removeVideo(84)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-84' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-85"></div><button onClick={() => removeVideo(85)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-85' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-86"></div><button onClick={() => removeVideo(86)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-86' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>

             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-87"></div><button onClick={() => removeVideo(87)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-87' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-88"></div><button onClick={() => removeVideo(88)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-88' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-89"></div><button onClick={() => removeVideo(89)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-89' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>




             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-90"></div><button onClick={() => removeVideo(90)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button>
              </div>
              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-90' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-91"></div><button onClick={() => removeVideo(91)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>
              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-91' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-92"></div><button onClick={() => removeVideo(92)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-92' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-93"></div><button onClick={() => removeVideo(93)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-93' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-94"></div><button onClick={() => removeVideo(94)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-94' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-95"></div><button onClick={() => removeVideo(95)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-95' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-96"></div><button onClick={() => removeVideo(96)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-96' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>

             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-97"></div><button onClick={() => removeVideo(97)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-97' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-98"></div><button onClick={() => removeVideo(98)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-98' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
             <div onDoubleClick={(e)=>{zoomIn(e)}} className={"vid-div" + (grid == 0 ? " fb-100 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-99"></div><button onClick={() => removeVideo(99)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video  onEnded={() => endfunction(0)} onError={(e)=>{e.preventDefault()}}  draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-99' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div> */}

          </div>
        </div>
      </div>
    </>
  )
}