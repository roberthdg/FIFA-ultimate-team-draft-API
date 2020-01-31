const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const controllers = require('./controllers')
const multer = require('multer');

const fileStorageSettings = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'src/uploads/')
    }, 
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
});

const fileTypeFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') cb(null, true);
    else cb(null, false);
};

const fileUploadSettings = multer({
    storage: fileStorageSettings, 
    limits: {fileSize: 1024 * 1024 * 5}, 
    fileFilter: fileTypeFilter
});

function apiAuthenticationMiddleware() {  
	return (req, res, next) => {
      try {
         const accessToken = req.headers.authorization.split(" ")[1];
         const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
         req.userData = decoded;
         next();
      } catch (error){
         return res.status(401).json({message:'Auth Failed'});
      }
	}
}

router.post('/signup', controllers.userSignup);

router.post('/login', controllers.userLogin);

router.post('/token', controllers.refreshToken);

router.get('/search/:playerId', controllers.playerSearch);

router.post('/draft', controllers.playerDraft);

router.get('/all', apiAuthenticationMiddleware(), controllers.playerList);

router.post('/submit', apiAuthenticationMiddleware(), fileUploadSettings.single('playerCard'), controllers.playerSubmit);

router.delete('/:playerId', apiAuthenticationMiddleware(), controllers.playerDelete);

router.patch('/:playerId', apiAuthenticationMiddleware(), controllers.playerUpdate);

module.exports = router;