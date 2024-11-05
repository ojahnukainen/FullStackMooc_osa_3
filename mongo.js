const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const db_password = process.argv[2]

const url = `mongodb+srv://ojahnukainen:${db_password}@cluster0.ahtvb.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: process.argv[3],
  number: process.argv[4]
})

const findAll = () => {
  Person.find({}).then(result =>{
  result.length === 0 ? console.log("Phonebook is empty") : console.log("Phonebook:")
  result.forEach(person => {
    console.log(person.name, person.number)
  })
  mongoose.connection.close()
})
}

const createNewPerson = () => {
  person.save().then(result =>{
  console.log(`added ${process.argv[3]} with number ${process.argv[4]} to phonebook`)
  mongoose.connection.close()
})
}

process.argv.length > 3 ?
createNewPerson() : findAll()

