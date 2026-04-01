import { useRef, useState } from "react";

export default function AudioRecorder() {
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [audioFile, setAudioFile] = useState(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const file = new File([blob], `recording-${Date.now()}.webm`, {
          type: "audio/webm",
        });

        setAudioFile(file);
        setAudioUrl(URL.createObjectURL(blob));

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Microphone access error:", error);
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const sendRecording = async () => {
    if (!audioFile) return;

    const formData = new FormData();
    formData.append("files", audioFile);

    try {
      const res = await fetch("/api/v0/uploads", {
        method: "POST",
        body: formData,
      });

      await res.json();
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div>
      <button onClick={startRecording} disabled={isRecording}>
        Start
      </button>

      <button onClick={stopRecording} disabled={!isRecording}>
        Stop
      </button>

      <button onClick={sendRecording} disabled={!audioFile}>
        Send
      </button>

      {audioUrl && <audio controls src={audioUrl}></audio>}
    </div>
  );
}
