const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./route/index');
const app = express();
const { PORT}=require('./config/server-config');

const startAndRunServer = () => {
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cors());
    app.use((req, res, next) => { 
        console.log(req.body);
        next();
    })
    // Sample route
    app.use("/shorturls",router)
    
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}
startAndRunServer();