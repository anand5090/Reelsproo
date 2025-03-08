import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

// Define the IUser interface
export interface IUser {
    email: string;
    password: string;
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

// Define the userSchema
const userSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,

    }
);

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
    }
    next(); 
});

const User = models.User || model<IUser>("User", userSchema);

export default User;
