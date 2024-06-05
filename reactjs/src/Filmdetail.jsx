import React from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from 'react-bootstrap';
import { FaPlay } from 'react-icons/fa';

export default function Filmdetail({ show, onHide, film }) {
  return (
    <Modal show={show} onHide={onHide}>
    <Modal.Header closeButton onHide={onHide} >
    </Modal.Header>
    <Modal.Body>
        <div className="film-info-image">
        <img src={film?.image} alt="film image" className="img-fluid" />

        </div>
   
        <div className="film-info-desc">
            <h3>{film?.name}</h3>
            <span className="graytext">{film?.time} min {film?.year}</span>
            <div className="film-desc">
                {film?.introduce}
            </div>
            <button className="play-button"><FaPlay /> PLAY MOVIE</button>
        </div>
    </Modal.Body>
  </Modal>
  )
}
