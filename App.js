import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar"
import India from "./VidsMap/India";
function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const checkUserToken = () => {
        const userToken = localStorage.getItem('user-token');
        if (!userToken || userToken === 'undefined') {
            setIsLoggedIn(false);
        }
        setIsLoggedIn(true);
    }
    useEffect(() => {
        checkUserToken();
    }, [isLoggedIn]);
 
    return (
        <React.Fragment>
            <Navbar/>
            <India/>
        </React.Fragment>
    );
}
export default App;
