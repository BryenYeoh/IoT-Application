import React from "react";
import ConstantProgressBar from "./ConstantProgressBar";
import VideoStream from "./Video";
import { Modal } from "@mui/joy";

const VideoPopup = ({ open, handleClose }) => {
  return (
    <Modal open={open} onClose={handleClose} disableBackdropClick={true}>
      <div className="popup">
        <div>
          <ConstantProgressBar />
          <VideoStream />
        </div>
      </div>
    </Modal>
  );
};

export default VideoPopup;
