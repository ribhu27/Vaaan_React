import React from "react"
import Navbar from "../Components/Navbar"
import { useState } from "react"
import axios from "axios";
export default function AddCamera() {
    const apiUrl = localStorage.getItem('api')
    const nodeApi = localStorage.getItem('api_node')


    const url = apiUrl+'equipments/';


  // use state variable to store new user information 
  const [cameraName, setCamera] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [camIP, setCamIP] = useState('');
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [device_category, setDeviceCategory] = useState('CAMERA');
  const [project, setProject] = useState('VIDS');
  const [storage_days, setStorage] = useState('');

  


function sendCamera(e){
    e.preventDefault()
    const data = {
        "device_name":cameraName,
        "username":username,
        "password":password,
        "ip_address":camIP,
        "latitude":latitude,
        "longitude":longitude,
        "device_category":device_category,
        "project":project,
        "storage_days":storage_days,
    }
    console.log(data)
    if(cameraName.includes(" ")){
        alert("Device Name Must not contain spaces")
        return
    }
    axios.post(url,data).then((response)=>{
        console.log(response)
        alert(response.data.message)
        if(response.data.message == "Camera added successfully"){
            axios.post(nodeApi+'cameraAdded',{ data: data }).then((res)=>{
                console.log(res)
            })
            //send node a post request of the same camera
        }
    }).catch(err=>{
        // alert(err.message)
        console.log(err)
    })
}

    const [recordImmendiate, setRecordImmediate] = useState(true)

    function handleRecordImmmediate() {
        setRecordImmediate(!recordImmendiate)
    }

    return (
        <>
            <Navbar />
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Add Camera</h1>
                </div>
            </header>
            <main>
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                    <div className="c">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Camera Information</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">Enter Details of your Camera</p>

                        <div>
                        <form className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6" onSubmit={(e)=>sendCamera(e)}>
                            <div className="sm:col-span-3">
                                <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                                    Device name
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="first-name"
                                        value={cameraName}
                                        onChange={(e)=>{setCamera(e.target.value)
                                        }}
                                        id="first-name"
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                                   Onvif User name
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="last-name"
                                        id="last-name"
                                        value={username}
                                        onChange={(e)=>{setusername(e.target.value)}}
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                </div>
                            </div>
                            <div className="col-span-full">
                                <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-gray-900">
                                   Onvif Password
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="street-address"
                                        id="street-address"
                                        value={password}
                                        required
                                        onChange={(e)=>{setPassword(e.target.value)}}
                                        autoComplete="street-address"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                </div>
                            </div>
                            <div className="sm:col-span-4">
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                    IP Link
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="ip_address"
                                        name="ip_address"
                                        type="text"
                                        value={camIP}
                                        onChange={(e)=>{setCamIP(e.target.value)}}
                                        required
                                        autoComplete="IP"
                                        className="block w-4/6 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                                    Storage Days
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="first-name"
                                        value={storage_days}
                                        required
                                        onChange={(e)=>{setStorage(e.target.value)}}
                                        id="first-name"
                                        autoComplete="given-name"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="latitude" className="block text-sm font-medium leading-6 text-gray-900">
                                    Latitude
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="number"
                                        name="latitude"
                                        id="latitude"
                                        required
                                        value={latitude}
                                        onChange={(e)=>{setLatitude(e.target.value)}}
                                        autoComplete="family-name"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="longitude" className="block text-sm font-medium leading-6 text-gray-900">
                                    Longitude
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="number"
                                        name="Longitude"
                                        id="longitude"
                                        value={longitude}
                                        required
                                        onChange={(e)=>{setLongitude(e.target.value)}}
                                        autoComplete="family-name"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="project" className="block text-sm font-medium leading-6 text-gray-900">
                                    Device Category
                                </label>
                                <div className="mt-2">
                                    <select
                                        id="device_category"
                                        name="device_category"
                                        value={device_category}
                                        onChange={(e)=>{setDeviceCategory(e.target.value)}}
                                        autoComplete="country-name"
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                        >
                                        <option>CAMERA</option>
                                    </select>
                                </div>
                            </div>

                            <div hidden className="sm:col-span-3">
                                <label htmlFor="project" className="block text-sm font-medium leading-6 text-gray-900">
                                    Project
                                </label>
                                <div className="mt-2">
                                    <select
                                        id="project"
                                        name="project"
                                        value={project}
                                        onChange={(e)=>{setProject(e.target.value)}}
                                        autoComplete="country-name"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                        >
                                        {/* <option>VIDS</option> */}
                                        <option>VIDS</option>
                                        <option>NMS</option>
                                    </select>
                                </div>
                            </div>


                            <div hidden className="sm:col-span-3">
                                <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                                    Link Type
                                </label>
                                <div className="mt-2">
                                    <select
                                        id="country"
                                        name="country"
                                        autoComplete="country-name"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                        >
                                        <option>RTSP</option>
                                        <option>RTMP</option>
                                        <option>HLS</option>
                                    </select>
                                </div>
                            </div>


                            <div className="sm:col-span-2 sm:col-start-1">
                                <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                                    City
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="city"
                                        id="city"
                                        autoComplete="address-level2"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="region" className="block text-sm font-medium leading-6 text-gray-900">
                                    State / Province
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="region"
                                        id="region"
                                        autoComplete="address-level1"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-gray-900">
                                    ZIP / Postal code
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="postal-code"
                                        id="postal-code"
                                        autoComplete="postal-code"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                </div>
                            </div>
                            {/* <div className="sm:col-span-2" onClick={()=>handleRecordImmmediate()}> */}
                            <div className="sm:col-span-2">


                                <div className="flex flex-col">
                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                    Recording
                                </label>
                                    {recordImmendiate ?
                                        <label htmlFor="Don't start Recording" className="mt-3 inline-flex items-center cursor-pointer">
                                            <span className="relative">
                                                <span className="block w-10 h-6 bg-gray-400 rounded-full shadow-inner"></span>
                                                <span className="absolute block w-4 h-4 mt-1 ml-1 bg-white rounded-full shadow inset-y-0 left-0 focus-within:shadow-outline transition-transform duration-300 ease-in-out">
                                                    <input id="unchecked" type="checkbox" className="absolute opacity-0 w-0 h-0" />
                                                </span>
                                            </span>
                                            <span className="ml-3 text-sm">Don't start Recording</span>
                                        </label>
                                        :
                                        <label htmlFor="Start Recording" className="mt-3 inline-flex items-center cursor-pointer">
                                            <span className="relative">
                                                <span className="block w-10 h-6 bg-gray-400 rounded-full shadow-inner"></span>
                                                <span className="absolute block w-4 h-4 mt-1 ml-1 rounded-full shadow inset-y-0 left-0 focus-within:shadow-outline transition-transform duration-300 ease-in-out bg-purple-600 transform translate-x-full">
                                                    <input id="checked" type="checkbox" class="absolute opacity-0 w-0 h-0" />
                                                </span>
                                            </span>
                                            <span className="ml-3 text-sm">Start Recording</span>
                                        </label>

}
                                </div>
                            </div>
                            <input type="submit" />
</form>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}