import React from "react";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
export default function Modal(props) {
    const apiUrl = localStorage.getItem('api')

    const [groupName, setGroupName] = useState("")
    const [equipData, setEquipData] = useState([])
    const [filteredList, setFilteredList] = useState([...props.cameraList]);
    const [map,setMap] = useState(new Map())
    const url = apiUrl+"camera_group_create/"
    useEffect(()=>{
        axios.get(apiUrl+"equipments/").then(res => {
            console.log("equip is " + res.data)
            setEquipData(res.data)
        }).catch(e=>{console.log(e)})
        axios.get(apiUrl+"camera_group_list/").then((res)=>{
            res.data.map(obj=>{
                if(obj["all_cameras_group"]){
                    obj["all_cameras"].map(cam=>{
                        // map.set(cam["device_name"],cam["group_name"])
                        setMap(map=>{
                            let temp = map
                            temp.set(cam["device_name"],cam["group_name"])
                            return temp
                        })
                        console.log("map is "+map.get(cam["device_name"]))
                    })
                }
            })
        }).catch(e=>{
            console.log(e)
        })
    },[])

    if (!props.show) {
        return null;
    } else {
        console.log("props = " + props.cameraList)
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
            axios.post(url, cameraData)
            for (let equip of equipData) {

                for (let camera of camerasList) {
                    if (equip.device_name == camera.value && camera.checked == true) {
                        console.log(equip)
                        equip["group_name"] = map.get(equip.device_name)
                        equip["group_name"].push(groupName)
                        console.log("sent is "+equip)
                        setTimeout(sendData(equip),100)
                        // axios.put("http://192.168.0.165:8000/equipments/", equip)
                    }
                }
            }


            props.onClose()


        }
        function sendData(equip){
            axios.put(apiUrl+"equipments/", equip).catch(e=>{console.log(e)})

        }

        return (
            <div className="modal">
                <div className="modal-content">
                    <h1 className="mt-12 text-lg font-bold">Add Group</h1>
                    <button className="modal-button" onClick={props.onClose}>
                        X
                    </button>
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
                                [...props.cameraList].map(camera => {
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
            </div>
        );
    }
}