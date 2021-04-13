import React, { useState, useEffect } from 'react';
// import {v4 as uuidv4 } from 'uuid';
// React Bootstrap
import Carousel from 'react-bootstrap/Carousel';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';


// Material UI
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';

// Routes and Components
import query from '../../lib/routes.js';

const RandomDrinks = () => {
    
    const [randomList, changeRandomList] = useState([]);
    const [favoritesList, changeFavs] = useState([]);

    const [shouldShowModal, changeShowModal] = useState(false);

    const [clickedDrink, changeClick] = useState({});

    // On Load, retrieve the list of favorite drinks from localstorage or create a new list
    useEffect(() => {
        let unparsed = localStorage.getItem('my-favorite-drinks');
        let storage = JSON.parse(unparsed);
        if (unparsed === null || unparsed[0] !== '[') {
            localStorage.setItem('my-favorite-drinks', JSON.stringify([]));
        } else {
            console.log('IS already defined');
        }
        query.getRandomDrinks((err, res) => {
            if (err) {
                throw err;
            } else {
                changeRandomList(res.data.drinks);
                changeFavs(storage);
            }
        })
    }, [])

    // Handles adding a favorite drink to localstoage.
    const handleAddFavorite = (drink) => {
        const storage = JSON.parse(localStorage.getItem('my-favorite-drinks'));
        localStorage.setItem('my-favorite-drinks', JSON.stringify([drink.strDrink, ...storage]))
        changeFavs([drink.strDrink, ...storage]);
    }
    // Handles removing a favorite drink from localstorage.
    const handleRemoveFavorite = (drink) => {
        let storage = [...favoritesList];
        for (let i = 0; i < favoritesList.length; i++) {
            if (storage[i] === drink.strDrink) {
                storage.splice(i, 1);
                localStorage.setItem('my-favorite-drinks', JSON.stringify(storage));
                changeFavs(storage);
            }
        };
    }

    // Handles clicking a drink to see for the information. Requests the database for the drink details.
    const handleDrinkClick = (drink) => {
        query.searchDrinks(drink.strDrink, (err, data) => {
            if (err) {
                throw err;
            } else {
                changeClick(data.data.drinks[0]);
                setTimeout(() => {
                    changeShowModal(true);
                }, 100);
            }
        });
    }

    // Handles the closing of the modal.
    const handleShowModal = () => {
        changeClick({});
        changeShowModal(false);
    }

    return (
        <div>
            <Col className="carousel-wrapper">
                <h4 className="carousel-title" style={{ textAlign: "center"}}>Drinks you might like:</h4>
                <Carousel className="carousel-of-random">
                    {randomList.map(drink => 
                    <Carousel.Item interval={5000}>
                        <div className="add-to-favorites" >
                            {!JSON.parse(localStorage.getItem('my-favorite-drinks')).includes(drink.strDrink) ? <PlaylistAddIcon className="playlist-icons" onClick={() => handleAddFavorite(drink)} /> : <PlaylistAddCheckIcon className="playlist-icons" onClick={() => handleRemoveFavorite(drink)} />}
                        </div>
                        <img
                            onClick={() => handleDrinkClick(drink)}
                            src={drink.strDrinkThumb}
                            alt={drink.strDrink}
                            style={{ border: "3px solid #8bcdcd", borderRadius: "2px" }}
                            className="d-block w-100"
                        />
                        <Carousel.Caption className="carousel-caption">
                            <h3 className="carousel-title">{drink.strDrink}</h3>
                            <p className="carousel-description">{drink.strAlcoholic}</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    )}
                </Carousel>
                <Modal show={shouldShowModal} onHide={() => handleShowModal()}>
                    <Modal.Title className="drinks-modal-title">
                        {clickedDrink.strDrink}
                    </Modal.Title>
                    <Modal.Body className="drinks-modal-overall">
                        <Image src={clickedDrink.strDrinkThumb} thumbnail width="171px" height="180px"></Image> 
                        <h5 style={{ color: "#3797a4" }}>Category: <a style={{ color: "#fcf776" }}>{clickedDrink.strCategory}</a></h5>
                        <h5 style={{ color: "#3797a4" }}>Glass: <a style={{ color: "#fcf776" }}>{clickedDrink.strGlass}</a></h5>
                        <div className="drinks-modal-list">
                            <h5 style={{ color: "#3797a4" }}>Ingredients: </h5>
                            <ul>
                                {/* Conditionally rendering versus mapping across and creating an array */}
                                {clickedDrink.strIngredient1 ? <li>{clickedDrink.strMeasure1 + " "}{clickedDrink.strIngredient1}</li> : ''}
                                {clickedDrink.strIngredient2 ? <li>{clickedDrink.strMeasure2 + " "}{clickedDrink.strIngredient2}</li> : ''}
                                {clickedDrink.strIngredient3 ? <li>{clickedDrink.strMeasure3 + " "}{clickedDrink.strIngredient3}</li> : ''}
                                {clickedDrink.strIngredient4 ? <li>{clickedDrink.strMeasure4 + " "}{clickedDrink.strIngredient4}</li> : ''}
                                {clickedDrink.strIngredient5 ? <li>{clickedDrink.strMeasure5 + " "}{clickedDrink.strIngredient5}</li> : ''}
                                {clickedDrink.strIngredient6 ? <li>{clickedDrink.strMeasure6 + " "}{clickedDrink.strIngredient6}</li> : ''}
                                {clickedDrink.strIngredient7 ? <li>{clickedDrink.strMeasure7 + " "}{clickedDrink.strIngredient7}</li> : ''}
                                {clickedDrink.strIngredient8 ? <li>{clickedDrink.strMeasure8 + " "}{clickedDrink.strIngredient8}</li> : ''}
                                {clickedDrink.strIngredient9 ? <li>{clickedDrink.strMeasure9 + " "}{clickedDrink.strIngredient9}</li> : ''}
                                {clickedDrink.strIngredient10 ? <li>{clickedDrink.strMeasure10 + " "}{clickedDrink.strIngredient10}</li> : ''}
                                {clickedDrink.strIngredient11 ? <li>{clickedDrink.strMeasure11 + " "}{clickedDrink.strIngredient11}</li> : ''}
                                {clickedDrink.strIngredient12 ? <li>{clickedDrink.strMeasure12 + " "}{clickedDrink.strIngredient12}</li> : ''}
                                {clickedDrink.strIngredient13 ? <li>{clickedDrink.strMeasure13 + " "}{clickedDrink.strIngredient13}</li> : ''}
                                {clickedDrink.strIngredient14 ? <li>{clickedDrink.strMeasure14 + " "}{clickedDrink.strIngredient14}</li> : ''}
                                {clickedDrink.strIngredient15 ? <li>{clickedDrink.strMeasure15 + " "}{clickedDrink.strIngredient15}</li> : ''}
                            </ul>
                        </div>
                        <div className="drinks-modal-list">
                            <h5 style={{ color: "#3797a4" }}>Instructions:</h5>
                            <p>{clickedDrink.strInstructions}</p>
                        </div>
                    </Modal.Body>
                </Modal>
            </Col>
        </div>
    );

}

export default RandomDrinks;