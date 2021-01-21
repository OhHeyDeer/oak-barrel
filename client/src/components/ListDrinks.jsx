import React, { useState, useEffect } from 'react';

// React Bootstrap
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';

// Material UI
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';

// Routes for querying
import query from '../../lib/routes';

const ListDrinks = ({ listOfDrinks }) => {

    const [favorites, changeFavs] = useState(['On Load']);

    const [shouldShowModal, changeShowModal] = useState(false);

    const [clickedDrink, changeClick] = useState({});
    const [nestedDrinkRows, changeNestedRows] = useState([]);
    // As a user I want to be able to search an ingredient and see the drinks I can make
    // Can enter search parameters which appear as minicomponents when added
    // -- This allows a user to add ingredients as they go then search based on them.

    useEffect(() => {
        // when list of drinks changes split it into nested arrays for mapping
        const newList = [];
        let nestedList = [];
        for(let i = 1; i < listOfDrinks.length; i++) {
            if (i % 3 === 0) { // On the fourth of every iteration
                nestedList.push(listOfDrinks[i - 1]);
                newList.push(nestedList);
                nestedList = [];
            } else {
                nestedList.push(listOfDrinks[i - 1]);
            }
        }
        if (nestedList.length !== 0) {
            newList.push(nestedList);
        }
        changeNestedRows(newList);
    }, [listOfDrinks])

    const handleAddFavorite = (drink) => {
        const storage = JSON.parse(localStorage.getItem('my-favorite-drinks'));
        localStorage.setItem('my-favorite-drinks', JSON.stringify([drink.strDrink, ...storage]))
        changeFavs(storage);
    }

    const handleRemoveFavorite = (drink) => {
        const favoritesList = JSON.parse(localStorage.getItem('my-favorite-drinks'));
        let storage = [...favoritesList];
        for (let i = 0; i < favoritesList.length; i++) {
            if (storage[i] === drink.strDrink) {
                storage.splice(i, 1);
                localStorage.setItem('my-favorite-drinks', JSON.stringify(storage));
                changeFavs(storage);
            }
        };
    }

    const handleDrinkClick = (drink) => {

        console.log(drink);
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
    
    const handleShowModal = () => {
        changeClick({});
        changeShowModal(false);
    }

    
    return (
        <Col style={{ paddingLeft: "0px"}}>
            {listOfDrinks !== "None Found" && listOfDrinks.length ? <h2 className="drink-list-header">
                How do these look?
            </h2> : ''}
            {listOfDrinks !== "None Found" && listOfDrinks.length ? 
            <div className="drinks-list">
                {nestedDrinkRows.map( list => 
                <Row>
                    {list.map(drink =>
                        <Col className={list.length === 1 ? "drink-search-one-tile" : "drink-search-tile"}>
                            <Card className={list.length === 1 ? "drinks-single-tile" : ""}>
                                <Card.Img src={drink.strDrinkThumb} alt={drink.strDrink} className="drinks-list-image" onClick={() => handleDrinkClick(drink)}/>
                                <div className="add-to-favorites" >
                                        {!JSON.parse(localStorage.getItem('my-favorite-drinks')).includes(drink.strDrink) ? <PlaylistAddIcon className="playlist-icons" onClick={() => handleAddFavorite(drink)} /> : <PlaylistAddCheckIcon className="playlist-icons" onClick={() => handleRemoveFavorite(drink)} />}
                                </div>
                                <Card.Title className="drink-list-titles">
                                    {drink.strDrink}
                                </Card.Title>
                                
                            </Card>
                        </Col>
                    )}
                </Row>
                )}
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
                                {clickedDrink.strIngredient1 ? <li>{(clickedDrink.strMeasure1 !== null ? clickedDrink.strMeasure1 : '') + " "} {clickedDrink.strIngredient1}</li> : ''}
                                {clickedDrink.strIngredient2 ? <li>{(clickedDrink.strMeasure2 !== null ? clickedDrink.strMeasure2 : '') + " "} {clickedDrink.strIngredient2}</li> : ''}
                                {clickedDrink.strIngredient3 ? <li>{(clickedDrink.strMeasure3 !== null ? clickedDrink.strMeasure3 : '') + " "} {clickedDrink.strIngredient3}</li> : ''}
                                {clickedDrink.strIngredient4 ? <li>{(clickedDrink.strMeasure4 !== null ? clickedDrink.strMeasure4 : '') + " "} {clickedDrink.strIngredient4}</li> : ''}
                                {clickedDrink.strIngredient5 ? <li>{(clickedDrink.strMeasure5 !== null ? clickedDrink.strMeasure1 : '') + " "} {clickedDrink.strIngredient5}</li> : ''}
                                {clickedDrink.strIngredient6 ? <li>{(clickedDrink.strMeasure6 !== null ? clickedDrink.strMeasure1 : '') + " "} {clickedDrink.strIngredient6}</li> : ''}
                                {clickedDrink.strIngredient7 ? <li>{(clickedDrink.strMeasure7 !== null ? clickedDrink.strMeasure1 : '') + " "} {clickedDrink.strIngredient7}</li> : ''}
                                {clickedDrink.strIngredient8 ? <li>{(clickedDrink.strMeasure8 !== null ? clickedDrink.strMeasure1 : '') + " "} {clickedDrink.strIngredient8}</li> : ''}
                                {clickedDrink.strIngredient9 ? <li>{(clickedDrink.strMeasure9 !== null ? clickedDrink.strMeasure1 : '') + " "} {clickedDrink.strIngredient9}</li> : ''}
                                {clickedDrink.strIngredient10 ? <li>{(clickedDrink.strMeasure10 !== null ? clickedDrink.strMeasure1 : '') + " "} {clickedDrink.strIngredient10}</li> : ''}
                                {clickedDrink.strIngredient11 ? <li>{(clickedDrink.strMeasure11 !== null ? clickedDrink.strMeasure1 : '') + " "} {clickedDrink.strIngredient11}</li> : ''}
                                {clickedDrink.strIngredient12 ? <li>{(clickedDrink.strMeasure12 !== null ? clickedDrink.strMeasure1 : '') + " "} {clickedDrink.strIngredient12}</li> : ''}
                                {clickedDrink.strIngredient13 ? <li>{(clickedDrink.strMeasure13 !== null ? clickedDrink.strMeasure1 : '') + " "} {clickedDrink.strIngredient13}</li> : ''}
                                {clickedDrink.strIngredient14 ? <li>{(clickedDrink.strMeasure14 !== null ? clickedDrink.strMeasure1 : '') + " "} {clickedDrink.strIngredient14}</li> : ''}
                                {clickedDrink.strIngredient15 ? <li>{(clickedDrink.strMeasure15 !== null ? clickedDrink.strMeasure1 : '') + " "} {clickedDrink.strIngredient15}</li> : ''}
                            </ul>
                        </div>
                        <div className="drinks-modal-list">
                            <h5 style={{ color: "#3797a4" }}>Instructions:</h5>
                            <p>{clickedDrink.strInstructions}</p>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
                : ''} 
            {/* Not Sure if this ^^ is working */}
        </Col>
    );
}

export default ListDrinks;