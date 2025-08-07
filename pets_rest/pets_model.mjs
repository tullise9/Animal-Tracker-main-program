import mongoose from 'mongoose';
import 'dotenv/config';

const PETS_DB_NAME = 'pets_db';

let connection = undefined;

async function connect(){
    try{
        connection = await mongoose.connect(process.env.MONGODB_CONNECT_STRING, 
                {dbName:  PETS_DB_NAME});
        console.log("Successfully connected to MongoDB using Mongoose!");
    } catch(err){
        console.log(err);
        throw Error(`Could not connect to MongoDB ${err.message}`)
    }
}

//Define the schema
const petSchema = new mongoose.Schema({
    name: { type: String, required: true },
    birthday: { type: Date, required: true },
    funfact: { type: String },
    photoUrl: { type: String }  // store a link or later a file path
  });

//Compile the model from the schema.
const Pet = mongoose.model('Pet', petSchema);

//for POST to use
const createPet = async (name, birthday, funfact = '', photoUrl = '') => {
    const pet = new Pet({name: name, birthday: birthday, funfact: funfact, photoUrl: photoUrl });
    return pet.save();
} 


async function getPets(name) {
    if (name) {
      return Pet.find({ name: { $regex: name, $options: 'i' } });
    } else {
      return Pet.find();
    }
  }

async function getPetById(id) {
      const pet = await Pet.findById(id);
      return pet
  }

  async function updatePet(id, dataToUpdate) {
    await Pet.findByIdAndUpdate(id, dataToUpdate)
    return await Pet.findById(id)
}

async function deletePetById(id) {
  return await Pet.findByIdAndDelete(id);
}

export{connect, Pet, createPet, getPets, updatePet, getPetById, deletePetById}