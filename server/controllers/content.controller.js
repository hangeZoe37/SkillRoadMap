export async function createLevelContent(req,res){
    try{
        const {topics}=req.body|| {};

        if(!Array.isArray(topics) )
            return res.status(400).json({error:"topics are required"})
        
        console.log("------loggen in user--------",req.user)
        res.status(200).json({"message":"level content created"})
    }
    catch(err){
        res.status(500).json({error:err.message})
    }
}