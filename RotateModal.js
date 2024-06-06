import React from "react";
export default function RotateModal(props) {

    if (!props.showRotate) {
        return null;
    } else {
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
        return (
            <div className="rotate-modal">
                <div className="rotate-modal-content">
                    <h1 className="mt-12 text-lg font-bold">Enter Time in Seconds</h1>
                    <button className="rotate-modal-button" onClick={props.onClose}>
                        X
                    </button>
                    <input id="rotate-input" type="number"/>
                  
                    <button onClick={()=>{
                        if(document.getElementById("rotate-input").value)
                        props.setRotate(parseInt(document.getElementById("rotate-input").value))
                        props.onClose()
                    }} className="mt-3 text-white rounded-sm bg-green-500 p-2 ml-auto mr-8">Set Rotate</button>

                </div>
            </div>
        );
    }
}