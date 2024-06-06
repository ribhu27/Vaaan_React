import '../App.css';
import Hls from 'hls.js';
import React, { useRef } from 'react';
import { useEffect } from 'react';
import Navbar from '../Components/Navbar';
import { FaAlignCenter, FaArrowDown, FaArrowLeft, FaArrowRight, FaArrowUp, FaCamera, FaChevronDown, FaDotCircle, FaMinus, FaPlus, FaVideo } from 'react-icons/fa';
import { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCamera, faRectangleXmark, faTimes } from '@fortawesome/free-solid-svg-icons';
import AddGroupModal from './AddGroupModal'
import RotateModal from './RotateModal'
import SnapModal from './SnapModal';
export default function Ptz() {
    const apiUrl = localStorage.getItem('api')
    const interval = useRef()
    const [expand, setExpand] = useState(-1)
    const [customRotate, setCustomRotate] = useState(false)
    const [currentCam, setCurrentCam] = useState("")
    const [ptzCamerasList, setPtzCamerasList] = useState({})
    const [cameraList, setCameraList] = useState([])
    const [rotateList, setRotateList] = useState([])
    const [dataUrl, setDataUrl] = useState("")
    const [grid, setGrid] = useState(2)
    const [groups, setGroups] = useState([])
    const [ptzActive, setPtzActive] = useState(false)
    const [isActive, setIsActive] = useState(false);
    const [videoCount, setVideoCount] = useState(0);
    const [rotate, setRotate] = useState(0)
    const [showRotate, setShowRotateModal] = useState(false)
    const [showSnap, setShowSnap] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [hlsArr, setHlsArr] = useState([{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]);
    const [vidLoadArr, setVidLoadArr] = useState([false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false])
    let flagForVideoDrag = false
    let flagForGroupDrag = false
    let i
    function handleRotateModal() {
        setShowRotateModal(true)
    }
    function handleSnapModal() {
        setShowSnap(true)
    }
    function handleSnapClose() {
        setShowSnap(false)
    }
    function handleRotateClose() {
        setShowRotateModal(false)
    }
    async function handleOnClose() {
        setShowModal(false)
        const groupData = await axios.get(apiUrl + 'camera_group_list/').catch((res) => {
            console.log(res)
        })
        setGroups(groupData.data)

    }
    function handleAddGroup() {
        setShowModal(true)
    }
    async function createHLS(hls, url, vid) {
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
    const handlePtzActive = event =>{
        setPtzActive(current => !current)
    }
    const handleClick = event => {
        // 👇️ toggle isActive state on click
        setIsActive(current => !current);
    };
    async function getCamerasList() {
        // const data = await axios.get('http://127.0.0.1:8080/Recordings')
        try {
            const groupData = await axios.get(apiUrl + 'camera_group_list/').catch((res) => {
                console.log(JSON.stringify(res))
            })
            setPtzCamerasList(()=>{
                let retlist = {};
                groupData.data.map(group =>{
                    if(group.all_cameras_group){
                        group.all_cameras.map(device => { retlist[device.device_name] = [device.ip_address, device.username, device.password] })
                    }
                })
                return retlist
            })

            setCameraList(() => {
                let retlist = []
                groupData.data.map(group => {
                    if (group.all_cameras_group) {
                        group.all_cameras.map(device => { retlist.push(device.device_name) })
                    }
                })
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
                const url = apiUrl + "LiveStreams/" + sessionStorage.getItem('hls-' + i) + "/index.m3u8"
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
        setCurrentCam(event.target.innerText)
        console.log("event.target.value = " + event.target.innerText)
        console.log("ptz camera is " + ptzCamerasList[event.target.innerText])
        sessionStorage.setItem('hls-' + parseInt(videoCount), event.target.innerText)
        // cameraSet.add(event.target.innerText)

        if (vidLoadArr[videoCount]) {
            // removeVideo(videoCount)
            var url = apiUrl + "LiveStreams/" + event.target.innerText + "/index.m3u8"
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
        var url = apiUrl + "LiveStreams/" + event.target.innerText + "/index.m3u8"
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
                // removeVideo(videoCount)
                var url = apiUrl + "LiveStreams/" + cameraName + "/index.m3u8"
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
            var url = apiUrl + "LiveStreams/" + cameraName + "/index.m3u8"
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
                var url = apiUrl + "LiveStreams/" + cameraName2 + "/index.m3u8"
                hlsArr[vidcount1].hls.detachMedia()
                hlsArr[vidcount1].hls.destroy()
                hlsArr[vidcount1].hls = new Hls(config)
                hlsArr[vidcount1].hls.loadSource(url)
                hlsArr[vidcount1].hls.attachMedia(document.getElementById('hls-' + parseInt(vidcount1)))
                document.getElementById('cen-' + parseInt(vidcount1)).innerText = cameraName2

                url = apiUrl + "LiveStreams/" + cameraName1 + "/index.m3u8"
                hlsArr[vidcount2].hls.detachMedia()
                hlsArr[vidcount2].hls.destroy()
                hlsArr[vidcount2].hls = new Hls(config)
                hlsArr[vidcount2].hls.loadSource(url)
                hlsArr[vidcount2].hls.attachMedia(document.getElementById('hls-' + parseInt(vidcount2)))
                document.getElementById('cen-' + parseInt(vidcount2)).innerText = cameraName1
                setVideoCount((vidcount2) % ((grid + 1) * (grid + 1)))
            }
            else if (vidLoadArr[vidcount1] && !vidLoadArr[vidcount2]) {
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
                var url = apiUrl + "LiveStreams/" + cameraName1 + "/index.m3u8"
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
                            const url = apiUrl + "LiveStreams/" + device.device_name + "/index.m3u8"
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
                            // if (count == (grid + 1) * (grid + 1)) setGrid(grid => grid + 1)

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
                        const url = apiUrl + "LiveStreams/" + device.device_name + "/index.m3u8"
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

                        count = (count + 1) % 36
                        // if (count == (grid + 1) * (grid + 1)) setGrid(grid => grid + 1)

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
            if ((grid + 1) * (grid + 1) <= count) setGrid(grid => grid + 1)

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
            if (vidLoadArr[index]) {
                // removeVideo(videoCount)
                const url = apiUrl + "LiveStreams/" + rotating[i] + "/index.m3u8"
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
                const url = apiUrl + "LiveStreams/" + rotating[i] + "/index.m3u8"
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

            if (vidLoadArr[count]) {
                console.log("entered-" + count)
                // removeVideo(videoCount)
                const url = apiUrl + "LiveStreams/" + device.device_name + "/index.m3u8"
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
                const url = apiUrl + "LiveStreams/" + device.device_name + "/index.m3u8"
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
        if ((grid + 1) * (grid + 1) <= count) setGrid(grid => grid + 1)
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




    function ptzUp(){
        axios.get('http://192.168.10.125:7007/up').then(res=>{console.log(res)}).catch(e=>console.log(e))
    }
    function ptzUpLeft(){
        axios.get('http://192.168.10.125:7007/ul').then(res=>{console.log(res)}).catch(e=>console.log(e))
    }
    function ptzUpRight(){
        axios.get('http://192.168.10.125:7007/ur').then(res=>{console.log(res)}).catch(e=>console.log(e))
    }
    function ptzLeft(){
        axios.get('http://192.168.10.125:7007/lt').then(res=>{console.log(res)}).catch(e=>console.log(e))
    }
    function ptzRight(){
        axios.get('http://192.168.10.125:7007/rt').then(res=>{console.log(res)}).catch(e=>console.log(e))
    }
    function ptzDownLeft(){
        axios.get('http://192.168.10.125:7007/dl').then(res=>{console.log(res)}).catch(e=>console.log(e))
    }
    function ptzDownRight(){
        axios.get('http://192.168.10.125:7007/dr').then(res=>{console.log(res)}).catch(e=>console.log(e))
    }
    function ptzDown(){
        axios.get('http://192.168.10.125:7007/dn').then(res=>{console.log(res)}).catch(e=>console.log(e))
    }
    function ptzStop(){
        axios.get('http://192.168.10.125:7007/stop').then(res=>{console.log(res)}).catch(e=>console.log(e))
    }

    // var ptzinterval

    // function ptzUpLeftContinue(){
    //     ptzinterval = setInterval(()=>{
    //     axios.get('http://192.168.10.125:7007/ul').then(res=>{console.log(res)})
    //     },90)
    // }

    // function ptzUpLeftDiscontinue(){
    //     clearInterval(ptzinterval)
    // }
    


    // function recordClip(){
    //   if(startVideo==false){
    //     setStartVideo(true)
    //     const video =  document.getElementById('hls-0')
    //   }
    // }





    return (
        <>
            <Navbar />
            <div className="fixed w-full text-left bg-gray-700">
                <button onClick={() => setIsActive(current => !current)} className="mt-1 mb-1 ml-2 text-white focus:ring-4 font-medium rounded-md text-sm px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800" type="button" data-drawer-target="drawer-navigation" data-drawer-show="drawer-navigation" aria-controls="drawer-navigation">
                    Select Cameras <FontAwesomeIcon className='ml-1' icon={faCamera} />
                </button>
                <button onClick={()=>setPtzActive(current=>{
                    if(current)
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
                {/* <button onClick={() => setRotate(rotate => !rotate)} className={"mt-1 mb-1 ml-2 text-white focus:ring-4 font-medium rounded-md text-sm px-2.5 py-1.5 mr-2 hover:bg-blue-700 focus:outline-none focus:ring-blue-800 " + (rotate ? " bg-blue-700" : " bg-gray-600")} type="button">
          Rotate<FontAwesomeIcon className='ml-1' icon={faRetweet} />
        </button> */}
                <button onClick={() => { removeAll() }} className="mt-1 mb-1 ml-2 text-white focus:ring-4 font-medium rounded-md text-sm px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800" type="button">
                    Remove All <FontAwesomeIcon className='ml-1' icon={faTimes} />
                </button>

            </div>
            <div id="drawer-navigation" className="fixed top-12 left-0 z-40 w-64 h-screen p-4 overflow-y-auto transition-transform -translate-x-full bg-gray-800" tabIndex="-1" aria-labelledby="drawer-navigation-label">
                {/* <h5 id="drawer-navigation-label" className="text-base font-semibold uppercase text-gray-400">Menu</h5> */}
                <button onClick={handleAddGroup} id="drawer-group-add" className='text-base font-semibold uppercase text-gray-400'>Add Group +</button>
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

            <div id="drawer-right" class="fixed top-12 right-0 z-40 w-64 h-screen p-4 overflow-y-auto transition-transform translate-x-full bg-gray-800" tabindex="-1" aria-labelledby="drawer-right-label">
                <h2 id="drawer-right-label" class="inline-flex items-center mb-4 font-semibold text-gray-500 dark:text-gray-400">
                    PTZ Controls</h2>

                <div className='left-12 flex flex-col'>
                    <div class="ml-3 inline-flex rounded-md shadow-sm" role="group">
                        <button onClick={()=>{ptzUpLeft()}} type="button" class="px-4 py-2 text-4xl font-medium text-gray-900 bg-transparent border border-gray-900 rounded-s-lg hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                            <FaArrowUp className='up-left' />
                        </button>
                        <button onClick={()=>{ptzUp()}} type="button" class="px-4 py-2 text-4xl font-medium text-gray-900 bg-transparent border-t border-b border-gray-900 hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                            <FaArrowUp />
                        </button>
                        <button onClick={()=>{ptzUpRight()}} type="button" class="px-4 py-2 text-4xl font-medium text-gray-900 bg-transparent border border-gray-900 rounded-e-lg hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                            <FaArrowUp className='up-right' />
                        </button>
                    </div>
                    <div class="ml-3 inline-flex rounded-md shadow-sm" role="group">
                        <button onClick={()=>{ptzLeft()}} type="button" class="px-4 py-2 text-4xl font-medium text-gray-900 bg-transparent border border-gray-900 rounded-s-lg hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                            <FaArrowLeft />
                        </button>
                        <button type="button" class="px-4 py-2 text-4xl font-medium text-gray-900 bg-transparent border-t border-b border-gray-900 hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                            <FaDotCircle />
                        </button>
                        <button onClick={()=>{ptzRight()}} type="button" class="px-4 py-2 text-4xl font-medium text-gray-900 bg-transparent border border-gray-900 rounded-e-lg hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                            <FaArrowRight />
                        </button>
                    </div>
                    <div class="ml-3 inline-flex rounded-md shadow-sm" role="group">
                        <button onClick={()=>{ptzDownLeft()}} type="button" class="px-4 py-2 text-4xl font-medium text-gray-900 bg-transparent border border-gray-900 rounded-s-lg hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                            <FaArrowLeft className='down-left' />
                        </button>
                        <button onClick={()=>{ptzDown()}} type="button" class="px-4 py-2 text-4xl font-medium text-gray-900 bg-transparent border-t border-b border-gray-900 hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                            <FaArrowDown />
                        </button>
                        <button onClick={()=>{ptzDownRight()}} type="button" class="px-4 py-2 text-4xl font-medium text-gray-900 bg-transparent border border-gray-900 rounded-e-lg hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                            <FaArrowRight className='down-right'/>
                        </button>
                    </div>
                </div>
                <button onClick={()=>{setPtzActive(current=>!current)}} type="button" data-drawer-hide="drawer-right" aria-controls="drawer-right" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white" >
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                    <span class="sr-only">Close menu</span>
                </button>
                <div className='flex justify-between text-white mt-8'>
                    <FaPlus className='rounded-full border-2 border-white'/>
                    Zoom
                    <FaMinus className='rounded-full border-2 border-white'/>
                </div>
                <div className='flex justify-between text-white mt-8'>
                    <FaPlus className='rounded-full border-2 border-white'/>
                    Focus
                    <FaMinus className='rounded-full border-2 border-white'/>
                </div>
                <div className='flex justify-between text-white mt-8'>
                    <FaPlus className='rounded-full border-2 border-white'/>
                    Iris
                    <FaMinus className='rounded-full border-2 border-white'/>
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
            <div id="vid-box" className={"mt-10 p-2 h-full" + (isActive ? " sm:ml-64" : " sm:ml-4")+(ptzActive?" sm:mr-64":" sm:mr-2")}>
                <div className="rounded-lg border-gray-700">

                    <div className={"flexing gap-1"}>
                        <div className={"vid-div" + (grid == 0 ? " fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                            <div className={'remover flex justify-between h-min w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(0)}>
                                <FontAwesomeIcon className='mr-2' icon={faCamera} />
                            </button>
                                {/* <button className="ml-1 mt-1 text-xs" onClick={() => snapshot(0)}>
              <FontAwesomeIcon className='mr-2' icon={faCamera} />
                </button> */}
                                <div className="ml-1 mt-1 text-xs" id="cen-0"></div><button onClick={() => removeVideo(0)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button>
                            </div>
                            <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-0' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>
                        <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                            <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(1)}>
                                <FontAwesomeIcon className='mr-2' icon={faCamera} />
                            </button><div className="ml-1 mt-1 text-xs" id="cen-1"></div><button onClick={() => removeVideo(1)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button></div>
                            <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-1' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>
                        <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                            <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(2)}>
                                <FontAwesomeIcon className='mr-2' icon={faCamera} />
                            </button><div className="ml-1 mt-1 text-xs" id="cen-2"></div><button onClick={() => removeVideo(2)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button></div>

                            <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-2' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>
                        <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                            <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(3)}>
                                <FontAwesomeIcon className='mr-2' icon={faCamera} />
                            </button><div className="ml-1 mt-1 text-xs" id="cen-3"></div><button onClick={() => removeVideo(3)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button></div>

                            <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-3' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>
                        <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                            <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(4)}>
                                <FontAwesomeIcon className='mr-2' icon={faCamera} />
                            </button><div className="ml-1 mt-1 text-xs" id="cen-4"></div><button onClick={() => removeVideo(4)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button></div>

                            <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-4' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>
                        <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                            <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(5)}>
                                <FontAwesomeIcon className='mr-2' icon={faCamera} />
                            </button><div className="ml-1 mt-1 text-xs" id="cen-5"></div><button onClick={() => removeVideo(5)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button></div>

                            <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-5' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>
                        <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                            <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(6)}>
                                <FontAwesomeIcon className='mr-2' icon={faCamera} />
                            </button><div className="ml-1 mt-1 text-xs" id="cen-6"></div><button onClick={() => removeVideo(6)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button></div>

                            <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-6' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>

                        <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                            <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(7)}>
                                <FontAwesomeIcon className='mr-2' icon={faCamera} />
                            </button><div className="ml-1 mt-1 text-xs" id="cen-7"></div><button onClick={() => removeVideo(7)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button></div>

                            <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-7' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>
                        <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                            <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(8)}>
                                <FontAwesomeIcon className='mr-2' icon={faCamera} />
                            </button><div className="ml-1 mt-1 text-xs" id="cen-8"></div><button onClick={() => removeVideo(8)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button></div>

                            <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-8' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>
                        <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                            <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(9)}>
                                <FontAwesomeIcon className='mr-2' icon={faCamera} />
                            </button><div className="ml-1 mt-1 text-xs" id="cen-9"></div><button onClick={() => removeVideo(9)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button></div>

                            <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-9' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>



                        <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                            <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(10)}>
                                <FontAwesomeIcon className='mr-2' icon={faCamera} />
                            </button><div className="ml-1 mt-1 text-xs" id="cen-10"></div><button onClick={() => removeVideo(10)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button>
                            </div>
                            <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-10' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>
                        <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                            <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(11)}>
                                <FontAwesomeIcon className='mr-2' icon={faCamera} />
                            </button><div className="ml-1 mt-1 text-xs" id="cen-11"></div><button onClick={() => removeVideo(11)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button></div>
                            <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-11' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>
                        <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                            <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(12)}>
                                <FontAwesomeIcon className='mr-2' icon={faCamera} />
                            </button><div className="ml-1 mt-1 text-xs" id="cen-12"></div><button onClick={() => removeVideo(12)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button></div>

                            <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-12' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>
                        <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                            <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(13)}>
                                <FontAwesomeIcon className='mr-2' icon={faCamera} />
                            </button><div className="ml-1 mt-1 text-xs" id="cen-13"></div><button onClick={() => removeVideo(13)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button></div>

                            <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-13' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>
                        <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                            <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(14)}>
                                <FontAwesomeIcon className='mr-2' icon={faCamera} />
                            </button><div className="ml-1 mt-1 text-xs" id="cen-14"></div><button onClick={() => removeVideo(14)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button></div>

                            <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-14' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>
                        <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                            <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(15)}>
                                <FontAwesomeIcon className='mr-2' icon={faCamera} />
                            </button><div className="ml-1 mt-1 text-xs" id="cen-15"></div><button onClick={() => removeVideo(15)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button></div>

                            <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-15' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>
                        <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                            <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(16)}>
                                <FontAwesomeIcon className='mr-2' icon={faCamera} />
                            </button><div className="ml-1 mt-1 text-xs" id="cen-16"></div><button onClick={() => removeVideo(16)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button></div>

                            <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-16' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>

                        <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                            <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(17)}>
                                <FontAwesomeIcon className='mr-2' icon={faCamera} />
                            </button><div className="ml-1 mt-1 text-xs" id="cen-17"></div><button onClick={() => removeVideo(17)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button></div>

                            <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-17' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>
                        <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                            <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(18)}>
                                <FontAwesomeIcon className='mr-2' icon={faCamera} />
                            </button><div className="ml-1 mt-1 text-xs" id="cen-18"></div><button onClick={() => removeVideo(18)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button></div>

                            <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-18' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>
                        <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                            <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(19)}>
                                <FontAwesomeIcon className='mr-2' icon={faCamera} />
                            </button><div className="ml-1 mt-1 text-xs" id="cen-19"></div><button onClick={() => removeVideo(19)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button></div>

                            <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-19' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>



                        <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                            <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(20)}>
                                <FontAwesomeIcon className='mr-2' icon={faCamera} />
                            </button><div className="ml-1 mt-1 text-xs" id="cen-20"></div><button onClick={() => removeVideo(20)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button>
                            </div>
                            <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-20' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>
                        <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                            <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(21)}>
                                <FontAwesomeIcon className='mr-2' icon={faCamera} />
                            </button><div className="ml-1 mt-1 text-xs" id="cen-21"></div><button onClick={() => removeVideo(21)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button></div>
                            <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-21' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>
                        <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                            <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(22)}>
                                <FontAwesomeIcon className='mr-2' icon={faCamera} />
                            </button><div className="ml-1 mt-1 text-xs" id="cen-22"></div><button onClick={() => removeVideo(22)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button></div>

                            <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-22' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>
                        <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                            <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(23)}>
                                <FontAwesomeIcon className='mr-2' icon={faCamera} />
                            </button><div className="ml-1 mt-1 text-xs" id="cen-23"></div><button onClick={() => removeVideo(23)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button></div>

                            <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-23' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>
                        <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                            <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(24)}>
                                <FontAwesomeIcon className='mr-2' icon={faCamera} />
                            </button><div className="ml-1 mt-1 text-xs" id="cen-24"></div><button onClick={() => removeVideo(24)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button></div>

                            <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-24' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>
                        <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " hidden fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                            <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(25)}>
                                <FontAwesomeIcon className='mr-2' icon={faCamera} />
                            </button><div className="ml-1 mt-1 text-xs" id="cen-25"></div><button onClick={() => removeVideo(25)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button></div>

                            <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-25' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>
                        <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " hidden fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                            <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(26)}>
                                <FontAwesomeIcon className='mr-2' icon={faCamera} />
                            </button><div className="ml-1 mt-1 text-xs" id="cen-26"></div><button onClick={() => removeVideo(26)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button></div>

                            <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-26' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>

                        <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " hidden fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                            <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(27)}>
                                <FontAwesomeIcon className='mr-2' icon={faCamera} />
                            </button><div className="ml-1 mt-1 text-xs" id="cen-27"></div><button onClick={() => removeVideo(27)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button></div>

                            <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-27' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>
                        <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " hidden fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                            <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(28)}>
                                <FontAwesomeIcon className='mr-2' icon={faCamera} />
                            </button><div className="ml-1 mt-1 text-xs" id="cen-28"></div><button onClick={() => removeVideo(28)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button></div>

                            <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-28' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>
                        <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " hidden fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                            <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(29)}>
                                <FontAwesomeIcon className='mr-2' icon={faCamera} />
                            </button><div className="ml-1 mt-1 text-xs" id="cen-29"></div><button onClick={() => removeVideo(29)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button></div>

                            <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-29' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>




                        <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " hidden fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                            <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(30)}>
                                <FontAwesomeIcon className='mr-2' icon={faCamera} />
                            </button><div className="ml-1 mt-1 text-xs" id="cen-30"></div><button onClick={() => removeVideo(30)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button>
                            </div>
                            <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-30' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>
                        <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " hidden fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                            <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(31)}>
                                <FontAwesomeIcon className='mr-2' icon={faCamera} />
                            </button><div className="ml-1 mt-1 text-xs" id="cen-31"></div><button onClick={() => removeVideo(31)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button></div>
                            <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-31' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>
                        <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " hidden fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                            <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(32)}>
                                <FontAwesomeIcon className='mr-2' icon={faCamera} />
                            </button><div className="ml-1 mt-1 text-xs" id="cen-32"></div><button onClick={() => removeVideo(32)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button></div>

                            <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-32' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>
                        <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " hidden fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                            <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(33)}>
                                <FontAwesomeIcon className='mr-2' icon={faCamera} />
                            </button><div className="ml-1 mt-1 text-xs" id="cen-33"></div><button onClick={() => removeVideo(33)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button></div>

                            <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-33' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>
                        <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " hidden fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                            <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(34)}>
                                <FontAwesomeIcon className='mr-2' icon={faCamera} />
                            </button><div className="ml-1 mt-1 text-xs" id="cen-34"></div><button onClick={() => removeVideo(34)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button></div>

                            <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-34' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>
                        <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" : (grid == 2 ? " hidden fb-33" : (grid == 3 ? " hidden fb-25" : (grid == 4 ? " hidden fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                            <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><button className="ml-1 mt-1 text-xs" onClick={() => snapshot(35)}>
                                <FontAwesomeIcon className='mr-2' icon={faCamera} />
                            </button><div className="ml-1 mt-1 text-xs" id="cen-35"></div><button onClick={() => removeVideo(35)}>
                                    <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                                </button></div>

                            <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-35' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
                        </div>
                        <RotateModal showRotate={showRotate} setRotate={setRotate} onClose={handleRotateClose} />
                        <AddGroupModal cameraList={cameraList} show={showModal} onClose={handleOnClose} />
                        <SnapModal dataUrl={dataUrl} showSnap={showSnap} onClose={handleSnapClose} />
                        {/* <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-36"></div><button onClick={() => removeVideo(36)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-36' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>

            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-37"></div><button onClick={() => removeVideo(37)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-37' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-38"></div><button onClick={() => removeVideo(38)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-38' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-39"></div><button onClick={() => removeVideo(39)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-39' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>





            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-40"></div><button onClick={() => removeVideo(40)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button>
              </div>
              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-40' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-41"></div><button onClick={() => removeVideo(41)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>
              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-41' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-42"></div><button onClick={() => removeVideo(42)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-42' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-43"></div><button onClick={() => removeVideo(43)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-43' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-44"></div><button onClick={() => removeVideo(44)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-44' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-45"></div><button onClick={() => removeVideo(45)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-45' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-46"></div><button onClick={() => removeVideo(46)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-46' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>

            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-47"></div><button onClick={() => removeVideo(47)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-47' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-48"></div><button onClick={() => removeVideo(48)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-48' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-49"></div><button onClick={() => removeVideo(49)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-49' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>




            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-50"></div><button onClick={() => removeVideo(50)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button>
              </div>
              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-50' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-51"></div><button onClick={() => removeVideo(51)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>
              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-51' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-52"></div><button onClick={() => removeVideo(52)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-52' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-53"></div><button onClick={() => removeVideo(53)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-53' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-54"></div><button onClick={() => removeVideo(54)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-54' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-55"></div><button onClick={() => removeVideo(55)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-55' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-56"></div><button onClick={() => removeVideo(56)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-56' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>

            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-57"></div><button onClick={() => removeVideo(57)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-57' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-58"></div><button onClick={() => removeVideo(58)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-58' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-59"></div><button onClick={() => removeVideo(59)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-59' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>


            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-60"></div><button onClick={() => removeVideo(60)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button>
              </div>
              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-60' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-61"></div><button onClick={() => removeVideo(61)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>
              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-61' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-62"></div><button onClick={() => removeVideo(62)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-62' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-63"></div><button onClick={() => removeVideo(63)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-63' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-64"></div><button onClick={() => removeVideo(64)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-64' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-65"></div><button onClick={() => removeVideo(65)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-65' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-66"></div><button onClick={() => removeVideo(66)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-66' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>

            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-67"></div><button onClick={() => removeVideo(67)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-67' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-68"></div><button onClick={() => removeVideo(68)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-68' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-69"></div><button onClick={() => removeVideo(69)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-69' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>




            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-70"></div><button onClick={() => removeVideo(70)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button>
              </div>
              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-70' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-71"></div><button onClick={() => removeVideo(71)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>
              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-71' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-72"></div><button onClick={() => removeVideo(72)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-72' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-73"></div><button onClick={() => removeVideo(73)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-73' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-74"></div><button onClick={() => removeVideo(74)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-74' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-75"></div><button onClick={() => removeVideo(75)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-75' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-76"></div><button onClick={() => removeVideo(76)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-76' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>

            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-77"></div><button onClick={() => removeVideo(77)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-77' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-78"></div><button onClick={() => removeVideo(78)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-78' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-79"></div><button onClick={() => removeVideo(79)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-79' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>





            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-80"></div><button onClick={() => removeVideo(80)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button>
              </div>
              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-80' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-81"></div><button onClick={() => removeVideo(81)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>
              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-81' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-82"></div><button onClick={() => removeVideo(82)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-82' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-83"></div><button onClick={() => removeVideo(83)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-83' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-84"></div><button onClick={() => removeVideo(84)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-84' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-85"></div><button onClick={() => removeVideo(85)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-85' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-86"></div><button onClick={() => removeVideo(86)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-86' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>

            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-87"></div><button onClick={() => removeVideo(87)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-87' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-88"></div><button onClick={() => removeVideo(88)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-88' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-89"></div><button onClick={() => removeVideo(89)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-89' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>




            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-90"></div><button onClick={() => removeVideo(90)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button>
              </div>
              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-90' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-91"></div><button onClick={() => removeVideo(91)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>
              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-91' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-92"></div><button onClick={() => removeVideo(92)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-92' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-93"></div><button onClick={() => removeVideo(93)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-93' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-94"></div><button onClick={() => removeVideo(94)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-94' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-95"></div><button onClick={() => removeVideo(95)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-95' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-96"></div><button onClick={() => removeVideo(96)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-96' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>

            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-97"></div><button onClick={() => removeVideo(97)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-97' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-98"></div><button onClick={() => removeVideo(98)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-98' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div>
            <div className={"vid-div" + (grid == 0 ? " hidden fb-100 ml-20 mr-20 " : (grid == 1 ? " hidden fb-50" :(grid==2? " hidden fb-33":(grid==3?" hidden fb-25":(grid==4?" hidden fb-20":(grid==5?" hidden fb-16":(grid==6?" hidden fb-14":(grid==7?" hidden fb-12":(grid==8?" hidden fb-11":" fb-10")))))))))}>
              <div className={'remover flex justify-between w-full text-xs text-white bg-gray-900'}><div className="ml-1 mt-1 text-xs" id="cen-99"></div><button onClick={() => removeVideo(99)}>
                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
              </button></div>

              <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-99' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video>
            </div> */}

                    </div>
                </div>
            </div>
        </>
    );
}
