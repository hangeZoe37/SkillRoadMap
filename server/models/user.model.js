import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required:true,
            trim:true
        },
        email:{
            type:String,
            required:true,
            lowercase:true,
            trim:true
        },
        password:{
            type:String,
            required:true,
            select:false// select:false hides by default
        },
        roadmapsCreated:{
            type:Number,
            default:0
        },
        currentProgress : [
            {
                roadmapId:{type:mongoose.Schema.Types.ObjectId,ref:"Roadmap"},
                currentDay:Number,
                currentLevel:Number,
            },
        ],
    },{timestamps:true}
);

UserSchema.index({email:1},{unique:true});


const User=mongoose.model("User",UserSchema);
export default User;