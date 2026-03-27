import Sidebar from './Sidebar'
import Header from './Header'
import "../../Styles/Layout.css"
import DarkBackground from './DarkBackground'

function Layout({ children }) {
    return (
        <div className="layout">
            <DarkBackground />
            <Sidebar />
            <Header />
            <div className="layout-content">
                {children}
            </div>
        </div>
    )
}

export default Layout