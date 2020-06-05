const MongoClient = require('mongodb').MongoClient;
const assert = require('assert').strict;

const url = 'mongodb://localhost:27017/';
const dbname = 'nucampsite';


MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => { //to connect to mongo db server

    assert.strictEqual(err, null); //strictly checks if err is equal to null

    console.log('Connected correctly to server.');

    const db = client.db(dbname);//client to access the db

    //first delete everything in the campsites collection
    //then we going to insert a document in the collection
    db.dropCollection('campsites', (err, result) => { //delete the old contents 
        assert.strictEqual(err, null);

        console.log('Dropped Collection');

        const collection = db.collection('campsites');

        collection.insertOne({name: "Breadcrumb Trail Campground", description: "Test"},
        (err, result) => {
            assert.strictEqual(err, null);
            console.log('Insert Document:', result.ops);

            collection.find().toArray((err, docs) => { // to be able to console log all the docs from the campsite collection.
                assert.strictEqual(err, null);
                console.log('Found Documents:', docs);

                client.close();
            });
        });
    });
});