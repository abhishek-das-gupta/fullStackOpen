const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')


morgan.token('body', (req,res) => req.method!=='GET' ? JSON.stringify(req.body) : " ")

const app = express()

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
    res.json(persons)
})

app.get('/info', (req,res) => {
  res.send(`<div> <p>Phonebook has info for ${persons.length}</p> <p> ${new Date()} </p></div>`)
})

app.get('/api/persons/:id',(req,res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)
  if(!person){
    res.json(404).end()
  }
  else{
    res.json(person)
  }
})

app.delete('/api/persons/:id', (req,res) => {
  const id = Number(req.params.id)
  const perosn = persons.find(p => p.id === id)
  res.status(204).end()
})

app.post('/api/persons',(req,res) => {
  const body = req.body
  if(!body.name){
    return res.status(400).json({error: 'name missing'})
  }
  else if(!body.number){
    return res.status(400).json({error: 'number missing'})
  }
  else if(persons.find(p => p.name === body.name) !== undefined){
    return res.status(400).json({error: 'name already exists'})
  }
  else{
    const person = {
      name: body.name,
      number: body.number,
      id: Math.floor(Math.random()*100)
    }
    persons = persons.concat(person)
    res.json(person)
  }
  
})


const PORT = process.env.PORT || 3004
app.listen(PORT, ()=>{
    console.log(`Server running on ${PORT}`)
})