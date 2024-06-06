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
import AddGroupModal from './AddGroupModal'
import RotateModal from './RotateModal'
import SnapModal from './SnapModal';
import { loadPlayer } from 'rtsp-relay/browser';

export default function NewLiveStream() {


    const interval = useRef()
    const [expand, setExpand] = useState(-1)
    const [customRotate, setCustomRotate] = useState(false)
    const [cameraList, setCameraList] = useState([])
    const [rotateList, setRotateList] = useState([])
    const [dataUrl, setDataUrl] = useState("")
    const [grid, setGrid] = useState(0)
    const [groups, setGroups] = useState([])
    const [isActive, setIsActive] = useState(false);
    const [videoCount, setVideoCount] = useState(0);
    const [rotate, setRotate] = useState(0)
    const [showRotate, setShowRotateModal] = useState(false)
    const [showSnap, setShowSnap] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [canvasArr, setCanvasArr] = useState([{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]);
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
        const groupData = await axios.get('http://192.168.0.15:8000/camera_group_list/')
        setGroups(groupData.data)

    }
    function handleAddGroup() {
        setShowModal(true)
    }
    function removeAll() {

    }
    const handleClick = event => {
        // 👇️ toggle isActive state on click
        setIsActive(current => !current);
    };
    function dragStartHandleGroup() {

    }
    function playGroup() {

    }
    function dragStartHandle() {

    }
    function addVideo() {

    }
    function snapshot() {

    }
    function removeVideo() {

    }



    async function getCamerasList() {
        const groupData = await axios.get('http://192.168.0.15:8000/camera_group_list/')
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
        setGroups(groupData.data)
        console.log(groupData.data)
    }

    async function startPlay(url,canvas){
        const player = await loadPlayer({
            url: url,
            canvas: canvas,
            // videoBufferSize: 10*1024*1024,
            
            // disableWebAssembly : true,
            // disableGl: true,
            pauseWhenHidden:false,
            onPause: function(){
                // player.source.abort()
                player.destroy()
                
            }
        });
        setCanvasArr((canvasArr) => {
            let tempArr = canvasArr;
            tempArr[videoCount] = {
              'player':player
            }
            return tempArr;
          })
    }


    async function clickAddVideo(device) {
        try{

            setRotateList(rotateList => {
                const temp = [...rotateList]
                temp.push(device.device_name)
                return temp
            })
            sessionStorage.setItem('canvas-' + parseInt(videoCount), device.device_name)
            document.getElementById('cen-' + videoCount).innerText = device.device_name
            if(vidLoadArr[videoCount]){
                if(canvasArr[videoCount].player){
                    canvasArr[videoCount].player.pause()
                    // canvasArr[0].player.source.abort()
                }
                if(!document.getElementById('canvas-'+videoCount)){
                    console.log('created')
                    const canv = document.createElement('canvas')
                    canv.classList.add('vid')
                    canv.id = 'canvas-'+videoCount
                    document.getElementById('div-'+videoCount).appendChild(canv)
                }
                
            }
    
            const canvas = document.getElementById('canvas-'+videoCount)
            const urls = 'ws://localhost:2000/api/stream/'+device.username+':'+device.password+'@'+device.ip_address.split(':')[0]
            console.log('url - '+urls)
            startPlay(urls,canvas)
            setVidLoadArr(vidLoadArr => {
                let tempArr = vidLoadArr;
                tempArr[videoCount] = true;
                return tempArr
              })
        }catch(e){
            console.log(e)
        }
        setVideoCount((videoCount + 1) % ((grid + 1) * (grid + 1)))


    }



    useEffect(() => {
        getCamerasList();
        // const canvas = document.getElementById('rtspcanvas');
        // loadPlayer({
        //     url: 'ws://localhost:2000/api/stream/',
        //     canvas: canvas,
        // });
    }, []);

    return (<>
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
                        <li>

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
                                                            <span onClick={(event) => { console.log(index); clickAddVideo(device) }} className="w-full ml-3">{device.device_name}</span>
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
                                                            <span onClick={(event) => { console.log(index); clickAddVideo(device) }} className="w-full ml-3">{device.device_name}</span>
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



        <div id="vid-box" className={"mt-10 p-2 h-full" + (isActive ? " sm:ml-64" : " sm:ml-4")}>
            <div className="rounded-lg border-gray-700">

                <div className={"flexing gap-1"}>
                    <div id='div-0' className={"vid-div" + (grid == 0 ? " fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                        <div className={'remover flex justify-between h-min w-full text-xs text-white bg-gray-900'}>
                            <button className="ml-1 mt-1 text-xs" onClick={() => snapshot(0)}>
                            <FontAwesomeIcon className='mr-2' icon={faCamera} />
                        </button>
                            <div className="ml-1 mt-1 text-xs" id="cen-0"></div><button onClick={() => removeVideo(0)}>
                                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                            </button>
                        </div>
                        {/* <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-0' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video> */}
                        <canvas className='vid' id='canvas-0' />
                    </div>
                    <div id='div-1' className={"vid-div" + (grid == 0 ? " fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                        <div className={'remover flex justify-between h-min w-full text-xs text-white bg-gray-900'}>
                            <button className="ml-1 mt-1 text-xs" onClick={() => snapshot(1)}>
                            <FontAwesomeIcon className='mr-2' icon={faCamera} />
                        </button>
                            <div className="ml-1 mt-1 text-xs" id="cen-1"></div><button onClick={() => removeVideo(1)}>
                                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                            </button>
                        </div>
                        {/* <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-0' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video> */}
                        <canvas className='vid' id='canvas-1' />
                    </div>
                    <div id='div-2' className={"vid-div" + (grid == 0 ? " fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                        <div className={'remover flex justify-between h-min w-full text-xs text-white bg-gray-900'}>
                            <button className="ml-1 mt-1 text-xs" onClick={() => snapshot(2)}>
                            <FontAwesomeIcon className='mr-2' icon={faCamera} />
                        </button>
                            <div className="ml-1 mt-1 text-xs" id="cen-2"></div><button onClick={() => removeVideo(2)}>
                                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                            </button>
                        </div>
                        {/* <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-0' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video> */}
                        <canvas className='vid' id='canvas-2' />
                    </div>
                    <div id='div-3' className={"vid-div" + (grid == 0 ? " fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                        <div className={'remover flex justify-between h-min w-full text-xs text-white bg-gray-900'}>
                            <button className="ml-1 mt-1 text-xs" onClick={() => snapshot(3)}>
                            <FontAwesomeIcon className='mr-2' icon={faCamera} />
                        </button>
                            <div className="ml-1 mt-1 text-xs" id="cen-3"></div><button onClick={() => removeVideo(3)}>
                                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                            </button>
                        </div>
                        {/* <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-0' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video> */}
                        <canvas className='vid' id='canvas-3' />
                    </div>
                    <div id='div-4' className={"vid-div" + (grid == 0 ? " fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                        <div className={'remover flex justify-between h-min w-full text-xs text-white bg-gray-900'}>
                            <button className="ml-1 mt-1 text-xs" onClick={() => snapshot(4)}>
                            <FontAwesomeIcon className='mr-2' icon={faCamera} />
                        </button>
                            <div className="ml-1 mt-1 text-xs" id="cen-4"></div><button onClick={() => removeVideo(4)}>
                                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                            </button>
                        </div>
                        {/* <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-0' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video> */}
                        <canvas className='vid' id='canvas-4' />
                    </div>
                    <div id='div-5' className={"vid-div" + (grid == 0 ? " fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                        <div className={'remover flex justify-between h-min w-full text-xs text-white bg-gray-900'}>
                            <button className="ml-1 mt-1 text-xs" onClick={() => snapshot(5)}>
                            <FontAwesomeIcon className='mr-2' icon={faCamera} />
                        </button>
                            <div className="ml-1 mt-1 text-xs" id="cen-5"></div><button onClick={() => removeVideo(5)}>
                                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                            </button>
                        </div>
                        {/* <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-0' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video> */}
                        <canvas className='vid' id='canvas-5' />
                    </div>
                    <div id='div-6' className={"vid-div" + (grid == 0 ? " fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                        <div className={'remover flex justify-between h-min w-full text-xs text-white bg-gray-900'}>
                            <button className="ml-1 mt-1 text-xs" onClick={() => snapshot(6)}>
                            <FontAwesomeIcon className='mr-2' icon={faCamera} />
                        </button>
                            <div className="ml-1 mt-1 text-xs" id="cen-6"></div><button onClick={() => removeVideo(6)}>
                                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                            </button>
                        </div>
                        {/* <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-0' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video> */}
                        <canvas className='vid' id='canvas-6' />
                    </div>
                    <div id='div-7' className={"vid-div" + (grid == 0 ? " fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                        <div className={'remover flex justify-between h-min w-full text-xs text-white bg-gray-900'}>
                            <button className="ml-1 mt-1 text-xs" onClick={() => snapshot(7)}>
                            <FontAwesomeIcon className='mr-2' icon={faCamera} />
                        </button>
                            <div className="ml-1 mt-1 text-xs" id="cen-7"></div><button onClick={() => removeVideo(7)}>
                                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                            </button>
                        </div>
                        {/* <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-0' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video> */}
                        <canvas className='vid' id='canvas-7' />
                    </div>
                    <div id='div-8' className={"vid-div" + (grid == 0 ? " fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                        <div className={'remover flex justify-between h-min w-full text-xs text-white bg-gray-900'}>
                            <button className="ml-1 mt-1 text-xs" onClick={() => snapshot(8)}>
                            <FontAwesomeIcon className='mr-2' icon={faCamera} />
                        </button>
                            <div className="ml-1 mt-1 text-xs" id="cen-8"></div><button onClick={() => removeVideo(8)}>
                                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                            </button>
                        </div>
                        {/* <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-0' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video> */}
                        <canvas className='vid' id='canvas-8' />
                    </div>
                    <div id='div-9' className={"vid-div" + (grid == 0 ? " fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                        <div className={'remover flex justify-between h-min w-full text-xs text-white bg-gray-900'}>
                            <button className="ml-1 mt-1 text-xs" onClick={() => snapshot(9)}>
                            <FontAwesomeIcon className='mr-2' icon={faCamera} />
                        </button>
                            <div className="ml-1 mt-1 text-xs" id="cen-9"></div><button onClick={() => removeVideo(9)}>
                                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                            </button>
                        </div>
                        {/* <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-0' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video> */}
                        <canvas className='vid' id='canvas-9' />
                    </div>

                    <div id='div-10' className={"vid-div" + (grid == 0 ? " fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                        <div className={'remover flex justify-between h-min w-full text-xs text-white bg-gray-900'}>
                            <button className="ml-1 mt-1 text-xs" onClick={() => snapshot(10)}>
                            <FontAwesomeIcon className='mr-2' icon={faCamera} />
                        </button>
                            <div className="ml-1 mt-1 text-xs" id="cen-10"></div><button onClick={() => removeVideo(10)}>
                                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                            </button>
                        </div>
                        {/* <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-0' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video> */}
                        <canvas className='vid' id='canvas-10' />
                    </div>
                    <div id='div-11' className={"vid-div" + (grid == 0 ? " fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                        <div className={'remover flex justify-between h-min w-full text-xs text-white bg-gray-900'}>
                            <button className="ml-1 mt-1 text-xs" onClick={() => snapshot(11)}>
                            <FontAwesomeIcon className='mr-2' icon={faCamera} />
                        </button>
                            <div className="ml-1 mt-1 text-xs" id="cen-11"></div><button onClick={() => removeVideo(11)}>
                                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                            </button>
                        </div>
                        {/* <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-0' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video> */}
                        <canvas className='vid' id='canvas-11' />
                    </div>
                    <div id='div-12' className={"vid-div" + (grid == 0 ? " fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                        <div className={'remover flex justify-between h-min w-full text-xs text-white bg-gray-900'}>
                            <button className="ml-1 mt-1 text-xs" onClick={() => snapshot(12)}>
                            <FontAwesomeIcon className='mr-2' icon={faCamera} />
                        </button>
                            <div className="ml-1 mt-1 text-xs" id="cen-12"></div><button onClick={() => removeVideo(12)}>
                                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                            </button>
                        </div>
                        {/* <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-0' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video> */}
                        <canvas className='vid' id='canvas-12' />
                    </div>
                    <div id='div-13' className={"vid-div" + (grid == 0 ? " fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                        <div className={'remover flex justify-between h-min w-full text-xs text-white bg-gray-900'}>
                            <button className="ml-1 mt-1 text-xs" onClick={() => snapshot(13)}>
                            <FontAwesomeIcon className='mr-2' icon={faCamera} />
                        </button>
                            <div className="ml-1 mt-1 text-xs" id="cen-13"></div><button onClick={() => removeVideo(13)}>
                                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                            </button>
                        </div>
                        {/* <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-0' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video> */}
                        <canvas className='vid' id='canvas-13' />
                    </div>
                    <div id='div-14' className={"vid-div" + (grid == 0 ? " fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                        <div className={'remover flex justify-between h-min w-full text-xs text-white bg-gray-900'}>
                            <button className="ml-1 mt-1 text-xs" onClick={() => snapshot(14)}>
                            <FontAwesomeIcon className='mr-2' icon={faCamera} />
                        </button>
                            <div className="ml-1 mt-1 text-xs" id="cen-14"></div><button onClick={() => removeVideo(14)}>
                                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                            </button>
                        </div>
                        {/* <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-0' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video> */}
                        <canvas className='vid' id='canvas-14' />
                    </div>
                    <div id='div-15' className={"vid-div" + (grid == 0 ? " fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                        <div className={'remover flex justify-between h-min w-full text-xs text-white bg-gray-900'}>
                            <button className="ml-1 mt-1 text-xs" onClick={() => snapshot(15)}>
                            <FontAwesomeIcon className='mr-2' icon={faCamera} />
                        </button>
                            <div className="ml-1 mt-1 text-xs" id="cen-15"></div><button onClick={() => removeVideo(15)}>
                                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                            </button>
                        </div>
                        {/* <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-0' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video> */}
                        <canvas className='vid' id='canvas-15' />
                    </div>
                    <div id='div-16' className={"vid-div" + (grid == 0 ? " fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                        <div className={'remover flex justify-between h-min w-full text-xs text-white bg-gray-900'}>
                            <button className="ml-1 mt-1 text-xs" onClick={() => snapshot(16)}>
                            <FontAwesomeIcon className='mr-2' icon={faCamera} />
                        </button>
                            <div className="ml-1 mt-1 text-xs" id="cen-16"></div><button onClick={() => removeVideo(16)}>
                                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                            </button>
                        </div>
                        {/* <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-0' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video> */}
                        <canvas className='vid' id='canvas-16' />
                    </div>
                    <div id='div-17' className={"vid-div" + (grid == 0 ? " fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                        <div className={'remover flex justify-between h-min w-full text-xs text-white bg-gray-900'}>
                            <button className="ml-1 mt-1 text-xs" onClick={() => snapshot(17)}>
                            <FontAwesomeIcon className='mr-2' icon={faCamera} />
                        </button>
                            <div className="ml-1 mt-1 text-xs" id="cen-17"></div><button onClick={() => removeVideo(17)}>
                                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                            </button>
                        </div>
                        {/* <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-0' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video> */}
                        <canvas className='vid' id='canvas-17' />
                    </div>
                    <div id='div-18' className={"vid-div" + (grid == 0 ? " fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                        <div className={'remover flex justify-between h-min w-full text-xs text-white bg-gray-900'}>
                            <button className="ml-1 mt-1 text-xs" onClick={() => snapshot(18)}>
                            <FontAwesomeIcon className='mr-2' icon={faCamera} />
                        </button>
                            <div className="ml-1 mt-1 text-xs" id="cen-18"></div><button onClick={() => removeVideo(18)}>
                                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                            </button>
                        </div>
                        {/* <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-0' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video> */}
                        <canvas className='vid' id='canvas-18' />
                    </div>
                    <div id='div-19' className={"vid-div" + (grid == 0 ? " fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                        <div className={'remover flex justify-between h-min w-full text-xs text-white bg-gray-900'}>
                            <button className="ml-1 mt-1 text-xs" onClick={() => snapshot(19)}>
                            <FontAwesomeIcon className='mr-2' icon={faCamera} />
                        </button>
                            <div className="ml-1 mt-1 text-xs" id="cen-19"></div><button onClick={() => removeVideo(19)}>
                                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                            </button>
                        </div>
                        {/* <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-0' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video> */}
                        <canvas className='vid' id='canvas-19' />
                    </div>

                    <div id='div-20' className={"vid-div" + (grid == 0 ? " fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                        <div className={'remover flex justify-between h-min w-full text-xs text-white bg-gray-900'}>
                            <button className="ml-1 mt-1 text-xs" onClick={() => snapshot(20)}>
                            <FontAwesomeIcon className='mr-2' icon={faCamera} />
                        </button>
                            <div className="ml-1 mt-1 text-xs" id="cen-20"></div><button onClick={() => removeVideo(20)}>
                                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                            </button>
                        </div>
                        {/* <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-0' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video> */}
                        <canvas className='vid' id='canvas-20' />
                    </div>
                    <div id='div-21' className={"vid-div" + (grid == 0 ? " fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                        <div className={'remover flex justify-between h-min w-full text-xs text-white bg-gray-900'}>
                            <button className="ml-1 mt-1 text-xs" onClick={() => snapshot(21)}>
                            <FontAwesomeIcon className='mr-2' icon={faCamera} />
                        </button>
                            <div className="ml-1 mt-1 text-xs" id="cen-21"></div><button onClick={() => removeVideo(21)}>
                                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                            </button>
                        </div>
                        {/* <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-0' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video> */}
                        <canvas className='vid' id='canvas-21' />
                    </div>
                    <div id='div-22' className={"vid-div" + (grid == 0 ? " fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                        <div className={'remover flex justify-between h-min w-full text-xs text-white bg-gray-900'}>
                            <button className="ml-1 mt-1 text-xs" onClick={() => snapshot(22)}>
                            <FontAwesomeIcon className='mr-2' icon={faCamera} />
                        </button>
                            <div className="ml-1 mt-1 text-xs" id="cen-22"></div><button onClick={() => removeVideo(22)}>
                                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                            </button>
                        </div>
                        {/* <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-0' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video> */}
                        <canvas className='vid' id='canvas-22' />
                    </div>
                    <div id='div-23' className={"vid-div" + (grid == 0 ? " fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                        <div className={'remover flex justify-between h-min w-full text-xs text-white bg-gray-900'}>
                            <button className="ml-1 mt-1 text-xs" onClick={() => snapshot(23)}>
                            <FontAwesomeIcon className='mr-2' icon={faCamera} />
                        </button>
                            <div className="ml-1 mt-1 text-xs" id="cen-23"></div><button onClick={() => removeVideo(23)}>
                                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                            </button>
                        </div>
                        {/* <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-0' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video> */}
                        <canvas className='vid' id='canvas-23' />
                    </div>
                    <div id='div-24' className={"vid-div" + (grid == 0 ? " fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                        <div className={'remover flex justify-between h-min w-full text-xs text-white bg-gray-900'}>
                            <button className="ml-1 mt-1 text-xs" onClick={() => snapshot(24)}>
                            <FontAwesomeIcon className='mr-2' icon={faCamera} />
                        </button>
                            <div className="ml-1 mt-1 text-xs" id="cen-24"></div><button onClick={() => removeVideo(24)}>
                                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                            </button>
                        </div>
                        {/* <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-0' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video> */}
                        <canvas className='vid' id='canvas-24' />
                    </div>
                    <div id='div-25' className={"vid-div" + (grid == 0 ? " fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                        <div className={'remover flex justify-between h-min w-full text-xs text-white bg-gray-900'}>
                            <button className="ml-1 mt-1 text-xs" onClick={() => snapshot(25)}>
                            <FontAwesomeIcon className='mr-2' icon={faCamera} />
                        </button>
                            <div className="ml-1 mt-1 text-xs" id="cen-25"></div><button onClick={() => removeVideo(25)}>
                                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                            </button>
                        </div>
                        {/* <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-0' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video> */}
                        <canvas className='vid' id='canvas-25' />
                    </div>
                    <div id='div-26' className={"vid-div" + (grid == 0 ? " fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                        <div className={'remover flex justify-between h-min w-full text-xs text-white bg-gray-900'}>
                            <button className="ml-1 mt-1 text-xs" onClick={() => snapshot(26)}>
                            <FontAwesomeIcon className='mr-2' icon={faCamera} />
                        </button>
                            <div className="ml-1 mt-1 text-xs" id="cen-26"></div><button onClick={() => removeVideo(26)}>
                                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                            </button>
                        </div>
                        {/* <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-0' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video> */}
                        <canvas className='vid' id='canvas-26' />
                    </div>
                    <div id='div-27' className={"vid-div" + (grid == 0 ? " fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                        <div className={'remover flex justify-between h-min w-full text-xs text-white bg-gray-900'}>
                            <button className="ml-1 mt-1 text-xs" onClick={() => snapshot(27)}>
                            <FontAwesomeIcon className='mr-2' icon={faCamera} />
                        </button>
                            <div className="ml-1 mt-1 text-xs" id="cen-27"></div><button onClick={() => removeVideo(27)}>
                                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                            </button>
                        </div>
                        {/* <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-0' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video> */}
                        <canvas className='vid' id='canvas-27' />
                    </div>
                    <div id='div-28' className={"vid-div" + (grid == 0 ? " fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                        <div className={'remover flex justify-between h-min w-full text-xs text-white bg-gray-900'}>
                            <button className="ml-1 mt-1 text-xs" onClick={() => snapshot(28)}>
                            <FontAwesomeIcon className='mr-2' icon={faCamera} />
                        </button>
                            <div className="ml-1 mt-1 text-xs" id="cen-28"></div><button onClick={() => removeVideo(28)}>
                                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                            </button>
                        </div>
                        {/* <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-0' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video> */}
                        <canvas className='vid' id='canvas-28' />
                    </div>
                    <div id='div-29' className={"vid-div" + (grid == 0 ? " fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                        <div className={'remover flex justify-between h-min w-full text-xs text-white bg-gray-900'}>
                            <button className="ml-1 mt-1 text-xs" onClick={() => snapshot(29)}>
                            <FontAwesomeIcon className='mr-2' icon={faCamera} />
                        </button>
                            <div className="ml-1 mt-1 text-xs" id="cen-29"></div><button onClick={() => removeVideo(29)}>
                                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                            </button>
                        </div>
                        {/* <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-0' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video> */}
                        <canvas className='vid' id='canvas-29' />
                    </div>


                    
                    <div id='div-30' className={"vid-div" + (grid == 0 ? " fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                        <div className={'remover flex justify-between h-min w-full text-xs text-white bg-gray-900'}>
                            <button className="ml-1 mt-1 text-xs" onClick={() => snapshot(30)}>
                            <FontAwesomeIcon className='mr-2' icon={faCamera} />
                        </button>
                            <div className="ml-1 mt-1 text-xs" id="cen-30"></div><button onClick={() => removeVideo(30)}>
                                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                            </button>
                        </div>
                        {/* <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-0' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video> */}
                        <canvas className='vid' id='canvas-30' />
                    </div>
                    <div id='div-31' className={"vid-div" + (grid == 0 ? " fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                        <div className={'remover flex justify-between h-min w-full text-xs text-white bg-gray-900'}>
                            <button className="ml-1 mt-1 text-xs" onClick={() => snapshot(31)}>
                            <FontAwesomeIcon className='mr-2' icon={faCamera} />
                        </button>
                            <div className="ml-1 mt-1 text-xs" id="cen-31"></div><button onClick={() => removeVideo(31)}>
                                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                            </button>
                        </div>
                        {/* <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-0' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video> */}
                        <canvas className='vid' id='canvas-31' />
                    </div>
                    <div id='div-32' className={"vid-div" + (grid == 0 ? " fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                        <div className={'remover flex justify-between h-min w-full text-xs text-white bg-gray-900'}>
                            <button className="ml-1 mt-1 text-xs" onClick={() => snapshot(32)}>
                            <FontAwesomeIcon className='mr-2' icon={faCamera} />
                        </button>
                            <div className="ml-1 mt-1 text-xs" id="cen-32"></div><button onClick={() => removeVideo(32)}>
                                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                            </button>
                        </div>
                        {/* <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-0' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video> */}
                        <canvas className='vid' id='canvas-32' />
                    </div>
                    <div id='div-33' className={"vid-div" + (grid == 0 ? " fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                        <div className={'remover flex justify-between h-min w-full text-xs text-white bg-gray-900'}>
                            <button className="ml-1 mt-1 text-xs" onClick={() => snapshot(33)}>
                            <FontAwesomeIcon className='mr-2' icon={faCamera} />
                        </button>
                            <div className="ml-1 mt-1 text-xs" id="cen-33"></div><button onClick={() => removeVideo(33)}>
                                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                            </button>
                        </div>
                        {/* <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-0' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video> */}
                        <canvas className='vid' id='canvas-33' />
                    </div>
                    <div id='div-34' className={"vid-div" + (grid == 0 ? " fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                        <div className={'remover flex justify-between h-min w-full text-xs text-white bg-gray-900'}>
                            <button className="ml-1 mt-1 text-xs" onClick={() => snapshot(34)}>
                            <FontAwesomeIcon className='mr-2' icon={faCamera} />
                        </button>
                            <div className="ml-1 mt-1 text-xs" id="cen-34"></div><button onClick={() => removeVideo(34)}>
                                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                            </button>
                        </div>
                        {/* <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-0' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video> */}
                        <canvas className='vid' id='canvas-34' />
                    </div>
                    <div id='div-35' className={"vid-div" + (grid == 0 ? " fb-100 ml-20 mr-20 " : (grid == 1 ? " fb-50" : (grid == 2 ? " fb-33" : (grid == 3 ? " fb-25" : (grid == 4 ? " fb-20" : (grid == 5 ? " fb-16" : (grid == 6 ? " fb-14" : (grid == 7 ? " fb-12" : (grid == 8 ? " fb-11" : " fb-10")))))))))}>
                        <div className={'remover flex justify-between h-min w-full text-xs text-white bg-gray-900'}>
                            <button className="ml-1 mt-1 text-xs" onClick={() => snapshot(35)}>
                            <FontAwesomeIcon className='mr-2' icon={faCamera} />
                        </button>
                            <div className="ml-1 mt-1 text-xs" id="cen-35"></div><button onClick={() => removeVideo(35)}>
                                <FontAwesomeIcon className='mr-2' icon={faRectangleXmark} />
                            </button>
                        </div>
                        {/* <video controls draggable="true" onDragStart={(ev) => dragStartHandleVideo(ev)} onDragOver={(ev) => dragOverHandler(ev)} onDrop={(ev) => { dropHandler(ev) }} autoPlay id='hls-0' poster={process.env.PUBLIC_URL + 'vid-load.png'} className='vid'></video> */}
                        <canvas className='vid' id='canvas-35' />
                    </div>
1


                </div>
            </div>
        </div>



    </>

    )
}