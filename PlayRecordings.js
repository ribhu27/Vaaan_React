import '../App.css';
import React, { useState } from 'react';
import { useEffect } from 'react';
import Navbar from '../Components/Navbar';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Modal from './Modal';
// import { motion, AnimatePresence } from "framer-motion";

export default function PlayRecordings() {
    const apiUrl = localStorage.getItem('api')

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
    const [videoPath, setVideoPath] = useState('');
    const [showModal, setShowModal] = useState(false)
    const location = useLocation()
    const { CameraName } = location.state
    const [videoList, setVideoList] = useState([])
    const [filteredList, setFilteredList] = new useState(videoList);



    function handleOnClick(videoName) {
        setVideoPath((videoPath) => {
            // return 'http://127.0.0.1:8080/Recordings/' + CameraName + '/' + videoName
            return apiUrl+'Recordings/' + CameraName + '/' + videoName

        })
        if (showModal === false) {
            setShowModal(true);
        } else {
            setShowModal(false);
        }
    }
    function handleOnClose() {
        setShowModal(false)
    }




    async function getCameraRecordings(cameraName) {
        // let url = 'http://127.0.0.1:8080/Recordings/' + cameraName
        let url = apiUrl+'Recordings/' + cameraName
        try{
            const data = await axios.get(url)
            setVideoList((videoList) => {
                return data.data;
            })
            setFilteredList((videoList) => {
                return data.data
            })
            console.log(data)

        }catch(e){
            console.log(e)
        }
    }



    const filterbyDate = (event) => {
        const query = event.target.value;
        var updatedList = [...videoList]
        var query2;
        if (document.getElementById('time-search').value)
            query2 = document.getElementById('time-search').value;
        if (query2)
            updatedList = updatedList.filter((item) => {
                if ((item.split('T')[0].slice(0, 4) + '-' + item.split('T')[0].slice(4, 6) + '-' + item.split('T')[0].slice(6, 8))
                    .toLowerCase().includes(query.toLowerCase()) && (item.split('T')[1].slice(0, 2) + ':' + item.split('T')[1].slice(2, 4))
                        .toLowerCase().includes(query2.toLowerCase()))
                    return item;
            })
        else
            updatedList = updatedList.filter((item) => {
                if ((item.split('T')[0].slice(0, 4) + '-' + item.split('T')[0].slice(4, 6) + '-' + item.split('T')[0].slice(6, 8))
                    .toLowerCase().includes(query.toLowerCase()))
                    return item;
            })
        setFilteredList(updatedList)
    }



    const filterbyTime = (event) => {
        const query = event.target.value;
        var updatedList;
        var query2;
        updatedList = [...videoList]
        if (document.getElementById('date-search').value)
            query2 = document.getElementById('date-search').value;
        if (query2)
            updatedList = updatedList.filter((item) => {
                if ((item.split('T')[1].slice(0, 2) + ':' + item.split('T')[1].slice(2, 4))
                    .toLowerCase().includes(query.toLowerCase()) && (item.split('T')[0].slice(0, 4) + '-' + item.split('T')[0].slice(4, 6) + '-' + item.split('T')[0].slice(6, 8))
                        .toLowerCase().includes(query2.toLowerCase()))
                    return item;
            })
        else
            updatedList = updatedList.filter((item) => {
                if ((item.split('T')[1].slice(0, 2) + ':' + item.split('T')[1].slice(2, 4))
                    .toLowerCase().includes(query.toLowerCase()))
                    return item;
            })
        setFilteredList(updatedList)
    }



    useEffect(() => {
        getCameraRecordings(CameraName);
    }, [])

    return (
        <>
            <Navbar />
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Recordings
                    <small className='ml-2 font-semibold text-gray-500 dark:text-gray-400'> Camera List <small>
                        &gt; Video List
                        </small>
                        </small>
                    
                    </h1>

                </div>
            </header>
            {/* <h2 className='mx-auto max-w-7xl sm:px-6 lg:px-8 mt-4 shadow'>Camera List</h2> */}
            {/* <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                <div className="border-b border-gray-900/10 ">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Video List</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">Select a camera to view recorded videos</p>
                </div>
            </div> */}
            <div className='mx-auto max-w-7xl sm:px-6 lg:px-8 search-div'>
                <span id='search-span'>Search By-  </span>
                <label for="date-search">Date:</label>
                <input type="date" id="date-search" name="date-search" onChange={(e) => filterbyDate(e)} />
                <label for="time-search">Time:</label>
                <input type="time" id="time-search" name="time-search" onChange={(e) => filterbyTime(e)} />
            </div>
            <div className='table-wrapper mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
                <table className='fl-table'>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Play</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredList.map((videoName) => {
                                return (
                                    <tr key={videoName}>
                                        <td>{videoName.split('T')[0].slice(6, 8) + ' ' + map.get(parseInt(videoName.split('T')[0].slice(4, 6))) + ' ' + videoName.split('T')[0].slice(0, 4)}</td>
                                        {/* <td>{videoName.split('T')[1].slice(0, 2) + ':' + videoName.split('T')[1].slice(2, 4) + ' ' + (parseInt(videoName.split('T')[1].slice(0, 2)) < 12 ? 'am' : 'pm')}</td>
                                         */}
                                        <td>{videoName.split('T')[1].slice(0, 2) + ':' + videoName.split('T')[1].slice(2, 4)}</td>

                                        <td><button className='btn effect01' onClick={() => handleOnClick(videoName)}>Play Recording</button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                <Modal cameraName={CameraName} videoURL={videoPath} show={showModal} onClose={handleOnClose} videoList={videoList} />
            </div>
        </>
    )
}