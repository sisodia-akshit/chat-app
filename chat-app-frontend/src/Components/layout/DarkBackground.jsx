import React from 'react'

function DarkBackground() {
    const buttonClickedHandler=()=>{
        document.getElementById("sidebar").style.transform ="translate(-260px)"
        document.getElementById("darkBackground").style.display ="none"
    }
    return (
        <button type='button' className='darkBackground' id='darkBackground' onClick={buttonClickedHandler}></button>
    )
}

export default DarkBackground