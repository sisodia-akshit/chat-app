import { useNavigate } from "react-router-dom"
import "../../Styles/Ui.css"

function Error({ error }) {
    const navigate = useNavigate();
    if (error.code === "ERR_NETWORK") {
        return (
            <div className='networkError'>
                <h1>Server unavailable!</h1>
                <p>We’re having trouble reaching our servers.</p>
                <p style={{ color: "#555" }}>Please try again later.</p>
            </div>
        )
    }
    if (error.status === 401) {
        navigate("/auth")
        return
    }

    return (
        <>
            {/* <h1 style={{ margin: "0 auto", textAlign: "center" }}></h1> */}
            <p style={{ margin: "0 auto", textAlign: "center" }}>{error.message}</p>
        </>
    )
}

export default Error