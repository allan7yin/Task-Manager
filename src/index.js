const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // this automatically parses incoming JSON into an object, so that it can be accessed 
app.use(userRouter); // places our routes in external modules now 
app.use(taskRouter);

app.listen(port, () => {
    console.log('Server is up on port ' + port)
});