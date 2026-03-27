// import { useRef, useState } from "react";

export default function AudioRecorder({ stopRecording, isRecording }) {

    return (
        <div>
            {/* <button onClick={startRecording} disabled={isRecording}>
                Start
            </button> */}

            <button onClick={stopRecording} disabled={!isRecording}>
                Stop
            </button>

            {/* <button onClick={sendRecording} disabled={!audioFile}>
                Send
            </button> */}

        </div>
    );
}
