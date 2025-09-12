import { generateText } from "../services/geminiService.js";
import { tryParseJSON } from "../utils/parser.js";
import Roadmap from "../models/roadmap.model.js";
import User from "../models/user.model.js";
export async function createRoadmap(req,res){
    try
    {const {topic,duration,level,score,breakdown}=req.body;
    if(!topic ||  !duration || !level ) return res.status(400).json({error:"all of these fields are required"}); 
    const dur=Number(duration);

    if(!Number.isInteger(dur) || dur<=0 || dur >365 ) return res.status(400).json({error:"duration is not correct"});
        //days->multiple levels (each level)->multiple topics
    const schemaHint = `
Return EXACTLY a JSON object with this schema (no extra text, no comments):

{
  "topic": string,
  "duration": integer,
  "level": "Beginner"|"Intermediate"|"Advanced",
  "score": number,
  "days": [
    {
      "dayNumber": integer,
      "estimatedTime": integer, // minutes
      "levels": [
        {
          "levelNumber": integer,
          "topics": [
            {
              "title": string,
              "description": string,
              "resources": [string,string]
            }
          ]
        }
      ]
    }
  ]
}

Make "days" length equal to the provided duration.
  `;
const prompt = `
Generate a ${dur}-day learning roadmap for the topic "${topic}" for a user with skill level="${level}" and score=${score ? score : ""}% if exists and breakdown of answers ${breakdown ? JSON.stringify(breakdown) : ""} for [correct,easy,medium,hard] how much user did right in assessment if it exists.

- Each day should have 2-4 levels.
- Each level should contain 1-3 topics.
- Provide estimatedTime for each day (minutes).
- For each day, include **exactly 2 working documentation links** from **official sources only** (e.g., MDN, React Docs, Python Docs, TensorFlow Docs, etc.).
- **Do not include links from blogs, personal websites, or unofficial sources.**
- **Verify that each link returns HTTP status 200 and is not a 404 or redirect.**
- If no valid documentation links are available, write "Documentation not available" instead of giving broken links.
${schemaHint}
`;
    const raw=await generateText(prompt)

    const data=tryParseJSON(raw);

    if(!data || typeof data!== "object" || !Array.isArray(data.days) || data.days.length !== dur){
        console.error("Invalid roadmap from LLM: ",raw)
        return res.status(500).json({error:"Invalid roadmap format form llm"});
    }


    const roadmapDoc = await Roadmap.create({
      userId:req.user._id,
      topic: data.topic || topic,
      duration: dur,
      level: data.level || level,
      days: data.days,
    });
    const user=await User.findById(req.user._id);
    if(user){
        user.roadmapsCreated+=1;
        await user.save();
    }
    

    return res.status(201).json(roadmapDoc);}
    catch(err){
        return res.status(500).json({error:"Failed to create roadmap",error:err.message});
    }
}

/**
 * GET /api/roadmap/:id
 */

export async function getRoadmapById(req,res){
    try{
        const {id} =req.params;
        const roadmap =await Roadmap.findById(id).lean();
        if(!roadmap) return res.status(400).json({error:"Not Found"})
        return res.json(roadmap)
    }
    catch(err){
        console.error("create Roadmap error",err.message);
        res.status(500).json({error:"failed to fetch roadmap"});
    }
}


export const getMyRoadmaps=async (req,res)=>{
  
  try{
    console.log("req.user",req.user);
    if(!req.user._id){
      return res.status(400).json({message:"id isnt defined"})
    }
    const roadmaps=await Roadmap.find({userId:req.user._id});
    res.json(roadmaps);
  }
  catch(err){
    return res.status(500).json({message:"Failed to fetch roadmap",error:err.message})
  }
}
