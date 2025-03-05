import { db } from "../name";
import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import { databases } from "./config";
import createQuestionCollection from "./question.collection";
import createVoteCollection from "./vote.collection";

export default async function getOrCreateDB() {
    try {
        await databases.get(db)
        console.log("database connected");
        
    } catch (error) {
       try {
           await databases.create(db, db)
           console.log("database created");
           await Promise.all([
               createAnswerCollection(),
               createQuestionCollection(),
               createCommentCollection(),
               createVoteCollection(),
           ])
           console.log("collection created");
           console.log("Database created");
           
           
       } catch (error) {
        console.log("error creating databases or collections", error);
        
       } 
    }
    return databases
}