import mongoose from "mongoose";

const URI="mongodb+srv://pabloeltano:tier26@cluster0.6a9bfhe.mongodb.net/ecommerce?retryWrites=true&w=majority"
 
const connectToDB = () => {
    try {
        mongoose.connect(URI)
        console.log('connected to DB ecommerce')
    } catch (error) {
        console.log(error);
    }
};

export default connectToDB