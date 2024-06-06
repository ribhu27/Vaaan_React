import React, { useEffect } from 'react'
import mapboxgl from 'mapbox-gl';
import { Link } from "react-router-dom";
import axios from 'axios';
import 'mapbox-gl/dist/mapbox-gl.css';
// import treedata from './trees.geojson';
import dt from './heatdata.json';
import sp from './sample.json';
import Navbar from '../Components/Navbar';


function Heatmap() {

    let ip=[];

    const getData = async () => {

        var GeoJSON = require('geojson');

        // access token required to View world map using mapbox 
        mapboxgl.accessToken = 'pk.eyJ1IjoiaGltYW5zaHVnYXJnMTIzIiwiYSI6ImNsZjlrNDJuaDJncHQ0MnBqcXo4NGY4YmMifQ.T_6vLfl8EKQHLAvbugfiQg';
        // const map = new mapboxgl.Map({
        //     container: 'map',
        //     center: [76.351992, 28.983367],
        //     zoom: 2,
        //     // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        //     style: 'mapbox://styles/mapbox/streets-v12'
        // })


        // initially empty map loaded 

        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [76.351992, 28.983367],
            zoom: 11
            });


        // console.log(sp)
        // console.log(dt)

        // var data = [
        //     { name: 'Location A', category: 'Store', street: 'Market', lat: 39.984, lng: -75.343 },
        //     { name: 'Location B', category: 'House', street: 'Broad', lat: 39.284, lng: -75.833 },
        //     { name: 'Location C', category: 'Office', street: 'South', lat: 39.123, lng: -74.534 }
        //   ];
          
        //   GeoJSON.parse(data, {Point: ['lat', 'lng']});


        // let sps=sp.feaures;
        // console.log( GeoJSON);
        let arr2 = [];
        let result1= [];
        let result2= [];
        var geo = [];
        var myGeoJSONData=[];
        // const getData = async () => {

        // accident data gathered and occurrence counted inside axios code 
         axios.get(`https://80542492-702f-4ab3-884e-ec0ffeda7c7c.mock.pstmn.io/Get`).then(res => {
            console.log("api")
            console.log(res.data);
            ip=res.data;
            
            let key = "ip_address";
            ip.map(x=>{
                // Checking if there is any object in arr2
                // which contains the key value
                if(arr2.some((val)=>{ return (val["ip_address"] == x["ip_address"]) })){
                    // If yes! then increase the occurrence by 1
                    arr2.map(k=>{
                        if(k[key] === x[key]){ 
                            k["occurrence"]++
                        }
                    })                   
                }else{
                    // If not! Then create a new object initialize 
                    // it with the present iteration key's value and 
                    // set the occurrence to 1
                    let a = {}
                    a[key] = x[key]
                    // a["device_name"]=x["device_name"];
                    // a["latitude"]=x["latitude"];
                    // a["longitude"]=x["longitude"];
                    a["occurrence"] = 1
                    arr2.push(a);
                }
            })
            console.log(arr2);


            // Now arr2 accident data matched using unique ip_address and lat long has been found for later use 
            axios.get(`https://289b5390-15f2-49cc-8fc0-c57a17746119.mock.pstmn.io/Get`).then(resp => {
                result1= resp.data;
                result2 = arr2;
                console.log("result1");
                console.log(result1)
                console.log(result2);
                geo = result1.map(o1 =>{
                    let occurrence
                   let x =  result2.filter(o2 => o1.ip_address === o2.ip_address)
                   if(x.length!=0){
                   occurrence = x[0].occurrence
                   }
                   else
                    occurrence = 0
                   return {...o1, occurrence}
                } );


            //    console.log("hellog");
            //    console.log(geo);
            //    console.log("hellog");

            // final geo data into final data format for Heatmap circle has been converted into makeGeoJSON 
            const makeGeoJSON = (data) => {
                return {
                  type: 'FeatureCollection',
                  features: data.map(feature => {
                    return {
                      "type": "Feature",
                      "properties": {
                        "dbh": feature.occurrence,
                        "device":feature.device_name
                      },
                      "geometry": {
                        "type": "Point",
                        "coordinates": [  feature.longitude,feature.latitude]
                      }
                    }
                  })
                }
              };
              
              myGeoJSONData = makeGeoJSON(geo);
              console.log(geo)
              console.log(myGeoJSONData);

            
              
                map.addSource('trees', {
                    'type': 'geojson',
                    'data': myGeoJSONData
                });
    
                const geodata=map.getSource('trees');
                console.log("geod")
                console.log(geodata);
    
                // layer code started 
                map.addLayer(
                    {
                        'id': 'trees-heat',
                        'type': 'heatmap',
                        'source': 'trees',
                        'maxzoom': 15,
                        'paint': {
                            // increase weight as diameter breast height increases
                            'heatmap-weight': {
                                'property': 'dbh',
                                'type': 'exponential',
                                'stops': [
                                    [1, 0],
                                    [62, 4]
                                ]
                            },
                            // increase intensity as zoom level increases
                            'heatmap-intensity': {
                                'stops': [
                                    [11, 1],
                                    [15, 3]
                                ]
                            },
                            // use sequential color palette to use exponentially as the weight increases
                            'heatmap-color': [
                                'interpolate',
                                ['linear'],
                                ['heatmap-density'],
                                0,
                                'rgba(236,222,239,0)',
                                0.2,
                                'rgb(217, 161, 41)',
                                0.4,
                                'rgb(214, 54, 43)',
                                0.6,
                                'rgb(217, 161, 41)',
                                0.8,
                                'rgb(214, 54, 43)'
                            ],
                            // increase radius as zoom increases
                            'heatmap-radius': {
                                'stops': [
                                    [11, 15],
                                    [15, 20]
                                ]
                            },
                            // decrease opacity to transition into the circle layer
                            'heatmap-opacity': {
                                'default': 1,
                                'stops': [
                                    [14, 1],
                                    [15, 0]
                                ]
                            }
                        }
                    },
                    'waterway-label'
                );
    
                map.addLayer(
                    {
                        'id': 'trees-point',
                        'type': 'circle',
                        'source': 'trees',
                        'minzoom': 14,
                        'paint': {
                            // increase the radius of the circle as the zoom level and dbh value increases
                            'circle-radius': {
                                'property': 'dbh',
                                'type': 'exponential',
                                'stops': [
                                    [{ zoom: 15, value: 1 }, 5],
                                    [{ zoom: 15, value: 62 }, 10],
                                    [{ zoom: 22, value: 1 }, 20],
                                    [{ zoom: 22, value: 62 }, 50]
                                ]
                            },
                            'circle-color': {
                                'property': 'dbh',
                                'type': 'exponential',
                                'stops': [
                                    [0, 'rgba(214, 54, 43,0)'],
                                    [10, 'rgb(217, 161, 41)'],
                                    [20, 'rgb(217, 161, 41)'],
                                    [30, 'rgb(166,0,0)'],
                                    [40, 'rgb(103,169,207)'],
                                    [50, 'rgb(28,144,153)'],
                                    [60, 'rgb(1,108,89)']
                                ]
                            },
                            'circle-stroke-color': 'white',
                            'circle-stroke-width': 1,
                            'circle-opacity': {
                                'stops': [
                                    [14, 0],
                                    [15, 1]
                                ]
                            }
                        }
                    },
                    'waterway-label'
                );
            // layer code ended 


    
            // click on tree to view dbh in a popup
            map.on('click', 'trees-point', (event) => {
                new mapboxgl.Popup()
                    .setLngLat(event.features[0].geometry.coordinates)
                    .setHTML(`<strong>Total Inicdents:</strong> ${event.features[0].properties.dbh} <h3> Location: <h3/> ${event.features[0].properties.device}`)
                    .addTo(map);
            });

              

            }).catch(error => {
                console.log(error);
            });

        }).catch(error => {
            console.log(error);
        });
    // };
    // getData();
        
        
        //    var reader = require()


        

          
       


    };
    useEffect( () => {

        
          getData();

        


    }, []);



    return (
        <>
        <Navbar/>
        <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Home
                    <small className='ml-2 font-semibold text-gray-500 dark:text-gray-400'> Heatmap</small>
                    </h1>
                </div>
            </header>
            <div className='mx-auto max-w-full py-6 sm:px-6 lg:px-8'>

        <div id="map" style={{ width: '100%', height: '35vw' }}></div>
        <Link to="/">
          <button className="back-button">Back</button>
        </Link>
            </div>
      </>
    )
}

export default Heatmap