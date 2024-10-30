const express = require('express')
const app = express()

app.use(express.json())

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": "1"
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": "2"
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": "3"
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": "4"
  }
]
const rndIDNumber = () => { 
  const id = Math.floor(Math.random() * 9000)
  return String(id)
}


app.get('/', (request, response) =>{
  response.send('<h1>Hello World!!!</h1>')
})

app.get('/info', (request, response) => {
  const note = request.params
  console.log(note)

  response.send(
    `<p>Phonebook has info for ${persons.length} persons</p>
     <p>${Date()}</p>
    `)
  })

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)

  person !== undefined ? response.json(person) : response.status(404).end()
})

app.post('/api/persons/', (request, response) => {
  const body = request.body
  

  if(!body.name || !body.number){
    return response.status(404).json({
      error: 'Content missing'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: rndIDNumber(),
  }

  const check = persons.find(search => search.name === body.name)

  if(check !== undefined) {
    return response.status(404).json({error: "name must be unique"})
  }   
  
  persons = persons.concat(person)
  response.json(person)
  
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
 persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})
const PORT = 3001
app.listen(PORT,() =>{
  console.log(`Server sunning on port ${PORT}`)
})