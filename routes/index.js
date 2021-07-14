const express = require('express');
const router = express.Router();
const { uuid } = require('uuidv4');

/* GET home page. */
router.get('/check', function(req, res, next) {
  res.send({ message: 'OKEY' })
});

router.get('/', function(req, res, next) {
  res.redirect(`/${uuid()}`)
});

router.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room });
})

module.exports = router;