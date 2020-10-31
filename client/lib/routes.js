import axios from 'axios';
import API_KEY from './hiddenKey';

const getRandomDrinks = (callback) => {
    // change to an API key AND use the random enpoint once given a Key 
    axios.get(`https://www.thecocktaildb.com/api/json/v2/${API_KEY}/randomselection.php`)
        .then(data => callback(null, data))
        .catch(err => callback(err, null));
}

export default {
    getRandomDrinks,

}