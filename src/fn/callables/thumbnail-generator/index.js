const thumbsupply = require('thumbsupply');

const express = require('express');
const router = express.Router();

router.post('/video', async (req, res) => {
    // await authorize();
    if (!req.body) {
        return null;
    }

    const {videoUrl} = req.body;

    const thumb = await thumbsupply.generateThumbnail(videoUrl);
    console.log('thumbsupply video, thumb', thumb)
    res.json(thumb);
});

router.post('/image', async (req, res) => {
    // await authorize();
    if (!req.body) {
        return null;
    }

    const {imageUrl} = req.body;

    // const data = await image(req.body);
    // res.json(data);
});

module.exports = router;

