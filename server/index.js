const express = require('express');
const app = express();
const PORT = 3333;


app.use(express.static('../client/dist'));
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Now Drinking on port ${PORT}`);
});