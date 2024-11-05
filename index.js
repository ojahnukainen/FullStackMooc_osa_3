const express = require('express')
const app = express()
require('dotenv').config()

//db related
const Person = require('./models/person')

app.use(express.static('dist'))

//middleware
const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError'){
    return response.status(400).send({ error: 'malformated id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
//middleware morgan settings
const morgan = require('morgan')
morgan.token('body', (req) =>
  Object.values(req.body)[0] ? JSON.stringify(req.body) : null
)
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

//cors related
const cors = require('cors')
app.use(cors())

app.use(express.json())

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const rndIDNumber = () => {
  const id = Math.floor(Math.random() * 9000)
  return String(id)
}


app.get('/', (request, response) => {
  response.send('<h1>Hello World!!!</h1>')
})

app.get('/info', (request, response) => {
  Person.find({}).then(results => {
    response.send(
      `<p>Phonebook has info for ${results.length} persons</p>
       <p>${Date()}</p>
      `)
  })

})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(results => {
    response.json(results)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(searchedPerson => {
      if (searchedPerson){
        response.json(searchedPerson)
      } else {
        response.status(404).end()
      }
    }).catch(error => {
      next(error)
    })
})

app.post('/api/persons/', (request, response,next) => {
  const body = request.body

  if(!body.name || !body.number){
    return response.status(404).json({
      error: 'Content missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    id: rndIDNumber(),
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    }).catch(error => {
      next(error)})
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(request.params.id, { name, number },{ new: true, runValidators: true, context: 'query' })
    .then(updatePerson => {
      response.json(updatePerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(deletedPerson => {
      if(deletedPerson){
        response.status(200).send('Deleted successfully')
      } else {
        response.status(404).send('User not found')
      }
    }).catch(error => {
      next(error)
    })
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server sunning on port ${PORT}`)
})