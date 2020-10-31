import React, { useState, useEffect } from 'react';

// React Bootstrap
import Carousel from 'react-bootstrap/Carousel';
import Col from 'react-bootstrap/Col';

// Material UI
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';

// Routes and Components
import query from '../../lib/routes';

const RandomDrinks = () => {
    
    // const randomDrinks = [1,2,3,4,5,6,7,8,9,10];
    const [randomList, changeRandomList] = useState([]);
    const [favoritesList, changeFavs] = useState([]);
    // const [isInList, changeInList] = useState(true);

    useEffect(() => {
        let unparsed = localStorage.getItem('my-favorite-drinks');
        let storage = JSON.parse(unparsed);
        // console.log(storage);
        console.log(storage);
        if (unparsed[0] !== '[') {
            console.log('Reset to array');
            localStorage.setItem('my-favorite-drinks', JSON.stringify([]));
        } else {
            console.log('IS already defined');
        }
        query.getRandomDrinks((err, res) => {
            if (err) {
                throw err;
            } else {
                changeRandomList(res.data.drinks);
                changeFavs(JSON.parse(localStorage.getItem('my-favorite-drinks')));
            }
        })
    }, [])

    const handleAddFavorite = (drink) => {
        const storage = JSON.parse(localStorage.getItem('my-favorite-drinks'));


        localStorage.setItem('my-favorite-drinks', JSON.stringify([drink.idDrink, ...storage]))
        changeFavs([drink.idDrink, ...storage]);
    }
    const handleRemoveFavorite = (drink) => {
        let storage = [...favoritesList];
        for (let i = 0; i < favoritesList.length; i++) {
            if (storage[i] === drink.idDrink) {
                storage.splice(i, 1);
                localStorage.setItem('my-favorite-drinks', JSON.stringify(storage));
                changeFavs(storage);
            }
        };
    }

    console.log('State Change', favoritesList);
    return (
        <div>
            <Col xs="2"></Col>
            <Col xs="8" className="carousel-wrapper">
                <Carousel className="carousel-of-random">
                    {randomList.map(drink => 
                    <Carousel.Item interval={3000}>
                        <div className="add-to-favorites" >
                            {!JSON.parse(localStorage.getItem('my-favorite-drinks')).includes(drink.idDrink) ? <PlaylistAddIcon onClick={() => handleAddFavorite(drink)} /> : <PlaylistAddCheckIcon onClick={() => handleRemoveFavorite(drink)} />}
                        </div>
                        <img
                            src={drink.strDrinkThumb}
                            alt={drink.strDrink}
                            style={{ border: "3px solid #f08a5d", borderRadius: "2px" }}
                            className="d-block w-100"
                        />
                        <Carousel.Caption className="carousel-caption">
                            <h3 className="carousel-title">{drink.strDrink}</h3>
                            <p className="carousel-description">{drink.strAlcoholic}</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    )}
                </Carousel>
            </Col>
            <Col xs="2"></Col>
        </div>
    );

}

export default RandomDrinks;