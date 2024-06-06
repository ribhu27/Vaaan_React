import React from "react";
import axios from "axios";
export default function SnapModal(props) {
    const nodeApi = localStorage.getItem('api_node')


    if (!props.showSnap) {
        return null;
    } else {

        function downloadImage(e){
            const a = document.createElement('a')
            a.download = 'image-download'
            a.href = props.dataUrl[0]
            a.click()
            axios.post(nodeApi +"uploadSnap", { data: JSON.stringify(props.dataUrl[0]), name: props.dataUrl[1], time: props.dataUrl[2]}).then((res)=>{
                console.log("success " + res.data)
            }).catch((err)=>{
                console.log("error" + err)
            })
        }
        // setFilteredList([...props.cameraList])
        // const filterbyCamera = (event) => {
        //     const query = event.target.value;
        //     updatedList = [...props.cameraList]
        //     updatedList = updatedList.filter((item) => {
        //         if (item.toLowerCase().includes(query.toLowerCase()))
        //             return item;
        //     })
        //     setFilteredList(updatedList)
        // }
        // let myImg  = document.getElementById("snapshot")
        // myImg.src = props.dataUrl
        return (
        <div className="snap-modal">
        <div className="snap-modal-content">
            {/* <h1 className="mt-3 text-lg font-bold">Snapshot</h1> */}
            <button className="modal-button" onClick={props.onClose}>
                X
            </button>
            <div className="modal-body mt-0">


                <img className="w-full" src={props.dataUrl[0]} id="snapshot"/>
                <div className=" flex items-center justify-items-center">
                <button onClick={(e)=>{downloadImage(e)}} className="text-white rounded-sm bg-green-500 p-2 ml-auto mr-auto">Download</button>
                </div>
            </div >
        </div>
    </div>
        );
    }
}