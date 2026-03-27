import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import "../../Styles/Ui.css"
import { getUserById } from '../../Services/userAPI'
import { FaHand } from 'react-icons/fa6'
import { FaHandPointLeft } from 'react-icons/fa'
import { sendPrivateMessage } from '../../Services/MessageAPI'
import { useNavigate } from 'react-router-dom'
import ProfileUserDetails from '../common/ProfileUserDetails'
import ButtonFirstMessage from '../common/ButtonFirstMessage'

function Profile({ id }) {

    const { data, isLoading, error } = useQuery({
        queryKey: ["user"],
        queryFn: () => getUserById(id)
    })
    const user = data?.data ?? {};

    return (
        <div className="profile">
            <ProfileUserDetails user={user} />
            <ButtonFirstMessage id={id} user={user}>
                Say Hello&nbsp; <FaHand />
            </ButtonFirstMessage>
        </div>
    )
}

export default Profile