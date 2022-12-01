const express = require('express');
const auth = require('../middleware/auth');
const Task = require('..//models/task');

const router = new express.Router();

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,  // this is es6 spread operator, copies all of the properties from body 
        owner: req.user._id
    })

    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
})


// GET /tasks?completed=false, only get the incomplete tasks
// GET /tasks?completed=true, only get the complete tasks

// we also want to implement pagination here 
// limit skip 
// GET /tasks?limit=10&skip=0
// here, limit 
router.get('/tasks', auth, async (req, res) => {
    const match = {
        owner: req.user._id,
    }
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === "true"
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split('_'); // this splits the string by the character passed, which in our case is the underscore, so now we know the type of sorted needed to be done 
        sort[parts[0]] = parts[1] === "desc" ? -1 : 1
    }

    try {
        const tasks = await Task.find(
            match,
            null,
            {
                limit: parseInt(req.query.limit), // this is from query string, a string, need integer, this js function converts this for us
                skip: parseInt(req.query.skip),
                sort
            }
        );

        res.status(200).send(tasks);
    } catch (error) {
        res.status(500).send(error);
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findOne({ _id, owner: req.user._id });

        if (!task) {
            return res.status(404).send();
        }

        res.status(200).send(task)
    } catch (error) {
        res.status(500).send(error);
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    });

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Update' });
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

        if (!task) {
            return res.status(404).send();
        }

        updates.forEach((update) => {
            task[update] = req.body[update];
        })

        await task.save();

        res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

        if (!task) {
            return res.status(404).send();
        }

        res.status(200).send(task);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;