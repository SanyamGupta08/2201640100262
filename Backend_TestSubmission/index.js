const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./route/index');
const app = express();
const PORT = process.env.PORT || 3000;

const startAndRunServer = () => {
    app.use(bodyParser.json());
    app.use(cors());

    // Sample route
    app.use("/shortUrls",router)
    
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}
startAndRunServer();