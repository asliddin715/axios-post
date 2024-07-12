import Header from "./components/Header";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./components/Home";
import NewPost from "./components/NewPost";
import PostPage from "./components/PostPage";
import EditPost from "./components/EditPost";
import About from "./components/About";
import Missing from "./components/Missing";
import { Routes, useNavigate, Route } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fetchPosts, addNewPost, deleteExistingPost, editPost } from './slices/postsSlice';

function App() {
  const posts = useSelector((state) => state.posts.posts);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  useEffect(() => {
    const filteredResults = posts.filter(
      (post) =>
        post.body.toLowerCase().includes(search.toLowerCase()) ||
        post.title.toLowerCase().includes(search.toLowerCase())
    );

    setSearchResults(filteredResults.reverse());
  }, [posts, search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const datetime = format(new Date(), "MMMM dd, yyyy pp");
    const newPost = { title: postTitle, datetime, body: postBody };
    dispatch(addNewPost(newPost)).unwrap()
      .then(() => {
        setPostTitle("");
        setPostBody("");
        navigate("/");
      })
      .catch((error) => {
        console.error("Failed to save the post: ", error);
      });
  };

  const handleDelete = (id) => {
    dispatch(deleteExistingPost(id)).unwrap()
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Failed to delete the post: ", error);
      });
  };

  const handleEdit = (id, updatedPost) => {
    dispatch(editPost({ id, updatedPost })).unwrap()
      .then(() => {
        navigate(`/post/${id}`);
      })
      .catch((error) => {
        console.error("Failed to edit the post: ", error);
      });
  };

  return (
    <div className='App'>
      <Header title='React JS Blog' />
      <Nav search={search} setSearch={setSearch} />
      <Routes>
        <Route path='/' element={<Home posts={searchResults} />} />
        <Route
          path='/post'
          element={
            <NewPost
              handleSubmit={handleSubmit}
              postTitle={postTitle}
              setPostTitle={setPostTitle}
              postBody={postBody}
              setPostBody={setPostBody}
            />
          }
        />
        <Route
          path='/post/:id'
          element={<PostPage posts={posts} handleDelete={handleDelete} />}
        />
        <Route
          path='/edit/:id'
          element={<EditPost posts={posts} handleEdit={handleEdit} />}
        />
        <Route path='/about' element={<About />} />
        <Route path='*' element={<Missing />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
