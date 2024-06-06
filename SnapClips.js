import React from "react";
import Navbar from "../Components/Navbar"
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { FaChevronDown, FaVideo } from "react-icons/fa";
import { faArrowLeft, faCamera, faCameraRetro, faImagePortrait, faImages, faVideoCamera } from "@fortawesome/free-solid-svg-icons";
export default function SnapClips() {
    const [isActive, setIsActive] = useState(false);
    const [expand, setExpand] = useState(-1)
    const [groups, setGroups] = useState([])
    const [snapshotActive, setSnapshotActive] = useState(false)
    const [clipsActive, setClipsActive] = useState(false)
    const [currentCam, setCurrentcam] = useState('')

    const apiUrl = localStorage.getItem('api')

    const nodeApi = localStorage.getItem('api_node')


    const handleClick = event => {
        // 👇️ toggle isActive state on click
        setIsActive(current => !current);
    };


    async function getCamerasList() {
        try {
            const groupData = await axios.get(apiUrl + 'camera_group_list/').catch((res) => {
                console.log(res)
            })
            setGroups(groupData.data)
            console.log(groupData.data)
            axios.get(nodeApi + 'Snapshots').then(res=>{
                console.log(res)
            }).catch(err=>console.log(err))
        }
        catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        getCamerasList();
    }, [])

    return (
        <>
            <Navbar />
            <div className="w-full justify-between text-left bg-gray-700">
                <button onClick={() => setIsActive(current => !current)} className="mt-1 mb-1 ml-2 text-white focus:ring-4 font-medium rounded-md text-sm px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800" type="button" data-drawer-target="drawer-navigation" data-drawer-show="drawer-navigation" aria-controls="drawer-navigation">
                    Select Cameras <FontAwesomeIcon className='ml-1' icon={faCamera} />
                </button>

                <button onClick={() => { setSnapshotActive(current => !current)}} className="mt-1 mb-1 ml-2 text-white focus:ring-4 font-medium rounded-md text-sm px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800" type="button" data-drawer-target="drawer-right" data-drawer-hide="drawer-right-2" data-drawer-show="drawer-right" data-drawer-placement="right" aria-controls="drawer-right">
                    Snapshots <FontAwesomeIcon className='ml-1' icon={faImages} />
                </button>
                <button onClick={() => { setClipsActive(current => !current) }} className="mt-1 mb-1 ml-2 text-white focus:ring-4 font-medium rounded-md text-sm px-2.5 py-1.5 mr-2 bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800" type="button" data-drawer-target="drawer-right-2" data-drawer-hide="drawer-right" data-drawer-show="drawer-right-2" data-drawer-placement="right" aria-controls="drawer-right-2">
                    Clips <FontAwesomeIcon className='ml-1' icon={faVideoCamera} />
                </button>

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

                                                <span className='flex'>
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
                                                        <li onClick={() => setExpand(index)} >
                                                            <a onClick={() => setExpand(index)} href="#" className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700">
                                                                <FaVideo />
                                                                <span onClick={(event) => { console.log(index); setCurrentcam(event.target.innerText) }} className="w-full ml-3">{device.device_name}</span>
                                                            </a>
                                                        </li>
                                                    )
                                                else
                                                    return
                                            }) : group.all_cameras.map(device => {
                                                if (device.device_name)
                                                    return (
                                                        <li onClick={() => setExpand(index)} >
                                                            <a onClick={() => setExpand(index)} href="#" className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700">
                                                                <FaVideo />
                                                                <span onClick={(event) => { console.log(index); setCurrentcam(event.target.innerText) }} className="w-full ml-3">{device.device_name}</span>
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
                    Snapshots</h2>

                <div className='left-12 flex flex-col'>
                    <div className="inline-flex items-center text-center mb-4 font-semibold text-gray-400">Selected Camera: {currentCam}</div>
                </div>
                <button onClick={() => { setSnapshotActive(current => !current) }} type="button" data-drawer-hide="drawer-right" aria-controls="drawer-right" className="text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center hover:bg-gray-600 hover:text-blue-500" >
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                    <span className="sr-only">Close menu</span>
                </button>
            </div>


            <div id="drawer-right-2" className="fixed top-12 right-0 z-40 w-64 h-screen p-4 overflow-y-auto transition-transform translate-x-full bg-gray-800" tabindex="-1" aria-labelledby="drawer-right-label-2">
                <h2 id="drawer-right-label-2" className="inline-flex items-center mb-4 font-semibold text-gray-400">
                    Clips</h2>

                <div className='left-12 flex flex-col'>
                    <div className="inline-flex items-center text-center mb-4 font-semibold text-gray-400">Selected Camera: {currentCam}</div>
                </div>
                <button onClick={() => { setClipsActive(current => !current) }} type="button" data-drawer-hide="drawer-right-2" aria-controls="drawer-right-2" className="text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center hover:bg-gray-600 hover:text-blue-500" >
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                    <span className="sr-only">Close menu</span>
                </button>
            </div>

        </>
    )
}