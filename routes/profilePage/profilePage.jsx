import { useNavigate,Link, useLoaderData, Await } from "react-router-dom";
import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import apiRequest from "../../lib/apiRequest";
import "./profilePage.scss";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Suspense } from "react";
// import Card from "../../components/card/Card";

function ProfilePage() {
  const data = useLoaderData();

  const { updateUser, currentUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Information</h1>
            <Link to="/profile/update">
              <button>Update Profile</button>
            </Link>
          </div>
          <div className="info">
            <span>
              Avatar:
              <img
                src={
                  currentUser?.avatar ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCR7BsnNrK4DxWg0_NFUQ7U2pQK_ewWHUBmQ&s"
                }
                alt="avatar"
              />
            </span>
            <span>
              Username: <b>{currentUser?.userName}</b>
            </span>
            <span>
              E-mail: <b>{currentUser?.email}</b>
            </span>
            <button onClick={handleLogout}>Logout</button>
          </div>
          <div className="title">
            <h1>My List</h1>
            <Link to="/add">
            <button>Create New Post</button>
            </Link>
          </div>
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.postRespones}
              errorElement={<p>Error Loading Posts!</p>}
            >
              {(postRespones) => (
                <>
                  <List posts = {postRespones.data.userPosts} />
                </>
              )}
            </Await>
          </Suspense>
          <div className="title">
            <h1>Saved List</h1>
          </div>
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.postRespones}
              errorElement={<p>Error Loading Posts!</p>}
            >
              {(postRespones) => (
                <>
                  <List posts = {postRespones.data.savedPosts} />
                </>
              )}
            </Await>
          </Suspense>
        </div>
      </div>
      <div className="chatContainer">
        <div className="wrapper">
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.chatRespones}
              errorElement={<p>Error Loading Chats!</p>}
            >
              {(chatRespones) => (
                <>
                  <Chat chats = {chatRespones.data} />
                </>
              )}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
