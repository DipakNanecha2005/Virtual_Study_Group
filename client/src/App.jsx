import { Children, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import Chat from "./pages/chat";
import Profile from "./pages/profile";
import { useAppStore } from "./store";
import { apiClient } from "./lib/api-client";
import { GET_USER_INFO_ROUTE } from "./utils/constants";

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  // console.log({ userInfo });
    
  const isAuthenticated = !!userInfo;
  // console.log({ isAuthenticated });
  
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
  // return isAuthenticated ? <Navigate to="/profile" /> : children; // testing
};

const App = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await apiClient.get(GET_USER_INFO_ROUTE, {
          withCredentials: true,
        });
        // console.log({ response: res });
        if (res.status === 200 && res.data.id) {
          setUserInfo(res.data);
        } else {
          setUserInfo(undefined);
        }
      } catch (error) {
        console.log("error in getuserData:", error); 
        // setUserInfo(undefined);
        
      } finally {
        setLoading(false);
      }
    };
    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }

  }, [userInfo, setUserInfo]);
  
  if (loading) {
    return <div>Loading....</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        ></Route>
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        ></Route>
        {/* <Route
          path="/chat"
          element={
            <Test
              userId="6802927eafcfdfdfa12d0e3b"
              chatId="680723cfd3d05fa9d2126e25"
              username="dipak"
              avatarUrl="https://avatar.iran.liara.run/public/boy?username=dipak"
            />
          }
        ></Route> */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        ></Route>
        <Route path="*" element={<Navigate to="/auth" />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
