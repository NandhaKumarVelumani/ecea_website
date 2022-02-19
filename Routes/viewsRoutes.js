const express = require('express');

const viewsController = require('../Controllers/viewsController');

const router = express.Router();

router.get('/', viewsController.getHome);