import { generateText } from "../services/geminiService.js";
import { tryParseJSON } from "../utils/parser.js";

/**
 * POST /api/assessment/questions
 * body: { topic: string }
 * returns: { questions: Array<{id, question, options[], correct, difficulty,explaination}> }
 */
export async function getAssessmentQuestions(req,res){
    const {topic}=req.body || {};
    
    if(!topic) {
        return res.status(400).json({error:"topic is required"});
    }
    
    const schemaHint =`
    Array of 10 items :
    {
    "id": number,
    "question": string,
    "options":[string,string,string,string],
    "correct": 0|1|2|3,
    "difficulty": "Easy"|"Medium"|"Hard",
    "explanation": string
    }`;
    
    const prompt=`Generate 10 multiple choice questions in detail to assess ${topic}.
   Balance :~4 beginner, ~4 intermediate, ~2 advanced.
    Make questions specific and non-trivial.
    Include the correct option index in "correct".
    Respond ONLY with valid JSON. No extra text, no comments.
    ${schemaHint}
    `;

    try{
        const raw = await generateText(prompt); // get raw text from Gemini
        const data = tryParseJSON(raw); // parse using parser utility
        
        if(!data || !Array.isArray(data) || data.length !== 10){
            return res.status(500).json({error:"Invalid response format from AI service"});
        }
        
        return res.status(200).json(data);
    }
    catch(error){
        console.error("Error generating assessment questions:", error);
        console.error("Error details:", error.message);
        return res.status(500).json({
            error:"Failed to generate questions",
            details: error.message
        });
    }
}

/**
 * POST /api/assessment/evaluate
 * body: { answers: number[], questions: same format as above }
 * returns: { score: number, level: "Beginner"|"Intermediate"|"Advanced", breakdown }
 */

export async function evaluateAssessment(req,res){
    const {answers,questions}=req.body || {};
    
    if(!Array.isArray(answers) || !Array.isArray(questions)) {
        return res.status(400).json({error:"answers and questions are required arrays"});
    }
    
    if(answers.length !== questions.length) {
        // If we have more answers than questions, trim the answers
        if(answers.length > questions.length) {
            answers.splice(questions.length);
        } else {
            return res.status(400).json({
                error:"answers and questions length mismatch",
                details: `Expected ${questions.length} answers, got ${answers.length}`
            });
        }
    }

    let correct=0;
    let EasyCorrect=0,MediumCorrect=0,HardCorrect=0;

    questions.forEach((q,i)=>{
        const isRight=Number(answers[i])===Number(q.correct);
        if(isRight){
            correct++;
            if(q.difficulty == "Easy") EasyCorrect++;
            else if(q.difficulty=="Medium") MediumCorrect++;
            else if(q.difficulty=="Hard") HardCorrect++;
            
        }
    });

    const score =Math.round((correct/questions.length)*100);

    let level="Beginner";

    if(score>75 && HardCorrect>=2 && MediumCorrect>=3) level="Advanced";
    else if(score>50 && MediumCorrect>=3 && EasyCorrect>=3) level="Intermediate";

    return res.json({
        score,
        level,
        breakdown : {correct,EasyCorrect,MediumCorrect,HardCorrect}
    });
}