// import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { useState } from "react";
import { FaFastBackward, FaFastForward } from "react-icons/fa";
import { FaPlay } from "react-icons/fa";
export default function Modal(props) {
  if (!props.show) {
    return null;
  } else {
    return (
      <div className="modal">
        <div className="modal-content">
          <div className="modal-body">
            <div className="items-center videoContainer">
              <video controls id='video' autoPlay src={props.videoURL}>Earth says hello!
              </video>
            </div>

          </div>
          <button className="modal-button" onClick={props.onClose}>
            X
          </button>

        </div>
      </div>
    );
  }
}