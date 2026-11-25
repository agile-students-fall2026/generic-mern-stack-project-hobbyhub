import { useEffect, useState } from "react"
import{BrowserRouter as Router, Navigate, Route, Routes,} from "react-router-dom"
import Profile from "./components/Profile"
import ProfileSettings from "./components/ProfileSettings"
import Chat from "./components/Chat"
import Discover from "./discover/Discover"
import HobbyDetail from "./discover/HobbyDetail"
import EventDetail from "./discover/EventDetail"
import Login from "./login/Login"
import CreateAccount from "./login/CreateAccount"
import Feed from "./Feed/Feed"
import Following from "./Feed/Following"
import CreatePost from "./Feed/CreatePost"
import CreateEvent from "./Feed/CreateEvent"
import Map from "./map/Map"
import MyHobbies from "./myHobbies/MyHobbies"
import './App.css'
import AppLayout from "./layout/AppLayout"

const App = () => {
  const[user, setUser] = useState(null)
  const [profileError, setProfileError] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => sessionStorage.getItem("hobbyhubLoggedIn") === "true"
  )
  
  useEffect(() => {
    fetch("http://localhost:3000/api/profile")
      .then(response => {
        if(!response.ok){
          throw new Error("Failed to load profile")
        }
        return response.json()
      })
      .then(data => setUser(data))
      .catch(error => {
        console.error(error)
        setProfileError(true)
      })
    }, [])
  return(
    <Router>
            <Routes>
        <Route path="/" element={<Navigate to={isLoggedIn ? "/feed" : "/login"} replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
          
        <Route path="/chat" 
        element={
          isLoggedIn ? (
            <Chat />
          ) : (
            <Navigate to="/login" replace />
           )
         }
       />
        <Route
          path="/profile/settings"
          element={
            !isLoggedIn ? (
                <Navigate to="/login" replace />
            ) : user ? (
              <ProfileSettings 
                user={user}
                onUpdateUser={setUser} 
              />
            ) : (
              <p>
                {profileError
                ? "Unable to load profile."
                : "Loading profile..."}
              </p>
            )
          }
        />
        
        <Route element={<AppLayout isLoggedIn={isLoggedIn />}>
          <Route
            path="/profile"
            element={
                !isLoggedIn ? (
                    <Navigate to="/login" replace />
              ) : (
                <Profile user={user} /> 
            ) : (
               <p> 
                {profileError
                ? "Unable to load profile."
                : "Loading profile..."}
                </p>
              )
            }
          />
          <Route path="/feed" element={<Feed />} />
          <Route path="/following" element={<Following />} />
          <Route path="/create-post"element={isLoggedIn ? <CreatePost /> : <Navigate to="/login" replace />}/>
          <Route path="/create-event" element={isLoggedIn ? <CreateEvent /> : <Navigate to="/login" replace />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/hobbies/:id" element={<HobbyDetail />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/map" element={<Map />} />
          <Route path="/my-hobbies" element={isLoggedIn ? <MyHobbies /> : <Navigate to="/login" replace />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App