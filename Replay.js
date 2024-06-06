import React from "react";
import '../App.css';
import { useEffect } from 'react';
import { FaExpand, FaVideo } from 'react-icons/fa';
import { useState } from 'react';
import axios from 'axios';
import { FaFastForward, FaFastBackward, FaPlay, FaPause } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCamera, faRectangleXmark, faSquare, faTableCellsLarge } from '@fortawesome/free-solid-svg-icons';
import { faTableCells } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../Components/Navbar';
export default function Replay() {
    const apiUrl = localStorage.getItem('api_node')
    const apiDjango = localStorage.getItem('api')

    const [cameraList, setCameraList] = useState([])
    const [flag, setFlag] = useState(false)
    const [cameraName, setCameraName] = useState("")
    const [videoList, setVideoList] = useState([])
    const [filteredList, setFilteredList] = new useState(videoList);
    const [vidListsarr, setVidsListarr] = useState([[], [], [], [], [], []])
    const [grid, setGrid] = useState(0)
    const [isActive, setIsActive] = useState(false);
    //   const [videoList1, setVideoList1] = useState([])
    //   const [videoList2, setVideoList2] = useState([])
    //   const [videoList3, setVideoList3] = useState([])
    //   const [videoList4, setVideoList4] = useState([])
    let currvid = 0;

    const handleClick = event => {
        // 👇️ toggle isActive state on click
        setIsActive(current => !current);
    };






    var map = new Map();
    map.set(1, 'Jan')
    map.set(2, 'Feb')
    map.set(3, 'Mar')
    map.set(4, 'Apr')
    map.set(5, 'May')
    map.set(6, 'Jun')
    map.set(7, 'Jul')
    map.set(8, 'Aug')
    map.set(9, 'Sep')
    map.set(10, 'Oct')
    map.set(11, 'Nov')
    map.set(12, 'Dec')


    async function getCamerasList() {
        try {
            const groupData = await axios.get(apiDjango + 'camera_group_list/').catch((res) => {
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
            // setGroups(groupData.data)
            console.log(groupData.data)
        }
        catch (e) {
            console.log(e)
        }
        // const data = await axios.get('http://127.0.0.1:8080/Recordings')
        // const data = axios.get(apiUrl+'Recordings/').then((res) => {

        //     console.log(res)
        //     setCameraList(cameraList => {

        //         return [...res.data]
        //     })
        //     console.log('hi')
        //     console.log(cameraList)
        // }).catch(e=>{console.log(e)})

    }

    function getVideoList(cameraName) {
        // let url = 'http://127.0.0.1:8080/Recordings/' + cameraName
        let url = apiUrl + 'Recordings/' + cameraName

        const data = axios.get(url).then((res) => {
            // if (videoCount == 0 && videoList.length == 0) setVidsarr(() => { return res.data })
            // else if (videoCount == 3 && videoList.length != 0) setVidsarr(() => { return res.data })
            // else if (videoCount == 0) setVidsarr(() => { return res.data })
            // else if (videoCount == 1) setVidsarr(() => { return res.data })
            // else if (videoCount == 2) setVidsarr(() => { return res.data })

            setVideoList(() => {
                return res.data;
            })
            setFilteredList(() => {
                return res.data
            })
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

    const filterbyDate = (e) => {
        const query = e.value;
        var updatedList = [...videoList]
        updatedList = updatedList.filter((item) => {
            if ((item.split('T')[0].slice(0, 4) + '-' + item.split('T')[0].slice(4, 6) + '-' + item.split('T')[0].slice(6, 8))
                .toLowerCase().includes(query.toLowerCase()))
                return item;
        })
        setFilteredList(updatedList)
    }
    useEffect(() => {
        getCamerasList();
        // getVideoList(cameraName);
    }, [])

    const [videoCount, setVideoCount] = useState(0);
    const [sidebarvids, setSidebarVids] = useState([[], [], [], []]);
    const [vidLoadArr, setVidLoadArr] = useState([false, false, false, false, false, false])

    function playvideo(videoName) {


        const video = document.getElementById('hls-' + parseInt(videoCount + 1))
            video.setAttribute('src', apiUrl+'Recordings/' + cameraName + '/' + videoName)
            console.log('apiurl is '+ apiUrl)
            video.load();
            video.addEventListener('canplay',()=>{
                video.play();
            })

        // if (flag == true) {
        //     const video = document.getElementById('hls-' + parseInt(videoCount + 1))
        //     video.setAttribute('src', apiUrl+'Recordings/' + cameraName + '/' + videoName)
        //     console.log('apiurl is '+ apiUrl)
        //     video.load();
        //     video.addEventListener('canplay',()=>{
        //         video.play();
        //     })
        // }
        // // console.log("cameraname:" + cameraName)
        // // console.log(" videCount" + videoCount)
        // // console.log(videoName)
        // // const video = document.getElementById('hls-' + parseInt(videoCount + 1))
        // // video.pause();
        // // video.removeAttribute('src')
        // // video.load();
        // // video.setAttribute('src', 'http://127.0.0.1:8080/Recordings/' + cameraName + '/' + videoName)
        // // video.load();
        // // video.play();
        // else if (videoCount == 0) {
        //     // if (vidLoadArr[videoCount]) {
        //     //     console.log(videoName)
        //     //     const video = document.getElementById('hls-' + parseInt(6))
        //     //     video.pause();
        //     //     video.removeAttribute('src')
        //     //     video.load();
        //     //     video.setAttribute('src', 'http://127.0.0.1:8080/Recordings/' + cameraName + '/' + videoName)
        //     //     video.load();
        //     //     video.play();
        //     // }
        //     {
        //         // setVidLoadArr(vidLoadArr => {
        //         //     let tempArr = vidLoadArr;
        //         //     tempArr[videoCount] = true;
        //         //     return tempArr
        //         // })
        //         const video = document.getElementById('hls-' + parseInt(6))
        //         video.setAttribute('src', apiUrl+'Recordings/' + cameraName + '/' + videoName)
        //         video.load();
        //         video.addEventListener('canplay',()=>{
        //             video.play();
        //         })
        //     }
        // }
        // // else if (vidLoadArr[videoCount]) {
        // //     console.log(videoName)
        // //     const video = document.getElementById('hls-' + parseInt(videoCount+1))
        // //     video.pause();
        // //     video.removeAttribute('src')
        // //     video.load();
        // //     video.setAttribute('src', 'http://127.0.0.1:8080/Recordings/' + cameraName + '/' + videoName)
        // //     video.load();
        // //     video.play();
        // // }
        // else {
        //     // setVidLoadArr(vidLoadArr => {
        //     //     let tempArr = vidLoadArr;
        //     //     tempArr[videoCount] = true;
        //     //     return tempArr
        //     // })
        //     const video = document.getElementById('hls-' + parseInt(videoCount))
        //     video.setAttribute('src', apiUrl+'Recordings/' + cameraName + '/' + videoName)
        //     video.load();
        //     video.addEventListener('canplay',()=>{
        //         video.play();
        //     })
        // }
    }

    function addVideo(camera, videos) {
        console.log('apiurl is '+ apiUrl)

        setFlag(false)
        console.log("event.target.value = " + camera)
        currvid = videoCount
        const center = document.getElementById('cen-' + parseInt(videoCount + 1))
        center.innerText = camera
        if (vidLoadArr[videoCount]) {
            const video = document.getElementById('hls-' + parseInt(videoCount + 1))
            video.pause();
            video.removeAttribute('src')
            video.load();
            video.setAttribute('src', apiUrl+'Recordings/' + camera + '/' + videos[0])
            video.load();
            video.addEventListener('canplay',()=>{
                video.play();
            })
            // setVideoCount((videoCount + 1) % 6)
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
        const video = document.getElementById('hls-' + parseInt(videoCount + 1))
        video.setAttribute('src', apiUrl+'Recordings/' + camera + '/' + videos[0])
        video.load();
        video.addEventListener('canplay',()=>{
            video.play();
        })
        // setVideoCount((videoCount + 1) % 6)

    }

    function removeVideo(videoC) {
        console.log("removing")
        if (vidLoadArr[videoC]) {
            setVidLoadArr(vidLoadArr => {
                let tempArr = vidLoadArr;
                tempArr[videoC] = false;
                return tempArr
            })
            setVidsListarr(vidsarr => {
                let temp = [...vidsarr]
                temp[videoC] = [];
                return temp;
            })


            
            // vidLoadArr[videoC-1] = false;
            // videoplayer.parentNode.replaceChild(newVideoPlayer, videoplayer);
            // <div id="custom-seekbar-0">
            const oldSeekbar = document.getElementById("custom-seekbar-"+videoC)
            const newSeekbar = document.createElement('div');
            newSeekbar.id = "custom-seekbar-"+videoC
            oldSeekbar.parentNode.replaceChild(newSeekbar,oldSeekbar)



            // setVideoCount(videoC)
            const video = document.getElementById('hls-' + parseInt(videoC + 1))
            const center = document.getElementById('cen-' + parseInt(videoC + 1))
            center.innerText = ""

            video.pause();
            video.removeAttribute('src')
            video.setAttribute('src', '')

        
            video.load()
            return
        }
    }


    function RenderSideList() {
        let render
        // if (flag == false) {

        //     if (videoCount != 0)
        //         render = vidListsarr[videoCount - 1].map((videoName) => {
        //             // console.log("vid count " + videoCount)
        //             return (
        //                 <tr onClick={() => playvideo(videoName)} key={videoName}>
        //                     <td>{videoName.split('T')[0].slice(6, 8) + ' ' + map.get(parseInt(videoName.split('T')[0].slice(4, 6))) + ' ' + videoName.split('T')[0].slice(0, 4)}</td>
        //                     {/* <td>{videoName.split('T')[1].slice(0, 2) + ':' + videoName.split('T')[1].slice(2, 4) + ' ' + (parseInt(videoName.split('T')[1].slice(0, 2)) < 12 ? 'am' : 'pm')}</td>
        //          */}
        //                     <td>{videoName.split('T')[1].slice(0, 2) + ':' + videoName.split('T')[1].slice(2, 4)}</td>
        //                 </tr>
        //             )
        //         })
        //     else {
        //         render = vidListsarr[5].map((videoName) => {
        //             return (
        //                 <tr onClick={() => playvideo(videoName)} key={videoName}>
        //                     <td>{videoName.split('T')[0].slice(6, 8) + ' ' + map.get(parseInt(videoName.split('T')[0].slice(4, 6))) + ' ' + videoName.split('T')[0].slice(0, 4)}</td>
        //                     {/* <td>{videoName.split('T')[1].slice(0, 2) + ':' + videoName.split('T')[1].slice(2, 4) + ' ' + (parseInt(videoName.split('T')[1].slice(0, 2)) < 12 ? 'am' : 'pm')}</td>
        //              */}
        //                     <td>{videoName.split('T')[1].slice(0, 2) + ':' + videoName.split('T')[1].slice(2, 4)}</td>
        //                 </tr>
        //             )
        //         })
        //     }
        // }
        // else {
            render = vidListsarr[videoCount].map((videoName) => {
                return (
                    <tr onClick={() => playvideo(videoName)} key={videoName}>
                        <td>{videoName.split('T')[0].slice(6, 8) + ' ' + map.get(parseInt(videoName.split('T')[0].slice(4, 6))) + ' ' + videoName.split('T')[0].slice(0, 4)}</td>
                        {/* <td>{videoName.split('T')[1].slice(0, 2) + ':' + videoName.split('T')[1].slice(2, 4) + ' ' + (parseInt(videoName.split('T')[1].slice(0, 2)) < 12 ? 'am' : 'pm')}</td>
                 */}
                        <td>{videoName.split('T')[1].slice(0, 2) + ':' + videoName.split('T')[1].slice(2, 4)}</td>
                    </tr>
                )
            })

        // }
        return render;

    }

















    var varDate = new Date()
    const [timeState, setTimeState] = useState([[varDate.toLocaleTimeString()], [varDate.toLocaleTimeString()], [varDate.toLocaleTimeString()], [varDate.toLocaleTimeString()], [varDate.toLocaleTimeString()], [varDate.toLocaleTimeString()]]);
    const [duration, setDuration] = useState([[varDate.toLocaleTimeString()], [varDate.toLocaleTimeString()], [varDate.toLocaleTimeString()], [varDate.toLocaleTimeString()], [varDate.toLocaleTimeString()], [varDate.toLocaleTimeString()]]);

    function setIST(val) {
        try {
            const time = document.getElementById('time-' + parseInt(val))
            const duration = document.getElementById('duration-' + parseInt(val))

            const videoplayer = document.getElementById('hls-' + parseInt(val + 1))
            var percentage = (videoplayer.currentTime / videoplayer.duration) * 100;
            var customSeekbar = document.querySelector("#custom-seekbar-" + parseInt(val) + " span");
            customSeekbar.style.width = percentage + "%";

            document.getElementById('custom-seekbar-' + parseInt(val)).addEventListener('click', function (e) {
                var offset = e.currentTarget.getBoundingClientRect();
                var left = e.pageX - offset.left;
                var totalWidth = e.currentTarget.clientWidth;
                var percentage = (left / totalWidth);
                var vidTime = videoplayer.duration * percentage;
                videoplayer.currentTime = vidTime;
            })

            // const currvidTime  = event.target.currentSrc;
            const currvidTime = videoplayer.currentSrc.slice(-19);
            const vidDuration = videoplayer.duration;
            //   console.log("currvidTime " + currvidTime)
            varDate.setHours(parseInt(currvidTime.split('T')[1].slice(0, 2)))
            // console.log("hours = "+ currvidTime.split('T')[1].slice(0, 2))
            varDate.setMinutes(parseInt(currvidTime.split('T')[1].slice(2, 4)))
            varDate.setSeconds(parseInt(currvidTime.split('T')[1].slice(4, 6)))
            // console.log("varDate= " + varDate)
            let forDuration = new Date(varDate)
            var timeinseconds = videoplayer.currentTime

            forDuration.setHours(forDuration.getHours() + ((vidDuration / 60) / 60))
            forDuration.setMinutes(forDuration.getMinutes() + (vidDuration / 60))
            forDuration.setSeconds(forDuration.getSeconds() + (vidDuration % 60))
            // var timeinseconds = event.target.currentTime
            // console.log(forDuration)

            // console.log(varDate.getSeconds()+(timeinseconds%60))
            varDate.setHours(varDate.getHours() + ((timeinseconds / 60) / 60))
            varDate.setMinutes(varDate.getMinutes() + (timeinseconds / 60))
            varDate.setSeconds(varDate.getSeconds() + (timeinseconds % 60))
            // console.log(varDate.getSeconds()+'v')
            // setTimeState(varDate.toLocaleTimeString())
            // setTimeState(timestate=>{
            //     var temp = timestate
            //     temp[val]=varDate.toLocaleTimeString()
            //     console.log(temp[val])
            //     return temp
            // })
            // console.log(varDates)
            time.innerText = varDate.toLocaleTimeString() + "/" + forDuration.toLocaleTimeString()
            // console.log("inner text = "+varDate.toLocaleTimeString() + "/" + forDuration.toLocaleTimeString())
            // setDuration(forDuration.toLocaleTimeString())
            // setDuration(duration=>{
            //     var temp = duration
            //     temp[val] = forDuration.toLocaleTimeString()
            //     return temp
            // })
            // console.log(dateState.getSeconds())

        }
        catch (e) { console.log(e) }
        // console.log(dateState.getSeconds())
    }
    
    function prevfunction(val) {
        console.log('prev')
        const videoplayer = document.getElementById('hls-' + parseInt(val + 1))
        videoplayer.controls = false;

        const newVideoPlayer = document.createElement('video');
        newVideoPlayer.id = 'hls-' + parseInt(val + 1);
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
            const center = document.getElementById('cen-' + parseInt(val + 1))
            // nextSourceElement.setAttribute('src', 'http://127.0.0.1:8080/Recordings/' + center.innerText + '/' + nextVideo);
            nextSourceElement.setAttribute('src', apiUrl+'Recordings/' + center.innerText + '/' + nextVideo);

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
                        setIST(val);
                    })
                }
                catch (err) { console.log(err) }

            })
            newVideoPlayer.addEventListener('ended', () => {
                endfunction(val);
            })
        }
    }

    function endfunction(val) {
        console.log('ended')
        const videoplayer = document.getElementById('hls-' + parseInt(val + 1))
        videoplayer.controls = false;

        const newVideoPlayer = document.createElement('video');
        newVideoPlayer.id = 'hls-' + parseInt(val + 1);
        newVideoPlayer.className = 'vid-r';
        newVideoPlayer.poster= process.env.PUBLIC_URL + 'vid-load.png'
        // newVideoPlayer.setAttribute('controls', '');
        newVideoPlayer.setAttribute('autoplay', '');
        const currentsource = videoplayer.currentSrc;
        console.log("ans = " + vidListsarr[val])
        const currentIndex = vidListsarr[val].indexOf(currentsource.split('/')[5]);
        console.log(currentIndex)
        const nextIndex = currentIndex + 1;

        if (nextIndex < vidListsarr[val].length) {
            const nextVideo = vidListsarr[val][nextIndex];
            const nextSourceElement = document.createElement('source');
            const center = document.getElementById('cen-' + parseInt(val + 1))
            // nextSourceElement.setAttribute('src', 'http://127.0.0.1:8080/Recordings/' + center.innerText + '/' + nextVideo);
            console.log("inside")
            nextSourceElement.setAttribute('src', apiUrl+'Recordings/' + center.innerText + '/' + nextVideo);

            nextSourceElement.setAttribute('type', 'video/mp4');

            newVideoPlayer.appendChild(nextSourceElement);
            newVideoPlayer.load();
            newVideoPlayer.addEventListener('canplay', () => {
                try {
                    videoplayer.parentNode.replaceChild(newVideoPlayer, videoplayer);
                    videoplayer.remove();

                    newVideoPlayer.play();
                    // newVideoPlayer.ontimeupdate
                    newVideoPlayer.addEventListener('timeupdate', () => {
                        setIST(val);
                    })
                }
                catch (err) { console.log(err) }

            })
            newVideoPlayer.addEventListener('ended', () => {
                endfunction(val);
            })
        }
    }

    function pausefunction(val) {
        const videoplayer = document.getElementById('hls-' + parseInt(val + 1))
        videoplayer.pause();
    }

    function playfunction(val) {
        const videoplayer = document.getElementById('hls-' + parseInt(val + 1))
        if(videoplayer.currentSrc && videoplayer.currentSrc!='')
        videoplayer.play()
    }
    function fullscrn(val) {
        console.log('full')
        const videoContainer = document.getElementById('hls-' + parseInt(val + 1));

        // Fullscreen button click event
        if (videoContainer.requestFullscreen) {
            videoContainer.requestFullscreen();
        } else if (videoContainer.mozRequestFullScreen) {
            videoContainer.mozRequestFullScreen();
        } else if (videoContainer.webkitRequestFullscreen) {
            videoContainer.webkitRequestFullscreen();
        } else if (videoContainer.msRequestFullscreen) {
            videoContainer.msRequestFullscreen();
        }
    }


    return (
        <>
            <Navbar />
            <div className="fixed z-90 w-full text-left bg-gray-700">
                <button onClick={() => setIsActive(current => !current)} className="mt-1 mb-1 ml-2 text-white focus:ring-4 font-medium rounded-md text-sm px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800" type="button" data-drawer-target="drawer-navigation" data-drawer-show="drawer-navigation" aria-controls="drawer-navigation">
                    Select Cameras <FontAwesomeIcon className='ml-2' icon={faCamera} />
                </button>
                {/* <button id="dropdownNavbarLink" data-dropdown-toggle="dropdownNavbargrid2" class="inline-flex items-center mt-1 mb-1 ml-2 text-white focus:ring-4 font-medium rounded-md text-sm px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800">
                    Grid<svg class="w-5 h-5 ml-1" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    <div id="dropdownNavbargrid2" class=" hidden font-normal divide-y rounded-lg shadow w-16 bg-white divide-gray-600">
                        <ul class="text-sm text-gray-700 text-black" aria-labelledby="dropdownLargeButton">
                            <li>

                                <button id="1-grid" onClick={() => setGrid(0)} className="mt-1 mb-1 ml-1 text-white focus:ring-4 font-medium rounded-md text-md px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800" >
                                    1x1
                                </button>
                            </li>
                            <li>

                                <button id="2-grid" onClick={() => setGrid(1)} className="mt-1 mb-1 ml-1 text-white focus:ring-4 font-medium rounded-md text-md px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800" >
                                    2x2
                                </button>
                            </li>
                            <li>

                                <button id="3-grid" onClick={() => setGrid(2)} className="mt-1 mb-1 ml-1 text-white focus:ring-4 font-medium rounded-md text-md px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800" >
                                    3x2
                                </button>
                            </li>
                        </ul>
                    </div>
                </button> */}
            </div>
            <div id="drawer-navigation" className="fixed top-12 left-0 z-60 w-64 h-screen p-4 overflow-y-auto transition-transform -translate-x-full bg-gray-800" tabindex="-1" aria-labelledby="drawer-navigation-label">
                <h5 id="drawer-navigation-label" className="text-base font-semibold uppercase text-gray-400">Menu</h5>
                <button onClick={() => handleClick()} type="button" data-drawer-hide="drawer-navigation" aria-controls="drawer-navigation" className="text-gray-400 bg-transparent rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center hover:bg-gray-600 hover:text-white" >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <span className="sr-only">Close menu</span>
                </button>
                <div className="py-4 overflow-y-auto">
                    <ul className="space-y-2 font-medium mt-2">
                        {
                            cameraList.map(camera => {
                                return (
                                    <li>
                                        <a href="#" className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700">
                                            <FaVideo />
                                            <span onClick={(e) => {
                                                setCameraName(e.target.innerText)
                                                getVideoList(e.target.innerText);
                                                // addVideo(e)
                                            }} className="w-full ml-3">{camera}</span>
                                        </a>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
            {/* <aside id="logo-sidebar" className="fixed left-0 z-0 w-60 h-screen transition-transform -translate-x-full border-r sm:translate-x-0 bg-gray-900 border-gray-900" aria-label="Sidebar">
                <div className="h-full px-3 pb-4 overflow-y-auto text-white bg-gray-900">CAM LIST
                    <ul className="space-y-2 font-medium mt-2">
                        {
                            cameraList.map(camera => {
                                return (
                                    <li>
                                        <a href="#" className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700">
                                            <FaVideo />
                                            <span onClick={(e)=>{
                                                setCameraName(e.target.innerText)
                                                getVideoList(e.target.innerText);
                                                // addVideo(e)
                                            }}  className="w-full ml-3">{camera}</span>
                                        </a>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </aside> */}
            <aside id="logo-sidebar" className="fixed right-0 z-0 w-60 h-screen transition-transform -translate-x-full border-r sm:translate-x-0 bg-gray-900 border-gray-900" aria-label="Sidebar">
                <div className="h-full px-3 pb-4 overflow-y-auto text-white bg-gray-900">
                    <center className="mb-2">{cameraName}</center>
                    <label for="date-search">Calendar:</label>
                    <input type="date" id="by-date" className="text-black w-full mb-4" name="date-search" onChange={(e) => filterbyDate(e.target)} />
                    <table className='fl-table text-black'>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            <RenderSideList />
                        </tbody>
                    </table>
                    {/* <ul className="space-y-2 font-medium mt-2">
                        {
                            videoList.map(video => {
                                return (
                                    <li>
                                        <a href="#" className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700">
                                            <FaVideo />
                                            <span className="w-full ml-3">{video}</span>
                                        </a>
                                    </li>
                                )
                            })
                        }
                    </ul> */}
                </div>
            </aside>
            <div id="vid-box" className={"sticky z-0 items-center mt-10 h-full sm:mr-64" + (isActive ? " sm:ml-64" : " sm:ml-4")}>
                <div className="rounded-lg border-gray-700">
                    <div className={"flexing gap-1"}>
                        <div className={"vid-div-r videoContainer z-0" + (grid == 0 ? " fbr-100 " : (grid == 1 ? " fb-50" : " fb-33"))}>
                            <div className={'flex justify-between w-full text-xl text-white bg-gray-900'}>
                                <button id="cen-1" className="text-sm ml-2" onClick={(e) => {
                                    setFlag(true)
                                    setCameraName(e.target.innerText)
                                    // setVideoCount(0)
                                }}>
                                </button>
                                <button onClick={() => removeVideo(0)}>
                                    <FontAwesomeIcon className="mr-2" icon={faRectangleXmark} />
                                </button>
                            </div>
                            <div className="customControls">
                                <button onClick={() => prevfunction(0)} className="control-btn"><FaFastBackward /></button>
                                <button onClick={() => pausefunction(0)} className="control-btn"><FaPause /></button>
                                <button onClick={() => playfunction(0)} className="control-btn"><FaPlay /></button>
                                <button onClick={() => endfunction(0)} className="control-btn"><FaFastForward /></button>
                                <button onClick={() => fullscrn(0)} className="control-btn"><FaExpand /></button>
                                <div id="custom-seekbar-0">
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
                            <video onTimeUpdate={() => setIST(0)} onEnded={() => endfunction(0)} autoPlay id='hls-1' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid-r'></video>
                        </div>

                        <div className={"vid-div videoContainer z-0" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : " fb-33"))}>
                            <div className={'flex justify-between w-full text-right text-xl text-white bg-gray-900'}>
                                <button id="cen-2" className="text-sm ml-2" onClick={(e) => {
                                    setFlag(true)
                                    setCameraName(e.target.innerText)
                                    // setVideoCount(1)
                                }}>
                                </button>
                                <button onClick={() => removeVideo(1)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button></div>
                            <div className="customControls">
                                {/* <button onClick={fullscrn} className="control-btn">FS</button> */}
                                <button onClick={() => prevfunction(1)} className="control-btn"><FaFastBackward /></button>
                                <button onClick={() => pausefunction(1)} className="control-btn"><FaPause /></button>
                                <button onClick={() => playfunction(1)} className="control-btn"><FaPlay /></button>
                                <button onClick={() => endfunction(1)} className="control-btn"><FaFastForward /></button>
                                <button onClick={() => fullscrn(1)} className="control-btn"><FaExpand /></button>

                                <div id="custom-seekbar-1">
                                    <span>

                                    </span>
                                </div>
                                <div id="time-1" className="time">
                                    {/* {dateState.toLocaleString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                  hour12: true,
                })} */
                                    }
                                </div>

                            </div>
                            <video onTimeUpdate={() => setIST(1)} onEnded={() => endfunction(1)} autoPlay id='hls-2' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>
                        <div className={"vid-div videoContainer z-0" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : " fb-33"))}>
                            <div className={'flex justify-between w-full text-right text-xl text-white bg-gray-900'}>
                                <button id="cen-3" className="text-sm ml-2" onClick={(e) => {
                                    setFlag(true)
                                    setCameraName(e.target.innerText)
                                    // setVideoCount(2)
                                }}>
                                </button>
                                <button onClick={() => removeVideo(2)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button></div>
                            <div className="customControls">
                                {/* <button onClick={fullscrn} className="control-btn">FS</button> */}
                                <button onClick={() => prevfunction(2)} className="control-btn"><FaFastBackward /></button>
                                <button onClick={() => pausefunction(2)} className="control-btn"><FaPause /></button>
                                <button onClick={() => playfunction(2)} className="control-btn"><FaPlay /></button>
                                <button onClick={() => endfunction(2)} className="control-btn"><FaFastForward /></button>
                                <button onClick={() => fullscrn(2)} className="control-btn"><FaExpand /></button>

                                <div id="custom-seekbar-2">
                                    <span>

                                    </span>
                                </div>
                                <div id="time-2" className="time">
                                    {/* {dateState.toLocaleString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                  hour12: true,
                })} */
                                    }
                                </div>

                            </div>
                            <video onTimeUpdate={() => setIST(2)} onEnded={() => endfunction(2)} autoPlay id='hls-3' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>
                        <div className={"vid-div videoContainer z-0" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : " fb-33"))}>
                            <div className={'flex justify-between w-full text-right text-xl text-white bg-gray-900'}>
                                <button id="cen-4" className="text-sm ml-2" onClick={(e) => {
                                    setFlag(true)
                                    setCameraName(e.target.innerText)
                                    // setVideoCount(3)
                                }}>
                                </button>
                                <button onClick={() => removeVideo(3)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button></div>
                            <div className="customControls">
                                {/* <button onClick={fullscrn} className="control-btn">FS</button> */}
                                <button onClick={() => prevfunction(3)} className="control-btn"><FaFastBackward /></button>
                                <button onClick={() => pausefunction(3)} className="control-btn"><FaPause /></button>
                                <button onClick={() => playfunction(3)} className="control-btn"><FaPlay /></button>
                                <button onClick={() => endfunction(3)} className="control-btn"><FaFastForward /></button>
                                <button onClick={() => fullscrn(3)} className="control-btn"><FaExpand /></button>

                                <div id="custom-seekbar-3">
                                    <span>

                                    </span>
                                </div>
                                <div id="time-3" className="time">
                                    {/* {dateState.toLocaleString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                  hour12: true,
                })} */
                                    }
                                </div>

                            </div>
                            <video onTimeUpdate={() => setIST(3)} onEnded={() => endfunction(3)} autoPlay id='hls-4' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>
                        <div className={"vid-div videoContainer z-0" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : " fb-33"))}>
                            <div className={'flex justify-between w-full text-right text-xl text-white bg-gray-900'}>
                                <button id="cen-5" className="text-sm ml-2" onClick={(e) => {
                                    setFlag(true)
                                    setCameraName(e.target.innerText)
                                    // setVideoCount(4)
                                }}>
                                </button>
                                <button onClick={() => removeVideo(4)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button></div>
                            <div className="customControls">
                                {/* <button onClick={fullscrn} className="control-btn">FS</button> */}
                                <button onClick={() => prevfunction(4)} className="control-btn"><FaFastBackward /></button>
                                <button onClick={() => pausefunction(4)} className="control-btn"><FaPause /></button>
                                <button onClick={() => playfunction(4)} className="control-btn"><FaPlay /></button>
                                <button onClick={() => endfunction(4)} className="control-btn"><FaFastForward /></button>
                                <button onClick={() => fullscrn(4)} className="control-btn"><FaExpand /></button>

                                <div id="custom-seekbar-4">
                                    <span>

                                    </span>
                                </div>
                                <div id="time-4" className="time">
                                    {/* {dateState.toLocaleString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                  hour12: true,
                })} */
                                    }
                                </div>

                            </div>
                            <video onTimeUpdate={() => setIST(4)} onEnded={() => endfunction(4)} autoPlay id='hls-5' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>
                        <div className={"vid-div videoContainer z-0" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : " fb-33"))}>
                            <div className={'flex justify-between w-full text-right text-xl text-white bg-gray-900'}>
                                <button id="cen-6" className="text-sm ml-2" onClick={(e) => {
                                    setFlag(true)
                                    setCameraName(e.target.innerText)
                                    // setVideoCount(5)
                                }}>
                                </button>
                                <button onClick={() => removeVideo(5)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button></div>
                            <div className="customControls">
                                {/* <button onClick={fullscrn} className="control-btn">FS</button> */}
                                <button onClick={() => prevfunction(5)} className="control-btn"><FaFastBackward /></button>
                                <button onClick={() => pausefunction(5)} className="control-btn"><FaPause /></button>
                                <button onClick={() => playfunction(5)} className="control-btn"><FaPlay /></button>
                                <button onClick={() => endfunction(5)} className="control-btn"><FaFastForward /></button>
                                <button onClick={() => fullscrn(5)} className="control-btn"><FaExpand /></button>

                                <div id="custom-seekbar-5">
                                    <span>

                                    </span>
                                </div>
                                <div id="time-5" className="time">
                                    {/* {dateState.toLocaleString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                  hour12: true,
                })} */
                                    }
                                </div>

                            </div>
                            <video onTimeUpdate={() => setIST(5)} onEnded={() => endfunction(5)} autoPlay id='hls-6' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>

                    </div>
                </div>
            </div>

        </>
    )

}