const morgan = require('morgan');
const express = require('express');
const app = express();

morgan.token('body', (req, res) => JSON.stringify(req.body));

app.use(morgan(':method :url :status - :response-time ms :body'));

app.use(express.json())

let phonebook = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

const generateID = () => {
  let id = Math.floor(Math.random() * 100)
  const idList = phonebook.map(phone => phone.id)
  while (id in idList){
    id = Math.floor(Math.random() * 100)
  }
  return id;
}

app.get('/api/phonebook', (resquest, response) => {
  response.json(phonebook)
})

app.get('/api/phonebook/:id', (request, response) => {
  const id = Number(request.params.id)
  const phone = phonebook.find(phone => phone.id === id)
  if (phone){
    response.json(phone)
  }
  else{
    response.status(404).end()
  }
})

app.delete('/api/phonebook/:id', (request, response) => {
  const id = Number(request.params.id)
  phonebook = phonebook.filter(phone => phone.id !== id)
  response.json(phonebook)
})

app.post('/api/phonebook', (request, response) => {
  const body = request.body
  if (!body.name || !body.number){
    return response.status(400).json({
      error: "Name or/and Number is missing"
    })
  }

  if (phonebook.some(phone => phone.name === body.name)){
    return response.status(400).json({
      error: "name must be unique"
    })
  }

  const phone = {
    id: generateID(),
    name: body.name,
    number: body.number
  }

  phonebook = phonebook.concat(phone)
  response.json(phonebook)
})

const PORT = 3001
app.listen(PORT, ()=>{
  console.log(`Server running at ${PORT}`)
})