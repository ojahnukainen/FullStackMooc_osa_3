const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const db_password = process.argv[2]
const db_url = process.env.MONGODB_URI

console.log('connecting to', db_url)
mongoose.connect(db_url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

  const personSchema = new mongoose.Schema({
    name: {
      type: String,
      minlength: 3,
      required: true
    },
    number: {
      type: String,
      validate: {
        validator: (v)=> {
          return /\d{2,3}[-]\d{3,7}/.test(v)
        },message: props => `${props.value} is not acceptable. Form should be 2-3 and - then 3-7 numbers`
      },
      requaired: [true, 'Number needed']
    },
  })
  
  personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  module.exports = mongoose.model('Person', personSchema)