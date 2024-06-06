import React, { useEffect, useState, useMemo } from 'react'
import axios from "axios";
import Pagination from './Pagination';
// import './style.css';
import ChartsPage from '../Charts/ChartsPage'
import { Link } from "react-router-dom";
import iv from './videos/1st.mp4'
import Navbar from '../Components/Navbar';
import Modal from './Modal';
// import {DefaultPlayer as Video} from 'react-html5video'
// let PageSize = 10;

function Incident() {

  // intially default page size set 10
  const apiUrl = localStorage.getItem('api')

  const [PageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [videoPath, setVideoPath] = useState('');
  const [showModal, setShowModal] = useState(false)


  const [tableData, setData] = useState([]);
  const [showVideoDropdown, setShowVidsDropdown] = useState(false);
  // video path url stored when clicked on play video button 
  function handleVideoDropdown(Vurl) {
    setVideoPath(Vurl);
    console.log(Vurl)
    setShowVidsDropdown(!showVideoDropdown);
    if (showModal === false) {
      setShowModal(true);
  } else {
      setShowModal(false);
  }
  }
  function handleOnClose() {
    setShowModal(false)
}

  const getData = async () => {
    try{

      const { data } = await axios.get(apiUrl + `incidents/`);
      setData(data);
      console.log(data)
    }catch(e){
      console.log(e)
    }
  };

  // axios.get(`http://192.168.0.165:8000/incidents/`).then(res=>{

  // setData(res.data);
  //   console.log(res.data)

  // }).catch(err=>{
  //     console.log(err);
  //   });

  // this will run whenever tabledata pageSize  and currentPage changed 
  const currentTableData = useMemo(() => {

    const firstPageIndex = (currentPage - 1) * PageSize;
    console.log("f");
    console.log(firstPageIndex);
    const lastPageIndex = firstPageIndex + PageSize;
    console.log("l");

    console.log(lastPageIndex)
    return tableData.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, tableData, PageSize]);

  console.log(currentTableData)
  console.log(PageSize)


  useEffect(() => {
    setTimeout(() => {
      // console.log('Hello, World!');
    }, 1000);
    getData();
    // const timer = setInterval(getData,10000);;
    // return()=> clearInterval(timer);
    // console

  }, []);







  return (
    <>
      <Navbar />
      <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Analytics
                    </h1>

                </div>
            </header>
      <div>
        <ChartsPage/>
        <div className='table-wrapper'>
          {/* <div className='below-nav-users-incident' style={{ width: '100%' }}>
            <select className="show-row" value={PageSize} required onChange={(e) => setPageSize(parseInt(e.target.value, 10))}>
              <option value="10">Show Row</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50	</option>
            </select>
            Incident Alert </div> */}


          <table className="fl-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>S.N</th>
                <th>Device Name</th>
                <th>Vehicle type</th>
                <th>Incident type</th>
                <th>Incident Time</th>
                <th>Play Video</th>
              </tr>
            </thead>
            <tbody>
              {
                currentTableData.map((data, index) => {
                  return (
                    <tr className='trtable' key={index}>
                      <td>{index + 1 + (currentPage - 1) * PageSize}</td>
                      <td>{data.device_name}</td>
                      <td>{data.VehicleClassName}</td>
                      <td>{data.EventValue}</td>
                      <td>{data.EventDate}</td>
                      {/* <td><Link to="/ReactVideoPlayer">
                <button> Play Video</button></Link></td> */}
                      <td><button onClick={() => handleVideoDropdown(data.EventUrl)}> Play Video</button></td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
        {/* {showVideoDropdown && (
            <div className='video-trig'>
              <Video className="my-player" autoPlay  width="350" height="350"
                onCanPlayThrough={() => {
                  console.log("play video");
                }}
                controls={['PlayPause', 'Seek', 'Time', 'Volume']}
                // style={{ marginTop: '20px' }}
              >
                <source src={iv} type="video/mp4" />
              </Video>
            </div>
          )} */}

        {/* code for video playing  */}
        <Modal videoURL={videoPath} show={showModal} onClose={handleOnClose}/>

       
      </div>
      {/* pagination to display page no.  */}
      <Pagination
        className="pagination-bar"
        currentPage={currentPage}
        totalCount={tableData.length}
        pageSize={PageSize}
        onPageChange={page => setCurrentPage(page)}
      />

    </>
  )
}

export default Incident