const express = require('express')
const app = express()
const { MongoClient, ObjectID } = require('mongodb')


app.use(express.json())

const mongourl = 'mongodb://localhost:27017'
const dbname = 'contactL'

MongoClient.connect(mongourl, {
    useUnifiedTopology: true
}, (err, client) => {
    if (err) throw err
    console.log('DataBase is connected')
    let db = client.db(dbname)

    app.post('/contactList', (req, res) => {
        console.log(req.body)
        db.collection('contacts').insertOne(req.body, (err, contact) => {
            if (err) throw err
            res.send(contact)
            console.log(contact)
        })
    })

    app.get('/allcontacts', (req, res) => {
        db.collection('contacts').find().toArray((err, contacts) => {
            if (err) throw err
            res.send(contacts)
        })
    })
    app.get('/contact/:id', (req, res) => {
        let contactid = ObjectID(req.params.id)
        db.collection('contacts').findOne({ _id: contactid }, (err, contacts) => {
            if (err) throw err
            res.send(contacts)
        })
    })
    app.delete('/deleteContact/:id', (req, res) => {
        let contactid = ObjectID(req.params.id)
        db.collection('contacts').findOneAndDelete({ _id: contactid }, (err, data) => {
            if (err) throw err
            if (data.value) {
                db.collection('contacts').find().toArray((err, contacts) => {
                    if (err) throw err
                    res.send(contacts)
                })
            } else {
                res.send('contact not found')
            }
        })
    })
    app.put('/editContact/:id', (req, res) => {
        let contactid = ObjectID(req.params.id)
        db.collection('contacts').findOneAndUpdate({ _id: contactid }, { $set: { ...req.body } }, (err, data) => {
            if (err) throw err
            db.collection('contacts').findOne({ _id: contactid }, (err, contacts) => {
                if (err) throw err
                res.send(contacts)


            })

        })
    })
})

app.listen(5000 , (err)=>{
    if (err) throw err 
    console.log('server is runing on port 5000')
} )

