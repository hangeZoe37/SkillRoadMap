import mongoose from "mongoose";

const TopicSchema=new mongoose.Schema(
    {
        title:String,
        description:String,
        resources:[String],
    },
    {_id:false}
);

const LevelSchema =new mongoose.Schema(
    {
        levelNumber:{type:Number,required:true},
        topics:[TopicSchema],
    },
    {_id:false}
);

const DaySchema = new mongoose.Schema(
    {
        dayNumber:{ type:Number,required:true},
        estimatedTime:{type:Number,default:60},
        levels:[LevelSchema]
    },
    {_id:false}
);

const RoadmapSchema = new mongoose.Schema(
    {
        userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
        topic : {type:String,required:true},
        duration:{type:Number,required:true},
        level:{type:String,enum:["Beginner","Intermediate","Advanced"],required:true},
        days:[DaySchema],
    },
    {timestamps:true}
);

const Roadmap=mongoose.model("Roadmap",RoadmapSchema);
export default Roadmap;

