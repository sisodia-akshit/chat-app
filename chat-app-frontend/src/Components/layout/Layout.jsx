import Sidebar from './Sidebar'
import Header from './Header'
import "../../Styles/Layout.css"
import DarkBackground from './DarkBackground'
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

function Layout({ children }) {
    const queryClient = useQueryClient();

    useEffect(() => {
        queryClient.setQueryData(["unread"], {});
    }, []);

    useEffect(() => {
        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);

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