import express from 'express';
const appFuntions = require('./routes/appFunctions');
const appLoguin = require('./routes/appLoguin');

require('dotenv').config();

const app = express();
const PORT = 3000;

const cors = require('cors');

var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200,
    methods: "GET, PUT, POST, DELETE",
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/loguin', appLoguin);
app.use('/functions', appFuntions)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

// Problema de middleware en angular, si lo uso con postman 
//funciona bien, si lo uso con google tambie, si uso la app 
//entra siempre al middleware.





