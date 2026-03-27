import React from 'react'

function ProfileUserDetails({ user }) {
    return (
        <>
            <img src={user.photo ? user.photo : "https://i.pinimg.com/736x/62/01/0d/62010d848b790a2336d1542fcda51789.jpg"} alt="" className="profile-image" />
            <h2 className="profile-name">{user?.name}</h2>
            <h3 className="profile-email">{user?.email}</h3>
        </>
    )
}

export default ProfileUserDetails