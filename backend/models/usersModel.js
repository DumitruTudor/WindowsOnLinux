import mongoose from "mongoose";
import bcrypt from 'bcrypt';

// schema model for a user 
const usersSchema = new mongoose.Schema
(
    {
        username: 
        {
            type: String,
            required: true
        },
        
        email: 
        {
            type: String,
            required: true,
            unique: true
        },

        password:
        {
            type: String,
            required: true            
        },
        verified: 
        {
            type: Boolean,
            default: false
        },
    },

    {
        versionKey: false,
        timestamps: true,
    }
);
usersSchema.pre('save', async function(next) 
{
    const user = this;

    // Only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // Hash the password using bcrypt
    try 
    {
      // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } 
    catch (err) 
    {
        return next(err);
    }
});

// model for a user
const usersModel = mongoose.model('users', usersSchema);

export default usersModel;