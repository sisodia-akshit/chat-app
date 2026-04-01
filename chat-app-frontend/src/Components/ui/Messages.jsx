import "../../Styles/Ui.css"
import SendMessageCard from '../cards/SendMessageCard'
import ReceiveMessageCard from '../cards/ReceiveMessageCard'
import { useAuth } from '../../Context/AuthContext'
import { useEffect, useRef, useState } from "react"
import { FaXmark } from "react-icons/fa6"
import { FaCheckDouble } from "react-icons/fa"
import FilePreview from "./FilePreview"


function Messages({ id, receiver, content, messages }) {
    const bottomRef = useRef(null);

    const [imageLink, setImageLink] = useState(null)

    const { me } = useAuth();

    useEffect(() => {
        bottomRef?.current?.scrollIntoView({ behavior: "smooth" });
    }, [content, id]);

    const imageButtonClicked = (data) => {
        setImageLink(data)
    }

    return (
        <>

            <div ref={bottomRef} />

            {messages.length > 0 && messages.map((curr, i) => {
                if (curr?.sender === me?._id) {

                    return (
                        <div key={curr._id} className="messages-send">
                            {/* load file  */}
                            <ul className="messages-media-list">
                                {curr?.files?.length > 0 &&
                                    curr?.files.map((obj, i) => {
                                        return (
                                            <li className="pdf-container" key={i}>
                                                < FilePreview file={obj} senderPublicKey={receiver.publicKey} imageButtonClicked={imageButtonClicked} />
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                            {/* load message  */}
                            {curr.content && <div className="messages-send-container">
                                < SendMessageCard receiver={receiver} nonce={curr?.nonce} message={curr?.content} />
                                <FaCheckDouble className="not-seen" color={curr.seen ? "#00d0ff" : ""} />
                            </div>}
                        </div >
                    )
                }
                else {
                    return (<div key={curr._id} className="messages-receive" >
                        {/* load media receiver */}
                        <ul className="messages-media-list">
                            {curr?.files?.length > 0 &&
                                curr?.files.map((obj, i) => {
                                    return (
                                        <li className="pdf-container" key={i}>
                                            < FilePreview file={obj} senderPublicKey={receiver.publicKey} imageButtonClicked={imageButtonClicked} />
                                        </li>
                                    )
                                })
                            }
                        </ul>
                        {/* load message receiver  */}
                        {curr.content &&
                            <ReceiveMessageCard sender={receiver} nonce={curr?.nonce} message={curr?.content} />
                        }
                    </div>
                    )
                }
            })}

            {/* open image model */}
            {imageLink &&
                <div className="messages-image-open">
                    <button className="messages-image-close" onClick={() => setImageLink(null)}>
                        <FaXmark />
                    </button>
                    <img src={imageLink} alt="image" />
                </div>
            }

        </>
    )
}

export default Messages