import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';

function VidsEdit() 
{
  
    // const url = 'http://192.168.0.15:8000/vids/';
    const apiUrl = localStorage.getItem('api')

    const url = apiUrl + 'equipments/';


    // this will save location from where it is called
  const location = useLocation();

  // storing device info in variable 

  const [testData, setTestData] = useState(location.state.data)
  // console.log(location.state.data)

  const username = testData.username
  // const auto_increment_id = testData.auto_increment_id
  const [device_name, setDeviceName] = useState(testData.device_name);
  const [password, setPassword] = useState(testData.password);
  const [ip_address, setIp] = useState(testData.ip_address);
  const [latitude, setLatitude] = useState(testData.latitude);
  const [longitude, setLongitude] = useState(testData.longitude);
  const [storage_days, setStorage] = useState(testData.storage_days);


  // edit device info function  
  function editUser(e) {
    e.preventDefault();
    const data = {
      
      "username": username,
      "device_name": device_name,
      "password": password,
      "ip_address": ip_address,
      "latitude": latitude,
      "longitude": longitude,
      "device_category":'CAMERA',
      "project":'VIDS',
      "storage_days":storage_days,
    };
    // axios.delete(`http://192.168.0.165:8000/equipments/`, { data: data }).then(response => {
    //     console.log(response)
    //     if (response.status == '200') {
    //       axios.post(url,data).then((response)=>{
    //         console.log(response)
    //     }).catch(err=>{
    //         console.log(err)
    //     })
    //     }
    //   }).catch(err => {
    //     console.log(err)
    //   })
    axios.put(url, data).then(response => {
      console.log(response)
    }).catch(err => {
      console.log(err)
    })
  }

  
  return (
    <>
    <Navbar/>
      <div>
      <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Edit VIDS
                    </h1>

                </div>
            </header>
            <form className="vids-form" onSubmit={editUser}>
                <br></br>

                <div className="form-ele">
                    <label>Username </label>
                    <input type="text" value={username}readOnly  className="form-ele-input" / >
                </div>
                <div className="form-ele" >
                    <label>Password</label>
                    <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} readOnly className="form-ele-input" />

                </div>

                <div className="form-ele">

                    <label>Device Name </label>
                    <input type="text" onChange={(e) => setDeviceName(e.target.value)} value={device_name} className="form-ele-input" />
                </div>
                <div className="form-ele">

                    <label>IP Address</label>
                    <input type="text" onChange={(e) => setIp(e.target.value)} value={ip_address} required className="form-ele-input" />

                </div>
                <div className="form-ele">

                    <label>Storage Days</label>
                    <input type="text" onChange={(e) => setStorage(e.target.value)} value={storage_days} required className="form-ele-input" />

                </div>
                <div className="form-ele">

                    <label>Latitude</label>
                    <input type="text" onChange={(e) => setLatitude(e.target.value)} value={latitude} required className="form-ele-input" />
                </div>

                <div className="form-ele">

                    <label>Longitude</label>
                    <input type="text" onChange={(e) => setLongitude(e.target.value)} value={longitude} required className="form-ele-input" />
                </div>

                <div className="form-ele">

                </div>
                <div className="vids-submit">
                    <input type="submit" />
                    <Link to="/VidsList">
                    <button className="back-button">Back</button>
                    </Link>
                </div>
            </form>
        </div>
    </>
  )

}

export default VidsEdit