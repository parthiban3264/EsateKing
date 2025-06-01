import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./profileUpdatePage.scss";
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import UploadWidget from "../../components/uploadWidget/UploadWidget.jsx";

function ProfileUpdatePage() {
  const { updateUser, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { userName, email, password } = Object.fromEntries(formData);

    try {
      const res = await apiRequest.put(`/users/${currentUser.id}`, {
        userName,
        email,
        password,
        avatar: avatar[0], // use first image if multiple
      });
      updateUser(res.data);
      navigate("/profile");
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="profileUpdatePage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Update Profile</h1>
          <div className="item">
            <label htmlFor="userName">Username</label>
            <input
              id="userName"
              name="userName"
              type="text"
              defaultValue={currentUser.userName}
            />
          </div>
          <div className="item">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={currentUser.email}
            />
          </div>
          <div className="item">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" />
          </div>
          <button>Update</button>
          {error && <span className="error">{error}</span>}
        </form>
      </div>

      <div className="sideContainer">
        {avatar.length > 0
          ? avatar.map((img, index) => (
              <img key={index} src={img} alt="avatar" className="avatar" />
            ))
          : currentUser.avatar && (
              <img src={currentUser.avatar} alt="avatar" className="avatar" />
            )}

        <UploadWidget
          uwConfig={{
            cloudName: "dpe6migai", // your Cloudinary cloud name
            uploadPreset: "estate", // your upload preset
            folder: "avatars",
            multiple: true,
            cropping: true,
            sources: ["local", "camera", "url"],
          }}
          setStatus={setAvatar}
          setPublicId={() => {}}
        />
      </div>
    </div>
  );
}

export default ProfileUpdatePage;
