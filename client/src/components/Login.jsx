import React, { useState, useEffect } from 'react';

// Importing the Routes for a request
import query from '../../lib/routes';

// React Bootstrap Components
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from '@material-ui/core/Button';


const Login = ({ change, changeUser }) => {
    
    const [modalOpen, changeShown] = useState(false);
    const [clicked, changeClicked] = useState(false);
    const [signup, changeSignUp] = useState(false);
    const [shouldPromptCreate, changePrompt] = useState(false);
    const [loginCount, changeCount] = useState(0);
    
    const [name, changeName] = useState('');
    const [pass, changePass] = useState('');

    useEffect(() => {
        if (clicked === true && signup === false) {
            query.getOneUser(name, (err, res) => {
                if (err) {
                    throw err;
                } else {
                    // Check if the user is in the db
                    if (res.data.username === name) {
                        if (res.data.password === pass) {
                            // changeshown to be false
                            // handle the login from the parent component
                            change(true);
                            changeUser(res.data);  // Change user so that the name appears in the top modal
                            changeShown(false);
                        } else {
                            changeClicked(false);
                            alert('Incorrect Password!');
                        }
                    } else {
                        changeClicked(false);
                        if (loginCount >= 2 && shouldPromptCreate === false) {
                            changePrompt(true);
                        } else {
                            changeCount(loginCount + 1);
                        }
                        alert('Cannot find Username and Password within the system');
                        // Ask for creation
                    }
                    // Check that the password is correct
                    // If either are incorrect, reset clicked to be false
                    // If both are true, login successful and update the parent modal with information
                }
            });
        }
    }, [clicked])

    useEffect(() => {
        if (signup === true && name !== "" && pass !== "") {
            const body = { name: name, pass: pass };
            query.postNewUser(body, (err, res) => {
                if (err) {
                    throw err;
                } else {
                    const otherBody = { username: name, password: pass, ingredients: ingredients };
                    change(true);
                    changeUser(otherBody);
                    changeShown(false);
                }
            })
        }
    }, [clicked])
    
    return (
        <div>
            <Button className="login-button" onClick={() => changeShown(true)}>Login</Button>
            <Modal show={modalOpen} onHide={() => changeShown(false)} className="login-modal">
                <Modal.Title className="login-title">
                    Login or Sign Up!
                </Modal.Title>
                <Form className="login-form">
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="username" placeholder="Enter username" onChange={(e) => changeName(e.target.value)}/>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" onChange={(e) => changePass(e.target.value)}/>
                    </Form.Group>
                </Form>
                <Row className="login-buttons-row">
                    <Col>
                        <Button className="login-signup-buttons" onClick={() => {changeClicked(true); changeSignUp(true); } }>Sign Up!</Button> 
                    </Col>
                    <Col>
                        <Button className="login-signup-buttons" onClick={() => changeClicked(true)}>Login</Button>
                    </Col>
                </Row>
            </Modal>
        </div>
    );
}


export default Login;