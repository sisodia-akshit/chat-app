import { useParams } from 'react-router-dom'
import Layout from '../Components/layout/Layout'
import Profile from '../Components/ui/Profile'

function SingleUser() {
  const { id } = useParams()
  return (
    <Layout>
      <Profile id={id} />
    </Layout>
  )
}

export default SingleUser