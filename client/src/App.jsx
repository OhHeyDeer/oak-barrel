import React from 'react';

// React Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

// Components
import RandomDrinks from './components/RandomDrinks';
import NavBarRight from './components/NavBarRight';

const App = () => {

    return (
        <Container style={{ marginRight: 0}}>
            <Col xs="2"></Col>
            <Col xs="8" style={{ flex: "0", maxWidth: "none" }}>
                <Row style={{ justifyContent: "center"}}>
                    <Col xs="8">
                        <div className="drunks-r-us">Drunk's-R-Us</div>
                    </Col>
                    <Col>
                        <NavBarRight />
                    </Col>
                </Row>
                <Row>
                    Search
                </Row>
                <Row>
                    <RandomDrinks />
                </Row>
            </Col>
        </Container>
    );
}

export default App;