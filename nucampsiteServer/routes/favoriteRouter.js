const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const Favorite =  require('../models/favorite');
const cors = require('./cors');
const favorite = require('../models/favorite');



const favoriteRouter = express.Router()

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({ user : req.user._id }) //returns user favorites
    .populate('user')
    .populate('campsites')
    .then(favorites => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user : req.user._id })
    .then( favorite => {
        if(favorite){
            req.body.forEach( 
                fav => {
                    const documentDoesnthaveFavorite = !favorite.campsites.includes(fav._id);
                    if (documentDoesnthaveFavorite){ 
                        favorite.campsites.push(fav._id);
                    }
            });
            favorite.save()
            .then(favorite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
            .catch(err => next(err));
        } else {
            Favorite.create({ user: req.user._id, campsites: req.body })
            .then(favorite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
            .catch(err => next(err));
        }
    })
    .catch(err => next(err));
})
.put(cors.cors, (req, res, next) => {
    res.statuscode = 403;
    res.end('PUT operation not supported on /favorite');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user : req.user._id })
    .then(favorite => {
        if(favorite) {
            favorite.remove()
            .then( favorite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
            .catch(err => next(err))
        } else {
        res.statusCode = 200; // reminder: Test 404 
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
        }
    })
    .catch( err => next(err));
})

favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser,(req, res, next) => { 
    res.statuscode = 403;
    res.end(`GET operation not supported on /favorite/${req.params.campsiteId}`);
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user : req.user._id })
    .then( favorite => {
        if(favorite){
            const favoriteId = req.params.campsiteId;
            const currentFavorite = favorite.campsites;
            if(currentFavorite.includes(favoriteId)){
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.send('This Campsite is already favorited');
            }
        } else {
            Favorite.create({ user: req.user._id, campsites: req.params.campsiteId })
            .then(favorite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
            .catch(err => next(err));
        }
    })
    .catch(err => next(err));
})
.put(cors.cors, (req, res, next) => {
    res.statuscode = 403;
    res.end(`PUT operation not supported on /favorite/${req.params.campsiteId}`);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
    .then( favorite => {
    if(favorite){
        const favId = req.params.campsiteId;
        const currentFavs = favorites.campsites;
        const index = currentFavs.indexOf(favId);

        if(index < -1){ 
            currentFavs.splice(index, 1);
        }
        favorite.save()
        .then(favorite => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        })
        .catch(err => next(err));
    } else{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
        }
    })
    .catch(err => next(err))
});
/*    
    Favorite.findOne({ user: req.user._id })
    .then(favorite => {
        if (favorite) {
            if (favorite.campsites.includes(req.params.campsiteId)){
                favorite.campsites.remove(req.params.campsiteId); // doublecheck remove() -> removing reff 
                favorite.save()
                .then(favorite => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
                .catch(err => next(err));
            } else {
                res.statusCode = 200;
                res.end('That campsite is NOT in the list of favorites!')
            }            
        } else {
            res.statusCode = 200;
            res.end('No favorites for the user');
        }
    }).catch(err => next(err));
*/
module.exports = favoriteRouter;