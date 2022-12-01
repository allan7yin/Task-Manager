const express = require('express');
const auth = require('../middleware/auth');
const User = require('..//models/user');
const multer = require('multer');
const router = new express.Router();
const sharp = require('sharp');


router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        const token = await user.generateAuthToken();
        await user.save(); // if this throws an error, the code below it will not be run, one of the benefit of async and await 
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e) {
        res.status(400).send();
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    // now, when we get users, first runs auth, the middleware, and if next is called, then processes the request 
    res.send(req.user);
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    });

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Update' });
    }

    try {
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        });

        await req.user.save()

        res.send(req.user);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/users/me', auth, async (req, res) => {
    try {

        await req.user.remove();
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

const upload = multer({
    // dest: 'avatars', need to get rid of this in order to get access toe image binary data, since if not saving here, it gets passed to cb in post route 
    // We are doing this as we want to save images not to one directory, but to the user model 
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true);
    }
});


router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => { // multiple middleware 
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    // .png converts it to a png format, resize is self-explanatory 

    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined; // removes the image if user is authorized 
    await req.user.save();
    res.send();
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar) {
            throw new Error();
        }

        res.set('Content-Type', 'image/jpg'); // sets response header, provide a key value pair 
        res.send(user.avatar);
    } catch (e) {
        res.status(404).send();
    }
})


module.exports = router;