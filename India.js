import React, { useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl';
import { Link } from "react-router-dom";
import axios from 'axios';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBellSlash } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { useRef } from 'react';
function India() {
    const apiUrl = localStorage.getItem('api')

    const vehicle_class_dict = {'1':'Car','2':'LCV/MiniBus','3':'Truck 2 Axle','4':'Bus 2 Axle','5':'MAV 3 Axle','6':'MAV 4-6 Axle','7':'OSV','8':'Non Sch/Tractor'}
    const traURL = apiUrl+'tra_events/'
    const behaviorURL = 'http://192.168.0.15:8000/behaviour_events/'
    const [clsname, setClsname] = useState('fa fa-ell mapboxgl-ctrl mapboxgl-ctrl-group-button')
    const [bell, setBell] = useState(false)
    function handleBell() {
        setBell(!bell)
        console.log(bell)
        setClsname(() => {
            if (bell)
                return 'fa fa-bell mapboxgl-ctrl mapboxgl-ctrl-group-button'
            else
                return 'fa fa-bell-slash mapboxgl-ctrl mapboxgl-ctrl-group-button'
        })
    }
    class HelloWorldControl {
        onAdd(map) {
            this._map = map;
            this._container = document.createElement('button');
            this._container.addEventListener('click', () => {
                handleBell();
            })
            this._container.className = clsname;
            // this._container.textContent = 'Hello, world';
            return this._container;
        }

        onRemove() {
            this._container.parentNode.removeChild(this._container);
            this._map = undefined;
        }
    }
    let markerList = [];
    let incidcount = 0;
    var size = 0;
    var counter = 1;
    var geojson;
    var result1;
    var result2;
    var geo;
    var click = 0;




    useEffect(() => {


        // initially empty map loaded 
        mapboxgl.accessToken = 'pk.eyJ1IjoiaGltYW5zaHVnYXJnMTIzIiwiYSI6ImNsZjlrNDJuaDJncHQ0MnBqcXo4NGY4YmMifQ.T_6vLfl8EKQHLAvbugfiQg';
        const map = new mapboxgl.Map({
            container: 'map',
            center: [88.3639, 22.5726],
            zoom: 11,
            // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
            style: 'mapbox://styles/mapbox/streets-v12'
        });

        map.addControl(new mapboxgl.NavigationControl());
        map.addControl(new mapboxgl.FullscreenControl({ container: document.querySelector('map') }));
        map.addControl(new HelloWorldControl());

        // function to remove marker from every geo location
        function draw() {
            click++;
            if (markerList) {
                for (var i = markerList.length - 1; i >= 0; i--) {
                    markerList[i].remove();
                }
            }
            for (var i = 1; i <= incidcount; i++) {
                if (map.hasImage(`pulsing-dot-${i}`)) map.removeImage(`pulsing-dot-${i}`);
            }
        }


        //   function to show all alert on map again 
        function show() {
            click++;
            console.log("inside show");
            size = 200;
            counter = 1;
            console.log(geo)
            for (const features of geo) {
                // console.log(feature)
                const pulsingDot = {
                    width: size,
                    height: size,
                    data: new Uint8Array(size * size * 4),

                    // When the layer is added to the map,
                    // get the rendering context for the map canvas.
                    onAdd: function () {
                        const canvas = document.createElement('canvas');
                        canvas.width = this.width;
                        canvas.height = this.height;
                        this.context = canvas.getContext('2d');


                        // pop up on same lat long as alert 
                        const el = document.createElement('div');
                        canvas.className = 'mark-alert marker';

                        console.log(features.longitude);
                        console.log(features.latitude);
                        // make a marker for each feature and add it to the map

                        const newMarker = new mapboxgl.Marker(canvas)
                            // .setLngLat(feature.geometry.coordinates)
                            .setLngLat([features.longitude, features.latitude])
                            .setPopup(
                                new mapboxgl.Popup({ offset: 1 }) // add popups
                                    .setHTML(
                                        `<h3>${features.device_name}</h3><p>${features.ip_address}</p>`
                                        // <button id='pulsing-dot-${counter}'>open camera</button>
                                    )
                            )
                            .addTo(map);

                        markerList.push(newMarker);
                    },

                    // Call once before every frame where the icon will be used.
                    render: function () {
                        const duration = 1000;
                        const t = (performance.now() % duration) / duration;

                        const radius = (size / 2) * 0.05;
                        const outerRadius = (size / 2) * 0.2 * t + radius;
                        const context = this.context;

                        // Draw the outer circle.
                        context.clearRect(0, 0, this.width, this.height);
                        context.beginPath();
                        context.arc(
                            this.width / 2,
                            this.height / 2,
                            outerRadius,
                            0,
                            Math.PI * 2
                        );
                        context.fillStyle = `rgba(255, 20, 20, ${1 - t})`;
                        context.fill();

                        // Draw the inner circle.
                        context.beginPath();
                        context.arc(
                            this.width / 2,
                            this.height / 2,
                            radius,
                            0,
                            Math.PI * 2
                        );
                        context.fillStyle = 'rgba(0, 0, 0, 0)';
                        context.strokeStyle = 'white';
                        context.lineWidth = 2 + 4 * (1 - t);
                        context.fill();
                        context.stroke();

                        // Update this image's data with data from the canvas.
                        this.data = context.getImageData(
                            0,
                            0,
                            this.width,
                            this.height
                        ).data;

                        // Continuously repaint the map, resulting
                        // in the smooth animation of the dot.
                        map.triggerRepaint();

                        // Return `true` to let the map know that the image was updated.
                        return true;
                    }
                };
                // console.log(feature.longitude);
                const imageName = `pulsing-dot-${counter}`;
                const imageId = `image-${click}-${counter}-id`;
                const layerId = `layer-with-pulsing-dot-${counter}`;

                map.addImage(imageName, pulsingDot, { pixelRatio: 2 });

                map.addSource(imageId, {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': [
                            {
                                'type': 'Feature',
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': [features.longitude, features.latitude] // icon position [lng, lat]
                                }
                            }
                        ]
                    }
                });

                // document.getElementById(layerId).addEventListener('click', handleClick)

                counter++;

                incidcount = counter;
            }//for loop of alert  end here 

        }


        try {

            document.getElementById('remove').addEventListener('click', draw);
            document.getElementById('show').addEventListener('click', show);
        }
        catch (err) {
            console.log(err)
        }

        //   document.getElementById('pulsig-dot-1').addEventListener('click',single);

        axios.get(apiUrl + `vids/`).then(res => {
          
            console.log(res.data);
            geojson = res.data;
            
            console.log(geojson);

            for (const feature of geojson) {
                
                const el = document.createElement('div');
                el.className = 'mark';

                el.style.backgroundSize = '100%';
                new mapboxgl.Marker(el)
                    .setLngLat([feature.longitude, feature.latitude])
                    .setPopup(
                        new mapboxgl.Popup({ offset: 25 }) // add popups
                            .setHTML(
                                `<h3>${feature.device_name}</h3><p>${feature.ip_address}</p>`
                            )
                    )
                    .addTo(map);
            }


          




            //   axios.get(`https://c1675ac6-ec3d-4715-a9f7-62fe4e299f39.mock.pstmn.io/Get`).then(resp => {
            axios.get(apiUrl +  `incidents/`).then(resp => {
                console.log("hello");
                console.log(geojson);
                console.log("hello");


                //     console.log(resp.data);
                // const geo = resp.data
                // console.log(geo);
                result1 = geojson;
                result2 = resp.data;
                console.log("result2");
                console.log(result2);
                geo = result1.filter(o1 => result2.some(o2 => o1.device_name === o2.device_name));
                console.log("hello");
                console.log(geo);
                console.log("hello");






                size = 200;
                counter = 1;
                for (const features of geo) {
                    // console.log(feature)
                    const pulsingDot = {
                        width: size,
                        height: size,
                        data: new Uint8Array(size * size * 4),

                        // When the layer is added to the map,
                        // get the rendering context for the map canvas.
                        onAdd: function () {
                            const canvas = document.createElement('canvas');
                            canvas.width = this.width;
                            canvas.height = this.height;
                            this.context = canvas.getContext('2d');


                            // pop up on same lat long as alert 
                            const el = document.createElement('div');
                            canvas.className = 'mark-alert marker';

                            console.log(features.longitude);
                            console.log(features.latitude);
                            // make a marker for each feature and add it to the map

                            const newMarker = new mapboxgl.Marker(canvas)
                                // .setLngLat(feature.geometry.coordinates)
                                .setLngLat([features.longitude, features.latitude])
                                .setPopup(
                                    new mapboxgl.Popup({ offset: 1 }) // add popups
                                        .setHTML(
                                            `<h3>${features.device_name}</h3>`
                                            // <button id='pulsing-dot-${counter}'>open camera</button>
                                        )
                                )
                                .addTo(map);

                            markerList.push(newMarker);
                        },

                        // Call once before every frame where the icon will be used.
                        render: function () {
                            const duration = 1000;
                            const t = (performance.now() % duration) / duration;

                            const radius = (size / 2) * 0.05;
                            const outerRadius = (size / 2) * 0.2 * t + radius;
                            const context = this.context;

                            // Draw the outer circle.
                            context.clearRect(0, 0, this.width, this.height);
                            context.beginPath();
                            context.arc(
                                this.width / 2,
                                this.height / 2,
                                outerRadius,
                                0,
                                Math.PI * 2
                            );
                            context.fillStyle = `rgba(255, 20, 20, ${1 - t})`;
                            context.fill();

                            // Draw the inner circle.
                            context.beginPath();
                            context.arc(
                                this.width / 2,
                                this.height / 2,
                                radius,
                                0,
                                Math.PI * 2
                            );
                            context.fillStyle = 'rgba(0, 0, 0, 0)';
                            context.strokeStyle = 'white';
                            context.lineWidth = 2 + 4 * (1 - t);
                            context.fill();
                            context.stroke();

                            // Update this image's data with data from the canvas.
                            this.data = context.getImageData(
                                0,
                                0,
                                this.width,
                                this.height
                            ).data;

                            // Continuously repaint the map, resulting
                            // in the smooth animation of the dot.
                            map.triggerRepaint();

                            // Return `true` to let the map know that the image was updated.
                            return true;
                        }
                    };
                    // console.log(feature.longitude);
                    const imageName = `pulsing-dot-${counter}`;
                    const imageId = `image-${counter}-id`;
                    const layerId = `layer-with-pulsing-dot-${counter}`;
                   

                    counter++;

                    incidcount = counter;
                }//for loop of alert  end here 
            }).catch(error => {
                console.log(error);
            });




            // document.getElementById(layerId).addEventListener('click', handleClick)
            // This implements `StyleImageInterface`
            // to draw a pulsing dot icon on the map.

        }).catch(err => {
            console.log(err);
        });




    }, []);


    ///ALERTS AND NOTIFICATIONS///

    


    return (
        <>
            <div id="map" style={{ width: '100%', height: '35vw' }}></div>

            {/* <FontAwesomeIcon className={bell ? 'show mapboxgl-ctrl' : 'hide mapboxgl-ctrl'} icon={faBellSlash} id='show' onClick={handleBell} />
            <FontAwesomeIcon className={bell ? 'hide mapboxgl-ctrl' : 'show mapboxgl-ctrl'} icon={faBell} id='remove' onClick={handleBell} /> */}

            {/* <button id= 'remove' >remove incident alert</button> */}
            {/* <button id= 'show'> show alert</button> */}
            {/* <Link to="/Heatmap">
                <button className="back-button">Go to Heatmap</button>
            </Link> */}
            {/* <div class="msgbox-message-container"> */}
                {/* <p><button id="msgboxShowMessage" class="msgbox-message-button" type="button">Event Notification</button></p> */}
                {/* <p><button id="msgboxPersistent" class="msgbox-message-button" type="button">Show persistent</button></p>
                <p><button id="msgboxHiddenClose" class="msgbox-message-button" type="button">Hidden close button</button></p> */}
            {/* </div> */}
        </>
        // <div id="map" style={{ width: '100%', height: '400px' }}></div>
    )
}

export default India