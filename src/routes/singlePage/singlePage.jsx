import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { useLoaderData, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";

function SinglePage() {
  const post = useLoaderData();
  const [saved, setSaved] = useState(post.isSaved);
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  if (!post) return <div>Loading...</div>;

  const formatDistance = (value) => {
    return value > 999 ? `${(value / 1000).toFixed(1)} km` : `${value} m`;
  };

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (saved) return;

    setSaved(true);

    try {
      await apiRequest.post("/users/save", {
        userId: currentUser.id,
        postId: post.id,
      });
    } catch (err) {
      console.error(err);
      setSaved(false); // Rollback on failure
    }
  };

  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="Location pin" />
                  <span>{post.address}</span>
                </div>
                <div className="price">${post.price}</div>
              </div>
              <div className="user">
                <img src={post.user?.avatar || "/default-avatar.png"} alt="User avatar" />
                <span>{post.user?.userName || "Unknown User"}</span>
              </div>
            </div>
            <div
              className="bottom"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.postDetail?.desc || ""),
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="features">
        <div className="wrapper">
          <p className="title">General</p>
          <div className="listVertical">
            <div className="feature">
              <img src="/utility.png" alt="Utility icon" />
              <div className="featureText">
                <span>Utilities</span>
                <p>
                  {post.postDetail?.utilities === "owner"
                    ? "Owner is responsible"
                    : "Tenant is responsible"}
                </p>
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="Pet icon" />
              <div className="featureText">
                <span>Pet Policy</span>
                <p>
                  {post.postDetail?.pet === "allowed"
                    ? "Pets Allowed"
                    : "Pets Not Allowed"}
                </p>
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="Fee icon" />
              <div className="featureText">
                <span>Income Policy</span>
                <p>{post.postDetail?.income || "Not specified"}</p>
              </div>
            </div>
          </div>

          <p className="title">Sizes</p>
          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="Size icon" />
              <span>{post.postDetail?.size} sqft</span>
            </div>
            <div className="size">
              <img src="/bed.png" alt="Bed icon" />
              <span>{post.bedroom} beds</span>
            </div>
            <div className="size">
              <img src="/bath.png" alt="Bath icon" />
              <span>{post.bathroom} bathroom</span>
            </div>
          </div>

          <p className="title">Nearby Places</p>
          <div className="listHorizontal">
            <div className="feature">
              <img src="/school.png" alt="School icon" />
              <div className="featureText">
                <span>School</span>
                <p>{formatDistance(post.postDetail?.school)} away</p>
              </div>
            </div>
            <div className="feature">
              <img src="/bus.png" alt="Bus stop icon" />
              <div className="featureText">
                <span>Bus Stop</span>
                <p>{formatDistance(post.postDetail?.bus)} away</p>
              </div>
            </div>
            <div className="feature">
              <img src="/restaurant.png" alt="Restaurant icon" />
              <div className="featureText">
                <span>Restaurant</span>
                <p>{formatDistance(post.postDetail?.restaurant)} away</p>
              </div>
            </div>
          </div>

          <p className="title">Location</p>
          <div className="mapContainer">
            <Map items={[post]} />
          </div>

          <div className="buttons">
            <button onClick={() => alert("Messaging feature coming soon!")}>
              <img src="/chat.png" alt="Chat icon" />
              Send a Message
            </button>
            <button
              onClick={handleSave}
              style={{
                backgroundColor: saved ? "yellow" : "white",
              }}
            >
              <img src="/save.png" alt="Save icon" />
              {saved ? "Place Saved" : "Not Saved"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePage;
