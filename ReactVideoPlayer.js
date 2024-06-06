import React from 'react'
import {DefaultPlayer as Video} from 'react-html5video'
// import 'react-html5video/dist/styles.css'
import iv from './videos/1st.mp4'
import Navbar from '../Components/Navbar';
function ReactVideoPlayer() {
  return (
    <>
    <Navbar/>
    <Video autoPlay loop width="578" height="400"
    onCanPlayThrough={()=>{
        console.log("play video");
    }}
    style={{marginTop: '20px'}}
    >
        <source src={iv} type="video/mp4" />
    </Video>
    </>
  );
  // return (
  //   <div>
  //     <video autoPlay loop width="678" height="400" controls>
  //       <source src="http://192.168.0.154:3333/VIDS01/14-12-22/010814122215471024.mp4" type="video/mp4" />
  //       Your browser does not support the video tag.
  //     </video>
  //   </div>
  // );
}

export default ReactVideoPlayer;