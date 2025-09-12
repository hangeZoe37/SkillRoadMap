import axios from "axios";

export async function createRoadmap(topic,duration,level,score,breakdown){
    try{
        const response=await axios.post(
            "http://localhost:6001/api/roadmap/createRoadMap",
            {topic,duration,level ,score,breakdown}
        );
        console.log(response.data);
        return response.data;        
    }
    catch(error){
        console.log("error fetching the roadmap",error);
        throw error;
    }
}

export async function getMyRoadmaps(){
    try {
        const res=await axios.get(
            "http://localhost:6001/api/roadmap/getMyroadmaps"
        );
        console.log(res.data);
        
        return res.data;
    } catch (error) {
        console.log("error fetching roadmaps", error);
        throw error;
    }
}