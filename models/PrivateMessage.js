const mongoose = require('mongoose');

// //MongoDB private_messages Schemas
// var private_message = mongoose.model('private_messages',{
//     from_user : String,
//     to_user : String,
//     message : String,
//     date_sent: Date
//   })

const PrivateMessageSchema = new mongoose.Schema({
    from_user: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    to_user: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    message: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    date_sent: {
        type: Date,
        default: Date.now
    }
})

const PrivateMessage = mongoose.model("PrivateMessage", PrivateMessageSchema);
module.exports = PrivateMessage;