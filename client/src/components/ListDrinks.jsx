import React, { useState, useEffect } from 'react';

// React Bootstrap
import Container from 'react-bootstrap/Container';
import Carousel from 'react-bootstrap/Carousel';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';


// Material UI
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';


const ListDrinks = ({ listOfDrinks }) => {

    const [favorites, changeFavs] = useState(['On Load']);
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
        changeNestedRows([...newList].reverse());
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
                            <div className="add-to-favorites" >
                                    {!JSON.parse(localStorage.getItem('my-favorite-drinks')).includes(drink.strDrink) ? <PlaylistAddIcon className="playlist-icons" onClick={() => handleAddFavorite(drink)} /> : <PlaylistAddCheckIcon className="playlist-icons" onClick={() => handleRemoveFavorite(drink)} />}
                            </div>
                            <img
                                src={drink.strDrinkThumb}
                                alt={drink.strDrink}
                                style={{ border: "3px solid #8bcdcd", borderRadius: "2px" }}
                                className="d-block w-100"
                                />
                            <Carousel.Caption className={list.length === 1 ? "three-drink-caption" : "drink-caption"}>
                                <h3 className="drink-list-titles">{drink.strDrink}</h3>
                            </Carousel.Caption>
                        </Col>
                    )}
                </Row>
                )}
            </div>
                : ''} 
            {/* Not Sure if this ^^ is working */}
        </Col>
    );
}

export default ListDrinks;