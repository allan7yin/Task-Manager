// First, we want to learn how to perform all of the crud operations. 
// CRUD stands for create, read, update, and delete. Need all of these operations to manage data successfully 

//const mongodb = require('mongodb');
//const MongoClient = mongodb.MongoClient;
//const ObjectID = mongodb.ObjectId;

const  { MongoClient, ObjectId } = require('mongodb'); // destructuring, the same as the above three lines 

const connectionURL = 'mongodb://127.0.0.1:27017';
// the above is the same as writing 'mongodb://localhostL27017', instead, we have used the ip address instead of local host as it is fatser, we don't know
// why that is, it just is
const databaseName = 'task-manager';

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to the database');
    }

    const db = client.db(databaseName);

    /*
    db.collection('users').findOne({ name: 'Sophia'}, (error, response) => {
        if (error) {
            console.log('Unable to fetch');
        }

        console.log(response);
    })

    // here is how we would query with the object unique id. We would need to instantiate a new object fro the unique class id to do so 
    db.collection('users').findOne({ _id: new ObjectId('634609427619e734dcb027ea') }, (error, response) => {
        if (error) {
            console.log('Unable to fetch');
        }

        console.log(response);
    });

    // the below returns an array of all entries of age 19
    db.collection('users').find({ age: 19 }).toArray((error, response) => {
        console.log(response);
    })

    // the below returns a count of how many entries are of age 19
    db.collection('users').find({ _id: new ObjectId('634609427619e734dcb027ea')}).count((error, response) => {
        console.log(response);
    })
    
    
    db.collection('users').updateOne({ _id: new ObjectId('6345f645eb439883b8754bf9')}, {
        $set: {
            name: 'Bob'
        }
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error) 
    });


    db.collection('tasks').updateMany({ 
        completed: false
    }, {
        $set: {
            completed: true
        }
    }).then((result) => {
        console.log(result.modifiedCount);
    }).catch((error) => {
        console.log(error);
    })

    */

    db.collection('users').deleteMany({
        name: 'Allan'
    }).then((result => {
        console.log(result)
    })).catch((error) => {
        console.log(error)
    })
})






























// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    /* HERE IS SOME OF THE CODE RELATED TO CREATING A CONTAINER IN THE DB, AND ADDING ENTRIES TO IT 

    MongoClient.connect(connectionURL, { useNewUrlParser: true}, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database!');
    }

    const db = client.db(databaseName);
    // recall that as MongoDB is a nosql database, we have collections instead of tables. So, ti insert a document, we need to know which collection to insert into.

    db.collection('users').insertOne({
        name: 'Allan',
        age: 19
    })


    db.collection('tasks').insertMany([
        {
            description: 'Finish NodeJS course',
            completed: false
        },
        {
            description: 'Practice LeetCode',
            completed: false
        },
        {
            description: 'Diet',
            completed: false
        },
        {
            description: 'Study hard',
            completed: true
        }
    ]);

    */



