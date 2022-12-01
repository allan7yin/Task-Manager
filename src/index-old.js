const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // this automatically parses incoming JSON into an object, so that it can be accessed 

// USERS ------------------------------------------------------------------------------------------------------------
app.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save(); // if this throws an error, the code below it will not be run, one of the benefit of async and await 
        res.status(201).send(user);
    } catch (e) {
        res.status(400).send(e);
    }

    // user.save().then(() => {
    //     res.send(user);
    // }).catch((error) => {
    //     res.status(400).send(error); // can chain these as they return promises 
    //     //res.send(error);
    // })
})

app.get('/users', (req, res) => {
    User.find({}).then((users) => {
        res.send(users)
    }).catch((error) => {
        res.status(500).send();
    })
})

app.get('/users/:id', (req, res) => {
    const _id = req.params.id;
    User.findOne({
        id: _id
    }).then((user) => {
        if (!user) {
            return res.status(404).send();
        }
        res.send(user)
    }).catch((error) => {
        res.status(500).send();
    })
})

// TASKS ------------------------------------------------------------------------------------------------------------

app.post('/tasks', (req, res) => {
    const task = new Task(req.body)

    task.save().then(() => {
        res.send(task);
    }).catch((error) => {
        res.status(400).send(error);
    })
})

app.get('/tasks', (req, res) => {
    Task.find({}).then((tasks) => {
        res.send(tasks)
    }).catch((error) => {
        res.status(500).send();
    })
})

app.get('/tasks/:id', (req, res) => {
    const _id = req.params.id;
    Task.findOne({
        id: _id
    }).then((task) => {
        if (!task) {
            return res.status(404).send();
        }
        res.send(task)
    }).catch((error) => {
        res.status(500).send();
    })
})


app.listen(port, () => {
    console.log('Server is up on port ' + port)
});

