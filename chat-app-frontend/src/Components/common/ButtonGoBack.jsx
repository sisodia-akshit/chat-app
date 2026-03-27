import { FaArrowLeft } from "react-icons/fa"

function ButtonGoBack() {
    const buttonClickedHandler = () => {
        history.go(-1)
    }
    return (
        <button type="button" className="buttonGoBack" onClick={buttonClickedHandler}>
            <FaArrowLeft color="#000" className="buttonGoBack-icon" />
        </button>
    )
}

export default ButtonGoBack