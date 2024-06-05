import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoIosList } from "react-icons/io";
import { FaSearch, FaArrowRight } from "react-icons/fa";
import Filmdetail from './Filmdetail';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [films, setFilms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filmsPerPage] = useState(4);

  useEffect(() => {
    const fetchFilmsData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/films`);
        setFilms(response.data.films);
      } catch (error) {
        console.log('Error fetching', error);
      }
    };
    fetchFilmsData();
  }, []);

  // Logic for pagination
  const indexOfLastFilm = currentPage * filmsPerPage;
  const indexOfFirstFilm = indexOfLastFilm - filmsPerPage;
  const currentFilms = films.slice(indexOfFirstFilm, indexOfLastFilm);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openModal = (film) => {
    setSelectedFilm(film);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedFilm(null);
    setShowModal(false);
  };

  return (
    <div className="film-site-container">
      <div className="navbar">
        <div className="navbar-left">
          <IoIosList className="icon" />
        </div>
        <div className="navbar-middle">
          <h3>MOVIE
            <span className="highlight">
              <span>UI</span></span>
            </h3>
        </div>
        <div className="navbar-right">
          <FaSearch className="icon" style={{ fontSize: '15px' }} />
        </div>
      </div>
      <hr />
      <div className="body-container">
        <h4>Most Popular Movies</h4>
        <div className="items-container">
          {currentFilms.map((film, index) => (
            <div className="film-item" key={index} onClick={() => openModal(film)}>
              <img src={film.image} alt="Films image" />
              <p>{film.name}</p>
              <div className="film-info">
                <span className="graytext" style={{ marginRight: '5px' }}>{film.time} min </span>
                <span className="graytext">{film.year}</span>
              </div>
            </div>
          ))}
        </div>
        {films.length > filmsPerPage && (
          <div className="pagination">
            <button className="prev buttonnav"onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
              Prev
            </button>
            <button className="next buttonnav" onClick={() => paginate(currentPage + 1)} disabled={currentFilms.length < filmsPerPage}>
              Next <FaArrowRight />
            </button>
          </div>
        )}
      </div>
      <Filmdetail show={showModal} onHide={closeModal} film={selectedFilm} />
    </div>
  );
}

export default App;
