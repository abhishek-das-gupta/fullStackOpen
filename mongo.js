const mongoose = require('mongoose')

if(process.argv.length < 3){
    console.log('give password as an argument')
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://ontheqt:${password}@cluster0-8xuqa.mongodb.net/phone-book-app?retryWrites=true&w=majority`

mongoose.connect(url, {useNewUrlParser: true})

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String,
})
const Phonebook = mongoose.model('Phonebook', phonebookSchema)
if(process.argv.length === 5){
    const person = new Phonebook({
        name: process.argv[3],
        number: process.argv[4]
    })
    
    person.save().then(result => {
        console.log(`added ${process.argv[3]} ${process.argv[4]}`)
        mongoose.connection.close()
    })
}

