import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditPost = ({ posts, handleEdit }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = posts.find(post => (post.id).toString() === id);

  const [title, setTitle] = useState(post ? post.title : '');
  const [body, setBody] = useState(post ? post.body : '');

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setBody(post.body);
    }
  }, [post]);

  const onSubmit = (e) => {
    e.preventDefault();
    const datetime = new Date().toISOString();
    const updatedPost = { id: post.id, title, body, datetime };
    handleEdit(post.id, updatedPost);
  };

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="postTitle">Title:</label>
      <input
        type="text"
        id="postTitle"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label htmlFor="postBody">Content:</label>
      <textarea
        id="postBody"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <button type="submit">Save</button>
    </form>
  );
};

export default EditPost;
