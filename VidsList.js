import React, { useEffect, useState } from 'react'
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faPencilSquare, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../Components/Navbar';

function VidsList() {
  const [tableData, setData] = useState([]);
  const apiUrl = localStorage.getItem('api')
  const apiNode = localStorage.getItem('api_node')


  // fetching all device data 
  const getData = async () => {
    const { data } = await axios.get(apiUrl + `equipments/`);
    setData(data);
    console.log(data)
  };
  useEffect(() => {
    getData();
  }, []);

  //  deleting device function by storing deleting device data into del 
  const deleteUser = (data) => {
    console.log(data)
    const del = {
      'device_name': data.device_name
    }
    const confirmMessage = 'Are you sure you want to delete?';
    if (window.confirm(confirmMessage)) {
      axios.delete(apiUrl + `equipments/`, { data: data }).then(response => {
        console.log(response)
        if (response.status == '200') {
          axios.post(apiNode+'cameraDeleted', { data: data }).then((res)=>{
            console.log(res)
          })
          //send post request of the same camera to node app
          setData((x) => {
            const table = x.filter((item) => {
              return item.device_name !== data.device_name
            })
            return table;
          })
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }

  return (
    <>
      <Navbar />
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Camera List
          </h1>

        </div>
      </header>
      <div className='table-wrapper'>
        {/* <div className='below-nav-users'>VIDS LIST</div> */}
        <table className="fl-table">
          <thead>
            <tr>
              <th>S.N</th>
              <th>Device Name</th>
              <th>User Name</th>
              <th>Password</th>
              <th>IP</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              tableData.map((data, index) => {
                return (
                  <tr className='trtable' key={index}>
                    <td>{index + 1}</td>
                    <td>{data.device_name}</td>
                    <td>{data.username}</td>
                    <td>{data.password}</td>
                    <td>{data.ip_address}</td>
                    <td>
                      <Link className='edit-td' to="/VidsEdit" state={{ data }}>
                        <FontAwesomeIcon icon={faPencilSquare} size="1px" color="#31708f" /> </Link>


                      <button className='edit-td-delete' onClick={() => { deleteUser(data) }} >
                        <FontAwesomeIcon icon={faTrash} size="1px" color="#31708f" /> </button>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
        {/* <div className="newuser">
            <Link to="/EnterVids">
              <button className="newuser-button "><FontAwesomeIcon icon={faPlus} size="1px" color="white" />Enter Vids</button>
            </Link>
          </div> */}
      </div>
    </>
  )
}

export default VidsList