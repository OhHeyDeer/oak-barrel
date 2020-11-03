import React, { useState } from 'react';

// React Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

// Components
import RandomDrinks from './components/RandomDrinks';
import NavBarRight from './components/NavBarRight';
import SearchBar from './components/SearchBar';
import ListDrinks from './components/ListDrinks';

const App = () => {

    const [shouldChange, updateChange] = useState(false);

    const [shownDrinks, changeShownDrinks] = useState([]);

    const search = (drinks) => {
        changeShownDrinks(drinks);
    }
    return (
        <Container style={{ marginRight: 0}}>
            <Row style={{ justifyContent: "center"}}>
                <Col>
                    <NavBarRight change={updateChange} changeVar={shouldChange} />
                </Col>
            </Row>
            <Row className="second-row-large">
                <RandomDrinks />
                <Col xs="7">
                    <div className="drunks-r-us">Drunk's-R-Us</div>
                    <SearchBar searchDrinks={search} />
                </Col>
            </Row>
                <ListDrinks listOfDrinks={shownDrinks} />
            <Row>
                {/* Add in title for the random drinks */}
                {/* Add in a popular drinks component */}

                {/* Conditionally render random drinks or list dependent on the search */}
            </Row>
        </Container>
    );
}

export default App;