require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const Phonebook = require('./models/phonebook')


const app = express()
morgan.token('body', (req,res) => req.method!=='GET' ? JSON.stringify(req.body) : " ")



app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('build'))

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      },
      {
        "name": "Beefy McWhatnow",
        "number": "12345678",
        "id": 75
      }
]
app.get('/', (req,res) => {
  res.send(`<div><h1>Hello World!</h1></div>`)
})
app.get('/api/persons', (req,res) => {
  Phonebook.find({})
    .then(persons =>{
      res.json(persons.map(person => person.toJSON()))
    })
})

app.get('/info', (req,res) => {
  res.send(`<div> <p>Phonebook has info for ${persons.length}</p> <p> ${new Date()} </p></div>`)
})

app.get('/api/persons/:id',(req,res,next) => {
  Phonebook.findById(req.params.id)
    .then(person =>{
      res.json(person.toJSON())
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req,res,next) => {
  Phonebook.findByIdAndRemove(req.params.id)
    .then(result =>{
      res.status(204).end()
    })
    .catch(error => next(erro))
})

app.put('/api/persons/:id', (req,res,next) =>{
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }
  Phonebook.findByIdAndUpdate(req.params.id, person, {new: true})
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))

})


app.post('/api/persons',(req,res) => {
  const body = req.body
  if(!body.name){
    return res.status(400).json({error: 'name missing'})
  }
  else if(!body.number){
    return res.status(400).json({error: 'number missing'})
  }
  else{
    const person = new Phonebook({
      name: body.name,
      number: body.number,
      id: Math.floor(Math.random()*100)
    })
    person.save()
      .then(savedPerson => {
        res.json(savedPerson.toJSON())
      })
  }
  
})

const errorHandler = (error, req, res, next) =>{
  console.log(error.message)
  if(error.name==='CastError' && error.kind==='ObjectId'){
    return res.status(400).send({error: 'malformatted id'})
  }
  next(error)
}
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log(`Server running on ${PORT}`)
})