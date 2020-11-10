import React, { useEffect, useState } from 'react';

// React Bootstrap
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Material UI
import ListIcon from '@material-ui/icons/List';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

// My Components
import Login from './Login';
import query from '../../lib/routes';

const NavBarRight = ({ change, changeVar }) => {

    const [isShow, changeShown] = useState(false);
    const [listOfFavs, changeList] = useState([]);

    const [isLoggedIn, changeLoginStatus] = useState(false);
    const [loggedUser, changeLoggedUser] = useState({});

    const [favoriteIngredients, changeFavIngredients] = useState([]);

    const [drinkDetails, changeDetails] = useState({});
    const [ingredientsList, changeIngredients] = useState([]);
    const [currentIngredient, changeIngredient] = useState({});

    const [handleTextboxShow, changeTextboxShown] = useState(false);
    const [isNotClicked, changeIsNotClicked] = useState([]);

    useEffect(() => {
        changeList(JSON.parse(localStorage.getItem('my-favorite-drinks')));
        
        query.getIngredients((err, data) => {
            if (err) {
                throw err;
            } else {
                changeIngredients(data.data.drinks);
            }
        })

    }, []);

    useEffect(() => {
        changeFavIngredients(loggedUser.savedIngredients);
    }, [loggedUser])    

    const handleRemoveFavorite = (drink) => {

        let newArr = [...isNotClicked];
        newArr.splice(newArr.indexOf(drink), 1);
        changeIsNotClicked(newArr);


        let storage = JSON.parse(localStorage.getItem('my-favorite-drinks'));
        let index = storage.indexOf(drink);
        storage.splice(index, 1);
        localStorage.setItem('my-favorite-drinks', JSON.stringify(storage));
        changeList(storage);
        change(!changeVar); // In order for the re-render of the random drinks list so that the icons change
    }

    const handleOpenFavorites = () => {
        changeList(JSON.parse(localStorage.getItem('my-favorite-drinks')));
        changeShown(!isShow);
    }

    const removeIngredient = (ingredient) => {
        // Request to update the current user by removing the ingredient

        let newArr = [...favoriteIngredients];
        newArr.splice(newArr.indexOf(ingredient), 1);
        query.updateExistingUser(loggedUser.username, newArr, (err, data) => {
            if (err) {
                throw err;
            } else {
                changeFavIngredients(newArr);
            }
        })
    }

    const addIngredient = (ingredient) => {

        let newArr = [...favoriteIngredients];
        newArr.push(ingredient);
        query.updateExistingUser(loggedUser.username, newArr, (err, data) => {
            if (err) {
                throw err;
            } else {
                changeFavIngredients(newArr)
            }
        })
    }
    
    const handleGetDrinkDetails = (favorite, callback) => {
        
        if (isNotClicked.includes(favorite)) {
            let newArr = [...isNotClicked];
            newArr.splice(newArr.indexOf(favorite), 1);
            changeIsNotClicked(newArr);
        } else {
            changeIsNotClicked([favorite, ...isNotClicked]);
        }
 


        query.searchDrinks(favorite, (err, data) => {
            if (err) {
                throw err;
            } else {
                console.log(data.data.drinks[0]);
                changeDetails(data.data.drinks[0]);
                callback();
            }
        });

    };



    return (
        <>
            <ListIcon className="favorite-drinks-list" onClick={() => handleOpenFavorites() } />
            <Modal show={isShow} onHide={() => changeShown(!isShow)}>
                <Modal.Header className="list-popup">
                    <Col>
                        <Row xs="12">
                            <Col>
                                <Modal.Title className="favorite-modal-title">
                                    {isLoggedIn ? 'My Profile' : 'My Drinks'}
                                </Modal.Title>
                            </Col>
                            <Col>
                                {isLoggedIn ? `Account: ${loggedUser.username}` : <Login change={changeLoginStatus} changeUser={changeLoggedUser}/>}
                            </Col>
                        </Row>
                        <Row xs="12">
                            {isLoggedIn ? 
                            <Card className="drinks-card">
                                <Card.Header>
                                        My Ingredients
                                    {!handleTextboxShow ? <AddIcon className="add-ingredient-plus" onClick={() => changeTextboxShown(true)} /> : <RemoveIcon className="add-ingredient-plus" onClick={() => changeTextboxShown(false)} />}
                                    {/* Conditionally render the textbox */}
                                        {handleTextboxShow ? 
                                        <Row>
                                        <Autocomplete
                                            freeSolo
                                            disableClearable
                                            id="outlined-helperText"
                                            className="text-field-search-bar"
                                            label="Add an Ingredient!"
                                            variant="outlined"
                                            
                                            options={ingredientsList.length ? ingredientsList.map((option) => option.strIngredient1) : [{ strIngredient1: 'No Ingredients!' }].map((option) => option.strIngredient1)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Add an Ingredient!"
                                                    margin="normal"
                                                    variant="outlined"
                                                    InputProps={{ ...params.InputProps, type: 'search' }}
                                                />
                                            )}
                                            onChange={(e, value) => changeIngredient(value)}
                                            value={currentIngredient}
                                        />
                                        <Button
                                            onClick={() => addIngredient(currentIngredient)}
                                            variant="contained"
                                            className="filter-button"
                                        >Add!</Button>
                                        </Row>
                                    : ''}
                                </Card.Header>
                                {/* The logic for saved ingredients per user */}
                                    {favoriteIngredients ?
                                    <Card.Body>
                                        {favoriteIngredients.length > 0 ? favoriteIngredients.map(ingredient => {
                                        const popover = (
                                            <Popover id="popover-basic">
                                                <Popover.Title as="h3">{ingredient}</Popover.Title>
                                                <Popover.Content>
                                                    <Button onClick={() => removeIngredient(ingredient)}>Delete Ingredient</Button>
                                                </Popover.Content>
                                            </Popover>
                                        );
                                        return (
                                        <OverlayTrigger trigger="click" placement="left" overlay={popover}>
                                            <li>{ingredient} </li>
                                        </OverlayTrigger>)
                                        }) : 'No Ingredients Saved!'}
                                    </Card.Body> 
                                    : ''}
                            </Card>
                            : ''}
                        <Modal.Body>
                            {/* Close Button */}
                            {isLoggedIn ? <h4 className="favorite-modal-title">My Saved Drinks:</h4>: ''}
                            {listOfFavs.length >= 1 ? listOfFavs.map(favorite => {
                                    const popover2 = (
                                        <Popover id="popover-basic" className="popover-details">
                                            <Popover.Title as="h3">{favorite}</Popover.Title>
                                            <Popover.Content>
                                                <img className="popup-image" src={drinkDetails.strDrinkThumb}></img>
                                                <h5>Category: {drinkDetails.strCategory}</h5>
                                                <h5>
                                                    Ingredients:
                                                </h5>
                                                <ul>
                                                    {/* Conditionally rendering versus mapping across and creating an array */}
                                                    {drinkDetails.strIngredient1 ? <li>{drinkDetails.strMeasure1 + " "}{drinkDetails.strIngredient1}</li> : ''}
                                                    {drinkDetails.strIngredient2 ? <li>{drinkDetails.strMeasure2 + " "}{drinkDetails.strIngredient2}</li> : ''}
                                                    {drinkDetails.strIngredient3 ? <li>{drinkDetails.strMeasure3 + " "}{drinkDetails.strIngredient3}</li> : ''}
                                                    {drinkDetails.strIngredient4 ? <li>{drinkDetails.strMeasure4 + " "}{drinkDetails.strIngredient4}</li> : ''}
                                                    {drinkDetails.strIngredient5 ? <li>{drinkDetails.strMeasure5 + " "}{drinkDetails.strIngredient5}</li> : ''}
                                                    {drinkDetails.strIngredient6 ? <li>{drinkDetails.strMeasure6 + " "}{drinkDetails.strIngredient6}</li> : ''}
                                                    {drinkDetails.strIngredient7 ? <li>{drinkDetails.strMeasure7 + " "}{drinkDetails.strIngredient7}</li> : ''}
                                                    {drinkDetails.strIngredient8 ? <li>{drinkDetails.strMeasure8 + " "}{drinkDetails.strIngredient8}</li> : ''}
                                                    {drinkDetails.strIngredient9 ? <li>{drinkDetails.strMeasure9 + " "}{drinkDetails.strIngredient9}</li> : ''}
                                                    {drinkDetails.strIngredient10 ? <li>{drinkDetails.strMeasure10 + " "}{drinkDetails.strIngredient10}</li> : ''}
                                                    {drinkDetails.strIngredient11 ? <li>{drinkDetails.strMeasure11 + " "}{drinkDetails.strIngredient11}</li> : ''}
                                                    {drinkDetails.strIngredient12 ? <li>{drinkDetails.strMeasure12 + " "}{drinkDetails.strIngredient12}</li> : ''}
                                                    {drinkDetails.strIngredient13 ? <li>{drinkDetails.strMeasure13 + " "}{drinkDetails.strIngredient13}</li> : ''}
                                                    {drinkDetails.strIngredient14 ? <li>{drinkDetails.strMeasure14 + " "}{drinkDetails.strIngredient14}</li> : ''}
                                                    {drinkDetails.strIngredient15 ? <li>{drinkDetails.strMeasure15 + " "}{drinkDetails.strIngredient15}</li> : ''}
                                                </ul>
                                                <h5>Instructions:</h5>
                                                <p>
                                                    {drinkDetails.strInstructions}
                                                </p>
                                            </Popover.Content>
                                        </Popover>
                                    );
                                    return (
                                    <OverlayTrigger trigger="click" placement="left" overlay={popover2} >
                                        <Row className="favorite-drink-individual" >
                                            <Col onClick={() => handleGetDrinkDetails(favorite, () => console.log('Finish Query'))}>
                                                <h4 className={!isNotClicked.includes(favorite) ? "favorite-drinks-title" : "favorite-drinks-title-click"}  >
                                                    {favorite}
                                                </h4>
                                            </Col>
                                            <Col>
                                                <Button className="button-remove-favorite" type="button" onClick={() => handleRemoveFavorite(favorite)} >X</Button>
                                            </Col>
                                        </Row>
                                    </OverlayTrigger>
                                    )
                            }) : 'You have no favorites yet!' }
                            {/* Delete From List */}
                        </Modal.Body>
                        </Row>
                    </Col>
                </Modal.Header>
            </Modal>
        </>
    );
}

export default NavBarRight;