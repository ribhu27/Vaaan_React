import React, { useState } from 'react'
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from '../Components/Navbar';
import axios from 'axios';
function EnterVids() {

    // to print different data o browser based on true false value 
    const [isSubmitted, setIsRegSubmitted] = useState(false);
    // const [User, setUname] = useState('');

    // the content which will be displayed after submit 
    const [print, setPrintContent] = useState('');

    const handleSubmit = (event) => {
        //Prevent page reload
        event.preventDefault();

        // forms input stored in variable 
        var {  uname, pass,DeviceName, port, latitude, longitude, ip } = document.forms[0];

        const apiUrl = localStorage.getItem('api')

        const url = apiUrl + 'vids/';
        const data = {
            "device_name": DeviceName.value,
            "username": uname.value,
            "password": pass.value,
            "ip_address": ip.value,
            "latitude": latitude.value,
            "longitude": longitude.value
            
        };
        const p=port;
        console.log(data)

        let hello;
        // post reuest to store Device data on backend
        axios.post(url, data)
            .then(response => {
                if (response.status == 201) {
                    hello = "Vids Configuration";
                    let temp = data.latitude + " " + data.longitude + " " + data.ip;
                    hello += temp + "  have been added succesfully"

                    setIsRegSubmitted(true);
                    setPrintContent(hello);
                }
                else {
                    // setErrorMessages({ name: "pass", message: response.data });
                    // console.log(response.data);
                    // setIsRegSubmitted(true);
                    // setPrintContent('user with this username already exists.');
                }
                console.log(response.data);
                // setIsSubmitted(true);
            })
            .catch(error => {
                if (error.response.status == 400) {
                    setIsRegSubmitted(true);
                    setPrintContent('wrong input format');
                }
                console.log(error);
            });

    };

   


    // JSX code for Enter VIDS form
    const renderForm = (
        <div>
                <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Enter Details
                    </h1>

                </div>
            </header>
            <form className="vids-form"onSubmit={handleSubmit}>
                <br></br>

                <div className="form-ele">
                    <label>Username </label>
                    <input type="text" name="uname" required  className="form-ele-input"/>
                </div>
                <div className="form-ele" >
                    <label>Password</label>
                    <input type="password" name="pass" required className="form-ele-input" />

                </div>

                <div className="form-ele">

                    <label>Device Name </label>
                    <input type="text" name="DeviceName"  className="form-ele-input" />
                </div>
                <div className="form-ele">

                    <label>Device Port</label>
                    <input type="password" name="port" required className="form-ele-input" />
                </div>

                <div className="form-ele" >

                    <label>Latitude</label>
                    <input type="number" step="0.000001" name="latitude" required className="form-ele-input" />
                </div>
                <div className="form-ele">

                    <label>Longitude</label>
                    <input type="number" step="0.000001" name="longitude" required className="form-ele-input" />
                </div>

                <div className="form-ele">

                    <label>IP Address</label>
                    <input type="text" name="ip" required className="form-ele-input" />

                </div>
                <div className="form-ele">

                </div>
                <div className="vids-submit">
                    <input type="submit" />
                    <Link to="/Dashboard">
                    <button className="back-button">Back</button>
                    </Link>
                </div>
            </form>
        </div>
    );



    return (
        <>
        <Navbar/>
            <div >
                <div >

                    {isSubmitted ? <div >{print}</div> : renderForm}
                </div>
            </div>
        </>
    );

}

export default EnterVids;