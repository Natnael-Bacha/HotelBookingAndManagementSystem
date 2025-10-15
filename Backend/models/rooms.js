import mongoose from "mongoose";

const roomSchema = mongoose.Schema({
    roomNumber: {
        type: String,
        unique: true,
        required: true,
    },
    roomStandard: {
        type: String,
        required: true,
    },
    roomPrice: {
        type: String,
        unique: true,
        required: true,
    },
    numberOfBeds:{
        type: String,
        required: true,
    },
    available:{
        type: Boolean,
        required: true,
    },
    petFriendly:{
        type: Boolean,
        required: true,       
    }
    
},
   {timestamps: true}
)

const Room = mongoose.model("Room", roomSchema);

export default Room;