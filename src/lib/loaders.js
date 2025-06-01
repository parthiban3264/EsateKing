import apiRequest from "./apiRequest";
import { defer } from "react-router-dom";

// Loader for a single post
export const singlePageLoader = async ({ params }) => {
  const res = await apiRequest(`/posts/${params.id}`);
  return res.data;
};

// Loader for post list with optional query params
export const listPageLoader = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.toString(); // handles edge cases safely
  const postPromise = apiRequest(`/posts?${query}`);
  return defer({
    postRespones: postPromise,
  });
};

export const ProfilePageLoader = async () => {
  try {
    const postPromise = apiRequest(`/users/profilePosts`);
    const chatPromise = apiRequest(`/chats`);
    return defer({
      postRespones: postPromise,
      chatRespones: chatPromise,
    });
  } catch (err) {
    console.error("Error in ProfilePageLoader:", err);
    throw err;
  }
};

