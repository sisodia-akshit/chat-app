import "../../Styles/Ui.css"
import SendMessageCard from '../cards/SendMessageCard'
import ReceiveMessageCard from '../cards/ReceiveMessageCard'
import { useAuth } from '../../Context/AuthContext'
import { useEffect, useRef, useState } from "react"
import { NavLink } from "react-router-dom"
import { FaX, FaXmark } from "react-icons/fa6"
import { FaCheck, FaCheckDouble } from "react-icons/fa"


function Messages({ id, content, messages }) {
    const bottomRef = useRef(null);

    const [imageLink, setImageLink] = useState(null)

    const { me } = useAuth();

    useEffect(() => {
        bottomRef?.current?.scrollIntoView({ behavior: "smooth" });
    }, [content, id]);

    const imageButtonClicked = (data) => {
        setImageLink(data)
    }


    // if (isLoading) return <div className="loading">loading...</div>
    return (
        <>
            {imageLink && <div className="messages-image-open">
                <button className="messages-image-close" onClick={() => setImageLink(null)}>
                    <FaXmark />
                </button>
                <img src={imageLink} alt="image" />
            </div>}
            
            <div ref={bottomRef} />
            {messages.length > 0 && messages.map((curr, i) => {
                if (curr?.sender === me?._id) {

                    return (
                        <div key={curr._id} className="messages-send">
                            <ul className="messages-media-list">
                                {curr?.files?.length > 0 &&
                                    curr?.files.map((obj, i) => {
                                        if (obj?.type?.startsWith("application/")) {
                                            return (
                                                <li className="pdf-container" key={i}>
                                                    <NavLink to={obj.url} alt={obj.name} className="pdf-container-link"><span>📄{obj.name}</span><p>{obj.type}</p> </NavLink>
                                                </li>
                                            )
                                        }
                                        if (obj?.type?.startsWith("video/")) {
                                            return (
                                                <li className="pdf-container" key={i}>
                                                    <video src={obj?.url} alt={obj?.name} controls />
                                                </li>
                                            )
                                        }
                                        if (obj?.type?.startsWith("audio/")) {
                                            return (
                                                <li className="pdf-container" key={i}>
                                                    <audio src={obj?.url} alt={obj?.name} controls />
                                                </li>
                                            )
                                        }
                                        return (
                                            <li key={i} className="pdf-container">
                                                <button type="button" onClick={() => imageButtonClicked(obj?.url)} className="messages-image-container" >
                                                    <img src={obj?.url} alt={obj?.name} className="messages-media-img" />
                                                </button>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                            {curr.content && <div className="messages-send-container">
                                < SendMessageCard message={curr?.content} seen={curr.seen} />
                                <FaCheckDouble className="not-seen" color={curr.seen ? "#00d0ff" : ""} />
                            </div>}
                        </div >
                    )
                }
                else {
                    return (<div key={curr._id} className="messages-receive" >
                        <ul className="messages-media-list">
                            {curr?.files?.length > 0 &&
                                curr?.files.map((obj, i) => {
                                    if (obj?.type?.startsWith("application/")) {
                                        return (
                                            <li className="pdf-container" key={i}>
                                                <NavLink to={obj.url} alt={obj.name} className="pdf-container-link"><span>📄{obj.name}</span><p>{obj.type}</p> </NavLink>
                                            </li>
                                        )
                                    }
                                    if (obj?.type?.startsWith("video/")) {
                                        return (
                                            <li className="pdf-container" key={i}>
                                                <video src={obj?.url} alt={obj?.name} controls />
                                            </li>
                                        )
                                    }
                                    if (obj?.type?.startsWith("audio/")) {
                                        return (
                                            <li className="pdf-container" key={i}>
                                                <audio src={obj?.url} alt={obj?.name} controls />
                                            </li>
                                        )
                                    }
                                    return (
                                        <li key={i} className="pdf-container">
                                            <button type="button" onClick={() => imageButtonClicked(obj?.url)} className="messages-image-container">
                                                <img src={obj?.url} alt={obj?.name} className="messages-media-img" />
                                            </button>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                        {curr.content &&
                            <ReceiveMessageCard message={curr?.content} />
                        }
                    </div>
                    )
                }
            })}

        </>
    )
}

export default Messages