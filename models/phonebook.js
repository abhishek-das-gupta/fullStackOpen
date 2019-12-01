const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
console.log('connecting to mongoDB')

mongoose.connect(url,{useNewUrlParser: true})
    .then(result =>{
        console.log('connected to mongoDB')
    })
    .catch(error =>{
        console.log('unable to connect: ', error.message)
    })

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String,
})

phonebookSchema.set('toJSON', {
    transform: (document,returnedObject) =>{
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Phonebook', phonebookSchema)