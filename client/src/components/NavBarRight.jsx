import React, { useEffect, useState } from 'react';

// React Bootstrap
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Material UI
import ListIcon from '@material-ui/icons/List';

const NavBarRight = ({ change, changeVar }) => {

    const [isShow, changeShown] = useState(false);
    const [listOfFavs, changeList] = useState([]);

    useEffect(() => {
        changeList(JSON.parse(localStorage.getItem('my-favorite-drinks')));
    }, []);

    const handleRemoveFavorite = (drink) => {
        let storage = JSON.parse(localStorage.getItem('my-favorite-drinks'));
        let index = storage.indexOf(drink);
        storage.splice(index, 1);
        localStorage.setItem('my-favorite-drinks', JSON.stringify(storage));
        changeList(storage);
        change(!changeVar); // In order for the re-render of the list so that the icons change
    }

    const handleOpenFavorites = () => {
        changeList(JSON.parse(localStorage.getItem('my-favorite-drinks')));
        changeShown(!isShow);
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
                        </Row>
                        <Row xs="12">
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