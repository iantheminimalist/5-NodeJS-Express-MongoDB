const MongoClient = require('mongodb').MongoClient;
const assert = require('assert').strict;
const dboper = require('./operations');



const url = 'mongodb://localhost:27017/';
const dbname = 'nucampsite';


MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => { //to connect to mongo db server

    assert.strictEqual(err, null); //strictly checks if err is equal to null

    console.log('Connected correctly to server.');

    const db = client.db(dbname);//client to access the db

    //first delete everything in the campsites collection
    //then we going to insert a document in the collection
    db.dropCollection('campsites', (err, result) => { //delete the old contents 
        
        
        console.log('Dropped Collection', result);
  dboper.insertDocument(db, { name: "Breadcrumb Trail Campground", description: "Test"},
            'campsites', result => {
            console.log('Insert Document:', result.ops);

            dboper.findDocuments(db, 'campsites', docs => {
                console.log('Found Documents:', docs);

                dboper.updateDocument(db, { name: "Breadcrumb Trail Campground" },
                    { description: "Updated Test Description" }, 'campsites',
                    result => {
                        console.log('Updated Document Count:', result.result.nModified);

                        dboper.findDocuments(db, 'campsites', docs => {
                            console.log('Found  Documents:', docs);
                            
                            dboper.removeDocument(db, { name: "Breadcrumb Trail Campground" },
                                'campsites', result => {
                                console.log('Deleted Document Count:', result.deletedCount);

                                client.close();
                        }); //removeDocument

                    });//findDocuments
                });//updateDocument
            });//findDocuments

            });//insertDocument
        });
    });