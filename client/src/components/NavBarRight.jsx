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

// My Components
import Login from './Login';
import query from '../../lib/routes';
import { LocalFlorist } from '@material-ui/icons';

const NavBarRight = ({ change, changeVar }) => {

    const [isShow, changeShown] = useState(false);
    const [listOfFavs, changeList] = useState([]);

    const [isLoggedIn, changeLoginStatus] = useState(false);
    const [loggedUser, changeLoggedUser] = useState({});

    const [favoriteIngredients, changeFavIngredients] = useState([]);

    useEffect(() => {
        changeList(JSON.parse(localStorage.getItem('my-favorite-drinks')));
    }, []);

    useEffect(() => {
        changeFavIngredients(loggedUser.savedIngredients);
    }, [loggedUser])    

    const handleRemoveFavorite = (drink) => {
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


    // ISSUE: the params aren't being sent through in the correct manner, working on getting that sorted out.
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
    return (
        <>
            <ListIcon className="favorite-drinks-list" onClick={() => handleOpenFavorites() } />
            <Modal show={isShow} onHide={() => changeShown(!isShow)}>
                <Modal.Header>
                    <Col>
                        <Row xs="12">
                            <Modal.Title className="favorite-modal-title">
                                My List
                            </Modal.Title>
                            {isLoggedIn ? `Logged in as ${loggedUser.username}` : <Login change={changeLoginStatus} changeUser={changeLoggedUser}/>}
                        </Row>
                        <Row xs="12">
                            {isLoggedIn ? 
                            <Card>
                                <Card.Header>
                                    My Ingredients
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
                            {listOfFavs.length >= 1 ? listOfFavs.map(favorite => 
                                <Row className="favorite-drink-individual">
                                    <h4>
                                        {favorite}
                                    </h4>
                                    <Button type="button" onClick={() => handleRemoveFavorite(favorite)} >X</Button>
                                </Row>
                            ) : 'You have no favorites yet!' }
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