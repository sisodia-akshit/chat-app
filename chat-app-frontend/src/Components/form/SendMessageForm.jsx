import { useMutation, useQuery } from "@tanstack/react-query";
import "../../Styles/Form.css"
import { useEffect, useRef, useState } from "react";
import { sendPrivateMessage } from "../../Services/MessageAPI";
import { FaArrowRight, FaImage, FaMicrophone, FaPaperclip, FaPause, FaPlus, FaVideo } from "react-icons/fa";
import { useUploadMutation } from "../../Hooks/useMutation";
import socket from "../../Lib/socket";
import { decryptMessage, encryptMessage } from "../../Hooks/useEncryptMessage";
import { getUserById } from "../../Services/userAPI";
import { useAuth } from "../../Context/AuthContext";



function SendMessageForm({ id, receiver, chatId, content, setContent }) {
    const { me } = useAuth();
    const [openFiles, setOpenFiles] = useState(false);
    const [files, setFiles] = useState(null);
    const [startRecord, setStartRecord] = useState(false);

    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);
    const chunksRef = useRef([]);

    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState("");
    const [audioFile, setAudioFile] = useState(null);
    const [seconds, setSeconds] = useState(0);



    const uploadMutation = useUploadMutation({ setFiles })

    //!recording Logic
    const startRecording = async () => {
        try {
            setStartRecord(true)
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
        if (isRecording) stopRecording();

        const formData = new FormData();
        formData.append("files", audioFile);

        uploadMutation.mutate({ id: chatId, files: formData });
        setAudioUrl("")
        setStartRecord(false)
    };

    //!recording Logic

    const onContentChangeHandler = (e) => {
        setContent(e.target.value);

    }

    const fileInputHandler = (e) => {
        const files = e.target.files;
        const formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]); // same key "file"
        }
        // formData.append("content", content)
        setFiles(formData)


        // preview files logic
        const preview = document.getElementById("preview");
        for (let file of files) {
            const url = URL.createObjectURL(file);

            if (file.type.startsWith("image/")) {
                const img = document.createElement("img");
                img.src = url;
                img.classList.add("preview-container");
                preview.appendChild(img);
                setOpenFiles(false)
            } else if (file.type.startsWith("video/")) {
                const video = document.createElement("video");
                video.src = url;
                video.controls = true;
                video.classList.add("preview-container");
                preview.appendChild(video);
                setOpenFiles(false)
            }
            else {
                const div = document.createElement("div");
                div.innerHTML = `📄 ${file.name}`;
                div.classList.add("preview-files-container");
                preview.appendChild(div);
                setOpenFiles(false)

            }
        }
    }

    const onSubmitHandler = (e) => {
        e.preventDefault();
        if (!content && !files) return

        if (files) {
            uploadMutation.mutate({
                id: chatId,
                files
            })
        } else {
            const receiverPublicKey = receiver?.publicKey;
            const { encrypted, nonce } = encryptMessage(content, localStorage.getItem("privateKey"), receiverPublicKey);
            
            socket.emit("sendMessage", {
                chatId,
                receiverId: id,
                senderId: me?._id,
                content: encrypted,
                nonce,
            })

            setContent("")
        }
        document.getElementById("preview").innerHTML = "";
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            onSubmitHandler(e)
        }
    };

    useEffect(() => {
        let interval;
        if (isRecording) {
            interval = setInterval(() => {
                setSeconds(prev => prev + 1);
            }, 1000);
        } else {
            clearInterval(interval);
            setSeconds(0);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    return (
        <form className="sendMessageForm" onSubmit={onSubmitHandler}>
            {/* previews  */}
            <div id="preview">
            </div>
            <div id="preview-file">
            </div>
            {audioUrl && <audio controls src={audioUrl}></audio>}

            {/* sending logic  */}
            <div className="sendMessageForm-main" >
                {!startRecord && <div className="sendMessageForm-inputs">
                    {openFiles && <div className="sendMessageForm-file-inputs">

                        {/* input 1 */}
                        <label htmlFor="file" className="sendMessageForm-file-input" onClick={() => document.getElementById('fileInput').click()}>
                            <FaPaperclip /> Document
                            <input type="file" multiple id="fileInput" onChange={fileInputHandler} />
                        </label>
                        <label htmlFor="file" className="sendMessageForm-file-input" onClick={() => document.getElementById('mediaInput').click()} >
                            <FaImage /> Photos
                            <input type="file" accept="image/*" multiple id="mediaInput" onChange={fileInputHandler} />
                        </label>
                        <label htmlFor="file" className="sendMessageForm-file-input" onClick={() => document.getElementById('videoInput').click()} >
                            <FaVideo /> Videos
                            <input type="file" accept="video/*" multiple id="videoInput" onChange={fileInputHandler} />
                        </label>

                    </div>}
                    <button type="button" className="sendMessageForm-files-button" onClick={() => setOpenFiles(prev => prev === false ? true : false)}><FaPlus color="#333" /></button>
                    <textarea type="text" className="sendMessageForm-input" rows={1} value={content} onKeyDown={handleKeyDown} onChange={onContentChangeHandler} placeholder="Type here..." />
                    <button className="sendMessageForm-audio-button" onClick={() => { setStartRecord(true); startRecording(); }}><FaMicrophone color="#333" /></button>
                </div>}
                {!startRecord && <button type="submit" className="sendMessageForm-send-button" disabled={uploadMutation.isPending}>
                    {!uploadMutation.isPending && <FaArrowRight color="#fff" />}
                    {uploadMutation.isPending && <div className="loader"></div>}
                </button>}

                {/* Audio  */}
                {startRecord && <div className="sendMessageForm-recording-inputs">
                    <button className="sendMessageForm-audio-button" onClick={stopRecording} disabled={!isRecording}><FaPause /></button>
                    {isRecording && <div>Recording: {seconds}s</div>}
                </div>}
                {startRecord && <button type="button" onClick={sendRecording} className="sendMessageForm-send-button" disabled={uploadMutation.isPending && !audioFile}>
                    {!uploadMutation.isPending && <FaArrowRight color="#fff" />}
                    {uploadMutation.isPending && <div className="loader"></div>}
                </button>}
            </div>

        </form>
    )
}

export default SendMessageForm