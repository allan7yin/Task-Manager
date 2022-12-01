const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 3000;

const multer = require('multer');
const upload = multer({
    dest: 'images' // folder where all of the uploads will be stored, can name it images for this project, as only storing images 
});
app.post('/upload', upload.single('upload'), (req, res) => { // the second parameter is middleware, need it
    res.send()
})

app.use(express.json()); // this automatically parses incoming JSON into an object, so that it can be accessed 
app.use(userRouter); // places our routes in external modules now 
app.use(taskRouter);



app.listen(port, () => {
    console.log('Server is up on port ' + port)
});

const Task = require('./models/task');
const User = require('./models/user')

