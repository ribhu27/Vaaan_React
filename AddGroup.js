import React from "react";
import { useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import { useEffect } from "react";
export default function Modal() {
    const apiUrl = localStorage.getItem('api')
    const [groupName, setGroupName] = useState("")
    const [equipData, setEquipData] = useState([])
    const [cameraList, setCameraList] = useState([])
    const [groups,setGroups] = useState([])
    const [filteredList, setFilteredList] = useState([...cameraList]);
    async function getCamerasList() {
        // const data = await axios.get('http://127.0.0.1:8080/Recordings')
        try{

            const groupData = await axios.get(apiUrl+'camera_group_list/').catch(e=>{console.log(e)})
            setCameraList(() => {
              let retlist = []
              let list = groupData.data.map(group => {
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
            // setCameraList(cameraList => {
            //   return [...data.data]
            // })
            // console.log('hi')
            // console.log(cameraList)
        }catch(e){
            console.log(e)
        }
      }

        console.log("props = " + cameraList)
        const url = apiUrl+"camera_group_create/"
        // axios.get("http://192.168.0.15:8000/camera_group_list/").then(res=>{
        //     console.log(res.data)
        // })
        // setFilteredList([...props.cameraList])
        // const filterbyCamera = (event) => {
        //     const query = event.target.value;
        //     updatedList = [...props.cameraList]
        //     updatedList = updatedList.filter((item) => {
        //         if (item.toLowerCase().includes(query.toLowerCase()))
        //             return item;
        //     })
        //     setFilteredList(updatedList)
        // }
        function createGroup() {
            let cameraData = {}
            let camerasList = document.getElementsByClassName("group-checkbox")
            cameraData["group_name"] = groupName
            console.log(cameraData)
            axios.post(url, cameraData).catch(e=>{console.log(e)})
            for (let equip of equipData) {

                for (let camera of camerasList) {
                    if (equip.device_name == camera.value && camera.checked == true) {
                        equip["group_name"] = groupName
                        axios.put(apiUrl+"equipments/", equip).catch(e=>{console.log(e)})
                    }
                }
            }
            
        }
        useEffect(()=>{
            getCamerasList()
            axios.get(apiUrl+"equipments/").then(res => {
                console.log("equip is " + res.data)
                setEquipData(res.data)
            }).catch(e=>{console.log(e)})
        },[])

        return (
            <>
            <Navbar/>
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Add Group
                    </h1>

                </div>
            </header>
            <div className="ml-36">
                    <div className="modal-body mt-0">
                        {/* <div className="items-center videoContainer">
              
            </div> */}
                        <div className="font-semibold items-center mt-12">Group Name :
                            <input className="w-96 ml-4 border border-gray-900 rounded-md mb-8" type="text" value={groupName} onChange={(e) => { setGroupName(e.target.value) }} />
                        </div>
                        {/* <div className='mx-auto max-w-7xl sm:px-6 lg:px-8 search-div'>
                <span id='search-span'>Search: </span>
                <input type="text" id="camera-search" name="camera-search" onChange={(e) => filterbyCamera(e)} />
            </div> */}
                        <div className="flex flex-wrap py-4 ">
                            {/* <ul className="flex flex-wrap space-y-2 font-medium mt-2"> */}
                            {
                                cameraList.map(camera => {
                                    return (
                                        //   <li className="fb-12 text-xs">
                                        <label className="fb-12 mt-4 mr-4 text-xs">
                                            <input type="checkbox" name={camera} value={camera} className="group-checkbox ml-3" />
                                            {" " + camera}
                                        </label>
                                        //   </li>
                                        )
                                    })
                                }
                            {/* </ul> */}
                        </div>

                    </div >

                    <button onClick={createGroup} className="text-white rounded-sm bg-green-500 p-2 ml-auto mr-8">Create Group</button>

                                </div>
                </>
        );
}