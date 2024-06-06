import '../App.css';
import React, { useState } from 'react';
import { useEffect } from 'react';
import Navbar from '../Components/Navbar';
import axios from 'axios';
import { FaVideo } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
export default function Recordings() {
    const apiUrl = localStorage.getItem('api')

    const [cameraList, setCameraList] = useState([])
    const [filteredList, setFilteredList] = new useState(cameraList);

    async function getCamerasList() {
        const apiUrl = localStorage.getItem('api')

        // const data = await axios.get('http://127.0.0.1:8080/Recordings')
        const data = await axios.get(apiUrl+'Recordings')

        console.log(data)
        setCameraList(cameraList => {
            return [...data.data]
        })
        setFilteredList(filteredList => {
            return [...data.data]
        })
        console.log('hi')
        console.log(cameraList)
    }
    const filterbyCamera = (event) => {
        const query = event.target.value;
        var updatedList;
        updatedList = [...cameraList]
        updatedList = updatedList.filter((item) => {
            if (item.toLowerCase().includes(query.toLowerCase()))
                return item;
        })
        setFilteredList(updatedList)
    }

    function deleteCamera(cameraName){
        axios.delete(apiUrl+`live_camera`, { data:{"camera_name":cameraName} }).then(response => {
        console.log(response)
        if (response.status == '200') {
          setFilteredList((x) => {
            const table = x.filter((item) => {
              return item !== cameraName
            })
            return table;
          })
          setCameraList((x)=>{
            const table = x.filter((item) => {
                return item !== cameraName
              })
              return table;
          })
        }
      }).catch(err => {
        console.log(err)
      })
    }

    useEffect(() => {
        getCamerasList();
    }, [])
    return (
        <>
            <Navbar />
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Replay
                    <small className='ml-2 font-semibold text-gray-500 dark:text-gray-400'> Camera List</small>
                    </h1>
                </div>
            </header>
            {/* <h2 className='mx-auto max-w-7xl sm:px-6 lg:px-8 mt-4 shadow'>Camera List</h2> */}

            {/* <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                <div className="border-b border-gray-900/10 ">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Camera List</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">Select a camera to view recorded videos</p>
                </div>
            </div> */}
            <div className='mx-auto max-w-7xl sm:px-6 lg:px-8 search-div'>
                <span id='search-span'>Search: </span>
                <input type="text" id="camera-search" name="camera-search" onChange={(e) => filterbyCamera(e)} />
            </div>
            <div className="table-wrapper mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <table className='fl-table'>
                    <thead>

                        <tr>
                            <th>Camera Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredList.map((cameraName) => {
                                return (
                                    <tr>
                                        <td>{cameraName}</td>
                                        <td>
                                            <button className="btn effect01">
                                                <FaVideo />
                                                <Link to='/PlayRecordings' state={{ CameraName: cameraName }}>View Recordings</Link>
                                            </button>
                                                <button className="btn effect01" onClick={()=>deleteCamera(cameraName)}><FaTrash/>Delete</button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}