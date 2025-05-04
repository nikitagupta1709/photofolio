import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import AlbumsList from './components/AlbumsList';
import "./App.css";
function App() {
  return (
    <>
      <Navbar />
      <AlbumsList />
      <ToastContainer position="top-right" />
    </>
  );
}

export default App;
