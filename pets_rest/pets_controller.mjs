import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import asyncHandler from 'express-async-handler';
import * as pets from './pets_model.mjs'

const ERROR_INVALID_REQ = {Error: 'Invalid request'};
const ERROR_NOT_FOUND = {Error: "Not found"};
const PORT = process.env.PORT;
const app = express();

app.use(cors()); 
app.use(express.json());

app.listen(PORT, async () => {
    await pets.connect()
    console.log(`Server listening on port ${PORT}...`);
});

function isValidRequest(req) {
    const { name, birthday } = req.body;
    return Boolean(name && birthday);  
}


app.post('/pets', asyncHandler(async (req, res) => {
    if(!isValidRequest(req)){
        res.status(400).json(ERROR_INVALID_REQ)
    } else {
    const pet = await pets.createPet(req.body.name, 
                            req.body.birthday, 
                            req.body.funfact,
                            req.body.imageUrl);
    res.status(201).json(pet);
    }    
}))

app.get('/pets', asyncHandler(async (req, res) => {
    const {name} = req.query;              
    const petsList = await pets.getPets(name);  

    if (petsList.length === 0) {
        return res.status(404).json({ message: "No pet found" });
    }
    res.json(petsList);  
}))

app.get('/pets/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const pet = await pets.getPetById(id);
    if (!pet) {
        return res.status(404).json({ message: "Pet not found" });
      }
  
      res.json(pet);
    }))

app.put('/pets/:id', asyncHandler(async (req, res) => {
    const {id} = req.params;
    const updates = req.body;
  
    const pet = await pets.updatePet(id, updates);
    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }
    res.json(pet);
  }));

  app.delete('/pets/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedPet = await pets.deletePetById(id);

    if (!deletedPet) {
        return res.status(404).json({ message: "Pet not found" });
    }

    res.json({ message: "Pet successfully deleted" });
}));

