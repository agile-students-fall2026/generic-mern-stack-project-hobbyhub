import{useState} from "react"
import {Link} from "react-router-dom"
import "./ProfileSettings.css"
const API_BASE = "http://localhost:3000"

const ProfileSettings = ({user, onUpdateUser}) => {
    const[activeSection, setActiveSection] = useState(null)
    const[firstName, setFirstName] = useState(user.name.first)
    const[lastName, setLastName] = useState(user.name.last)
    const[username, setUsername] = useState(user.login.username)
    const[hobby, setHobby] = useState("")
    const[pictureLoading, setPictureLoading] = useState(false)
    const[pictureError, setPictureError] = useState("")
    const[settingsError, setSettingsError] = useState("")
    const[pictureFile, setPictureFile] = useState(null)

    const hobbies = user.hobbies || [] 
    const privacy = user.privacy || "public"
    const pictureSrc = user.picture.large.startsWith("/")
        ? `${API_BASE}${user.picture.large}`
        : user.picture.large
    
    const updateProfile = async(url, method, body) => {
        const options = {
            method: method,
        }

        if(body !== undefined){
            options.headers = {
                "Content-Type": "application/json",
            }
            options.body = JSON.stringify(body)
        }
        const response = await fetch(`${API_BASE}${url}`, options)
        const data = await response.json()
        if(!response.ok){
            throw new Error(data.error || "Unable to save changes")
        }
        onUpdateUser(data)
        return data
    }

    const privacyEdit = async event => {
        const selectedPrivacy = event.target.value
        setSettingsError("")
        try{
            await updateProfile(
                "/api/profile/privacy",
                "POST",
                { privacy: selectedPrivacy }
            )
        } catch (error) {
            setSettingsError(error.message)
        }
    }
    
    const profileSave = async event => {
        event.preventDefault()
        setSettingsError("")
        try{
            await updateProfile(
                "/api/profile/edit",
                "POST",
                {
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    username: username.trim(),
                }
            )
            setActiveSection(null)
        } catch (error){
            setSettingsError(error.message)
        }
    }

    const addHobby = async event => {
        event.preventDefault()
        setSettingsError("")
        const newHobby = hobby.trim()
        if(!newHobby){
            setSettingsError("Please enter a hobby")
            return
        }
        try{
            await updateProfile(
                "/api/profile/hobbies",
                "POST",
                {hobby: newHobby}
            )
            setHobby("")
        } catch (error) {
            setSettingsError(error.message)
        }
    }

    const removeHobby = async hobbyToRemove => {
        setSettingsError("")
        try{
            await updateProfile(
                `/api/profile/hobbies/${encodeURIComponent(hobbyToRemove)}`,
                "DELETE"
            )
        } catch (error){
            setSettingsError(error.message)
        }
    }

    const picChange = async () => {
        if(!pictureFile){
            setPictureError("Please choose an image")
            return
        }
        setPictureLoading(true)
        setPictureError("")
        try{
            const formData = new FormData()
            formData.append("picture", pictureFile)
            const response = await fetch(
                `${API_BASE}/api/profile/picture`,
                {
                    method: "POST",
                    body: formData,
                }
            )
            const data = await response.json()
            if(!response.ok){
                throw new Error(data.error || "Unable to upload picture")
            }
            onUpdateUser(data)
        } catch (error) {
            setPictureError(error.message)
        } finally {
            setPictureLoading(false)
        }
    }

    return (
        <main className="settings-page">
            <header className="settings-header">
                <Link to="/profile" className="settings-back">
                    Back
                </Link>
                <h1 className="settings-title">Profile Settings</h1>
            </header>

            <div className="settings-content">
                {settingsError && (
                    <p className="settings-error">
                        {settingsError}
                    </p>
                )}
                <fieldset className="settings-privacy">
                    <legend className="settings-section-title">Privacy</legend>
                    <label className="settings-privacy-option">
                        <input
                            type="radio"
                            name="privacy"
                            value="public"
                            checked={privacy === "public"}
                            onChange={privacyEdit}
                        />
                        <span className="settings-privacy-text">
                            <strong>Public</strong>
                            <span>Your profile, posts and hobbies can be viewed by anyone</span>
                        </span>
                    </label>

                    <label className="settings-privacy-option">
                        <input
                        type="radio"
                        name="privacy"
                        value="private"
                        checked={privacy === "private"}
                        onChange={privacyEdit}
                        />
                        <span className="settings-privacy-text">
                            <strong>Private</strong>
                            <span>You can only be viewed by accepted people</span>
                        </span>
                    </label>
                </fieldset>

                <section className="settings-menu">
                    <button
                    type="button"
                    className="settings-menu-button"
                    onClick={()=> setActiveSection("edit")}
                    >
                        <span className="settings-menu-icon">✎</span>
                        <span>Edit profile</span>
                        <span className="settings-menu-arrow">›</span>
                    </button>
                    <button
                        type="button"
                        className="settings-menu-button"
                        onClick={()=> setActiveSection("hobbies")}
                        >
                            <span className="settings-menu-icon">+</span>
                            <span>Manage hobbies</span>
                            <span className="settings-menu-arrow">›</span>
                        </button>
                        <button
                            type="button"
                            className="settings-menu-button"
                            onClick={() => setActiveSection("picture")}
                        >
                            <span className="settings-menu-icon">▣</span>
                            <span>Change profile picture</span>
                            <span className="settings-menu-arrow">›</span>
                        </button>
                </section>
                
                {activeSection === "edit" && (
                    <form className="settings-panel" onSubmit={profileSave}>
                        <h2 className ="settings-panel-title">Edit Profile</h2>
                        <label className="settings-label" htmlFor="first-name">
                            FirstName
                        </label>
                        <input
                            className="settings-input"
                            id="first-name"
                            value={firstName}
                            onChange={event => setFirstName(event.target.value)}
                            required
                        />
                        <label className="settings-label" htmlFor="last-name">
                            Last Name
                        </label>
                        <input
                            className="settings-input"
                            id="last-name"
                            value={lastName}
                            onChange={event => setLastName(event.target.value)}
                            required
                        />
                        <label className ="settings-label" htmlFor="username">
                            Username
                        </label>
                        <input
                            className="settings-input"
                            id="username"
                            value={username}
                            onChange={event => setUsername(event.target.value)}
                            required
                        />
                        <button className="settings-save-button" type ="submit">
                            Save Changes
                        </button>
                    </form>
                )}

                {activeSection === "hobbies" && (
                    <section className="settings-panel">
                       <h2 className="settings-panel-title">Manage Hobbies</h2>
                       <form onSubmit={addHobby}>
                            <label className="settings-label" htmlFor="new-hobby">
                                Add a Hobby
                            </label>
                            <input
                                className="settings-input"
                                id="new-hobby"
                                value={hobby}
                                onChange={event => setHobby(event.target.value)}
                                placeholder="Enter a hobby"
                            />
                            <button className="settings-save-button" type="submit">
                                Add Hobby
                            </button>
                       </form>
                       <ul className="settings-hobby-list">
                        {hobbies.map(item=>(
                          <li className="settings-hobby-item" key={item}>
                             <span>{item}</span>
                             <button
                                className="settings-remove-button"
                                type="button"
                                onClick={() => removeHobby(item)}
                                aria-label={`Remove ${item}`}
                            >
                                Remove
                            </button>
                          </li>
                        ))}
                       </ul>
                    </section>
                )}
                {activeSection === "picture" && (
                    <section className="settings-panel">
                        <h2 className="settings-panel-title">
                            Change profile picture
                        </h2>
                        <img
                            className="settings-profile-picture"
                            src={pictureSrc}
                            alt="Current profile"
                        />
                        <label className="settings-label" htmlFor="profile-picture-file">
                            Choose a new profile picture
                        </label>
                        <input
                            id="profile-picture-file"
                            className="settings-input"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={event => {
                                setPictureFile(event.target.files[0] || null)
                            }}
                        />
                        <button
                            className="settings-save-button"
                            type="button"
                            onClick={picChange}
                            disabled={pictureLoading || !pictureFile}
                        >
                            {pictureLoading ? "Loading..." : "Upload Picture"}
                        </button>
                        {pictureError && (
                            <p className="settings-error">{pictureError}</p>
                        )}
                    </section>
                )}
            </div>

            <nav className="settings-navigation" aria-label="Main navigation">
                <Link to="/feed" className="settings-nav-item">
                        Feed
                </Link>
                <Link to="/discover" className="settings-nav-item">
                        Discover
                </Link>
                <Link to="/following" className="settings-nav-item">
                        Following
                </Link>
                <Link to="/map" className="settings-nav-item">
                        Map
                </Link>
                <Link to="/profile" className="settings-active-nav">
                        Profile
                </Link>
            </nav>
        </main>
    )
}

export default ProfileSettings