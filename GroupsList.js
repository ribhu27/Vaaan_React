import React, { useEffect, useState } from 'react'
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faPencilSquare, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../Components/Navbar';

function GroupsList() {
    const [tableData, setData] = useState([]);
    const apiUrl = localStorage.getItem('api')


    // fetching all device data 
    const getData = async () => {
      try{
        const { data } = await axios.get(apiUrl+`camera_group_list/`);
        setData(data);
        console.log(data)
      }catch(e){
        console.log(e)
      }
    };
    useEffect(() => {
      getData();
    }, []);

    //  deleting device function by storing deleting device data into del 
    const deleteUser = (data) => {
      console.log(data)
      const del = {
        'group_name':data.group_name
      }
    const confirmMessage = 'Are you sure you want to delete?';
    if (window.confirm(confirmMessage)) {
      axios.delete(apiUrl+`camera_group_delete/`, { data: data }).then(response => {
        console.log(response)
        if (response.status == '200') {
          setData((x) => {
            const table = x.filter((item) => {
              return item.group_name !== data.group_name
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
      <Navbar/>
      <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Group List
                    </h1>

                </div>
            </header>
        <div className='table-wrapper'>
          {/* <div className='below-nav-users'>VIDS LIST</div> */}
          <table className="fl-table">
            <thead>
              <tr>
                <th>S.N</th>
                <th>Group Name</th>
                <th>Cameras List</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                tableData.map((data, index) => {
                    if(data.group_name)
                  return (
                    <tr className='trtable' key={index}>
                      <td>{index}</td>
                      <td>{data.group_name}</td>
                      <td className='text-ellipsis'>{data.camera_groups.map((device)=>{return device.device_name+", "})}</td>
                      <td>
                        <Link className='edit-td' to="/GroupsEdit" state={{ data }}>
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

export default GroupsList