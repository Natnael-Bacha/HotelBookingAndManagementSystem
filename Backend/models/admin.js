import mongoose from 'mongoose'

const adminSchema = mongoose.Schema({
    firstName:{
        type: String,
        required: true,
    },
    middleName:{
        type: String,
        required: true,
    },
    lastName:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    idNumber:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    }
},
{timestamps: true}
)

const User = mongoose.model("User", adminSchema);

export default User;