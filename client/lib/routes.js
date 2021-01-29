import axios from 'axios';
import API_KEY from './hiddenKey';


// ----------- DB Queries ------------
const getAllUsers = (callback) => {
    axios.get('http://localhost:3333/users')
        .then(data => callback(null, data))
        .catch(err => callback(err, null));
}
const getOneUser = (username, callback) => {
    axios.get(`http://localhost:3333/users/${username}`)
        .then(data => callback(null, data))
        .catch(err => callback(err, null));
}
const postNewUser = (info, callback) => {
    axios.get('http://localhost:3333/users', info)
        .then(data => callback(null, data))
        .catch(err => callback(err, null));
}
const updateExistingUser = (username, newIngredients, callback) => {
    axios.put('http://localhost:3333/users/update', { name: username, ingredients: newIngredients })
        .then(data => callback(null, data))
        .catch(err => callback(err, null));
}

// ----------- API CALLS ------------

// Get 10 Random Drinks
const getRandomDrinks = (callback) => {
    // change to an API key AND use the random enpoint once given a Key 
    axios.get(`https://www.thecocktaildb.com/api/json/v2/${API_KEY}/randomselection.php`)
        .then(data => callback(null, data))
        .catch(err => callback(err, null));
}

// Search for an ingredient by name
const searchIngredients = (search, callback) => {
    axios.get(`https://www.thecocktaildb.com/api/json/v2/${API_KEY}/filter.php?i=${search}`)
        .then(data => callback(null, data))
        .catch(err => callback(err, null));
}

// Gives back a list of drinks based on a single ingredient
const filterByIngredient = (ingredient, callback) => {
    axios.get(`https://www.thecocktaildb.com/api/json/v2/${API_KEY}/filter.php?i=${ingredient}`)
        .then(data => callback(null, data))
        .catch(err => callback(err, null));
}

// Search for a drink based on ingredients
const filterSearchDrinks = (list, cbFunction) => {
    // good ingredients and bad ingredients list
    const overallDrinksFound = [];

    const recursivelyFind15Drinks = (ingredientsList, drinksFound, callback) => {
        // takes in an ingredients list. 
        let stringArrayOfIngredients = JSON.stringify(ingredientsList);
        // splits and turns the list into a string
        let arrayOfIngredients = stringArrayOfIngredients.split('"').join(''); // Remove the quotes
        arrayOfIngredients = arrayOfIngredients.split(' ').join('_'); // Add underscores for multiword filters
        arrayOfIngredients = arrayOfIngredients.split('');
        arrayOfIngredients.splice(0, 1); // remove the front brackets
        arrayOfIngredients.splice(arrayOfIngredients.length - 1, 1); // remove the back brackets
        arrayOfIngredients = arrayOfIngredients.join(''); // join into a list of comma separated words/ingredients


        // queries the API
        if (ingredientsList.length > 1) { // Check which query to make
            console.log(arrayOfIngredients);
            axios.get(`https://www.thecocktaildb.com/api/json/v2/${API_KEY}/filter.php?i=${arrayOfIngredients}`)
                .then((data) => {
                    console.log(data);

                    if (data.data.drinks === 'None Found') {
                        // remove last ingredient and run again
                        console.log('NONE FOUND --> POP AND TRY AGAIN');
                        let newIngredients = ingredientsList;
                        newIngredients.pop();
                        recursivelyFind15Drinks(newIngredients, drinksFound, callback);
                    } else {
                        if (data.data.drinks.length + drinksFound.length < 15) {
                            console.log('SOME FOUND --> Pop and try again after adding to the drinks found');
                            drinksFound.concat(data.data.drinks);
                            // remove last ingredient and run again
                            let newIngredients = ingredientsList;
                            newIngredients.pop();
                            recursivelyFind15Drinks(newIngredients, drinksFound, callback);
                        } else {
                            console.log('ENOUGH FOUND --> Combine data with drinks found and return with callback.');
                            drinksFound.concat(data.data.drinks);
                            callback(null, { data: { drinks: drinksFound } });
                        }
                    }  
                })
                .catch(err => {
                    console.log(err);
                    callback(err,null);
                });
        } else {
            if (drinksFound.length > 9) {
                callback(null, { data: { drinks: drinksFound } })
            } else {
                filterByIngredient(arrayOfIngredients, (err, data) => {
                    if (err) {
                        callback(err, null);
                    } else {
                        drinksFound.concat(data.data.drinks);
                        console.log(drinksFound);
                        callback(null, { data: { drinks: drinksFound} } );
                    }
                });
            }
        }
    }
    
    recursivelyFind15Drinks(list, overallDrinksFound, cbFunction);










    // let string = JSON.stringify(list);
    // let newList = string.split('"').join(''); // turn into a string for the url

    // newList = newList.split(''); 
    // newList.splice(0,1);
    // newList.splice(newList.length-1, 1); // remove the brackets
    // newList = newList.join('');

    // if (newList.split(',').length > 1) {
    //     axios.get(`https://www.thecocktaildb.com/api/json/v2/${API_KEY}/filter.php?i=${newList}`)
    //     .then(data => callback(null, data))
    //     .catch(err => callback(err, null));
    // } else {
    //     filterByIngredient(newList, callback);
    // }
}

// Search for a drink based on name
const searchDrinks = (search, callback) => {
    axios.get(`https://www.thecocktaildb.com/api/json/v2/${API_KEY}/search.php?s=${search}`)
        .then(data => callback(null, data))
        .catch(err => callback(err, null));
}


// Gets all of the ingredients for autorecomendations
const getIngredients = (callback) => {
    axios.get(`https://www.thecocktaildb.com/api/json/v2/${API_KEY}/list.php?i=list`)
        .then(data => callback(null, data))
        .catch(err => callback(err, null));
}





export default {
    getRandomDrinks,
    searchDrinks,
    searchIngredients,
    filterByIngredient,
    getIngredients,
    filterSearchDrinks,
    getAllUsers,
    getOneUser,
    postNewUser,
    updateExistingUser
}