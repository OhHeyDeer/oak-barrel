import React, { useState, useEffect } from 'react';


// React Bootstrap
import Row from 'react-bootstrap/Row';

// Material UI
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

// Routes
import query from '../../lib/routes';


const SearchBar = ({ searchDrinks }) => {
    const [ingredientVar, changeIngredient] = useState('');

    const [ingredientsList, changeIngredientsList] = useState([]);
    const [ingredientFilters, changeIngredientFilters] = useState([]);

    const [drinksFound, changeDrinksFound] = useState(true);

    useEffect(() => {
        query.getIngredients((err, data) => {
            if (err) {
                throw err;
            } else {
                changeIngredientsList(data.data.drinks);
            }
        })
    },[])

    const addIngredient = (ingredient) => {
        let newArray = [];
        ingredientsList.forEach( string => newArray.push(string.strIngredient1));
        if (newArray.includes(ingredient)) {
            if (!ingredientFilters.includes(ingredient)) {
                changeIngredientFilters([ingredient, ...ingredientFilters]);
                changeIngredient('');
            }
        }
    }

    const removeIngredient = (ingredient) => {
        let newArray = [...ingredientFilters];
        newArray.splice(newArray.indexOf(ingredient), 1);
        changeIngredientFilters([...newArray]);
    }

    const handleSearchDrinks = () => {
        // Takes the list of ingredients and searches for drinks based on them.
        query.filterSearchDrinks(ingredientFilters, (err, data, ingredients) => {
            if (err) {
                throw err;
            } else {
                const drinks = data.data.drinks;
                if (drinks === 'None Found') {
                    // Tells the user there are no drinks for the ingredients given
                    changeDrinksFound(false);
                    changeIngredientFilters(ingredients);
                } else {
                    // Callback to change/render the list
                    changeDrinksFound(true);
                    searchDrinks(drinks);
                    changeIngredientFilters(ingredients);
                }
                
            }
        });
    }

    return (
        <div className="filter-bar" >
            <h4 className="carousel-title">Filter Drinks by Ingredient</h4>
            <Row>
            <Autocomplete
                freeSolo
                disableClearable
                id="outlined-helperText"
                className="text-field-search-bar"
                label="Add an Ingredient!"
                variant="outlined"
                getOptionLabel={(option) => option}
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
                value={ingredientVar}
            />
            <Button
                onClick={() => addIngredient(ingredientVar)}
                variant="contained"
                className="filter-button"
            >
            Add!</Button>
                <div className="tag-list">
                    {/* Add the minicomponents when there are filter items added */}
                    { drinksFound ? '' :
                    (<div class="add-ingredients-to-search">
                        No Drinks Found!
                    </div>)}
                    {ingredientFilters.length !== 0 ? ingredientFilters.map(ingredient => 
                        <div className="individual-ingredient">
                            {ingredient}
                            <HighlightOffIcon onClick={() => removeIngredient(ingredient)}></HighlightOffIcon>
                        </div>
                        )
                    : 
                    <div>
                        <h5 className="add-ingredients-to-search" >Add Ingredients to your Search!</h5>
                    </div>}
                </div>
            </Row>
            {/* <Row>
            </Row> */}
            <Row>
                <Button 
                className="filter-button" 
                color="primary"
                onClick={() => handleSearchDrinks()}
                >Search for Drinks!</Button>
            </Row>
        </div>
    );
}

export default SearchBar;