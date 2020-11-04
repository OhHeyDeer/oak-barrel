import React, { useState, useEffect } from 'react';

// React Bootstrap Components
import Modal from 'react-bootstrap/Modal';

const DrinksInfo = ({ drink, shown, changeShown }) => {

    // const [shown, changeShown] = useState(true);

    
    return(
        <Modal show={shown} onHide={() => changeShown(false)}>
            <Modal.Title>
                {drink.strDrink}
            </Modal.Title>
        </Modal>
    );
}

export default DrinksInfo;