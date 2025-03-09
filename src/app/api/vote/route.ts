import { databases } from "@/models/client/config";
import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
import { users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";

import { NextRequest, NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";

export async function POST(request: NextRequest) {
    try {
        //grab tyhe data
        const { votedById, voteStatus, type, typeId } = await request.json() 
        

        //list-document

        const response = await databases.listDocuments(
            db, voteCollection, [
                Query.equal("type", type),
                Query.equal("typeId", typeId),
                Query.equal("votedById", votedById)
           ]
        )
        if (response.documents.length > 0) {
            await databases.deleteDocument(db, voteCollection, response.documents[0].$id)
            //decerease the reputation
            const QuestionOrAnswer = await databases.getDocument(
                db, type === "question" ? questionCollection : answerCollection,
             typeId   
            )
            const authorPrefs = await users.getPrefs<UserPrefs>(QuestionOrAnswer.authorId)
            
            await users.updatePrefs<UserPrefs>(
                QuestionOrAnswer.authorId, {
                    reputation : response.documents[0].voteStatus ==="upvoted" ? Number (authorPrefs.reputation) - 1 : Number (authorPrefs.reputation) + 1
                }
            )
        }
        //that means prev vote does not exists or vote ststus changed
        if (response.documents[0]?.voteStatus !== voteStatus) {
            const doc = await databases.createDocument(db, voteCollection, ID.unique(), {
              type, typeId, voteStatus, votedById
            })
            
            //increase or decrease reputation
              const QuestionOrAnswer = await databases.getDocument(
                db, type === "question" ? questionCollection : answerCollection,
             typeId   
            ) 

            const authorPrefs = await users.getPrefs<UserPrefs>(QuestionOrAnswer.authorId)

            // if vote was present
            
            
            await users.updatePrefs<UserPrefs>(
                QuestionOrAnswer.authorId, {
                    reputation : response.documents[0].voteStatus ==="upvoted" ? Number (authorPrefs.reputation) - 1 : Number (authorPrefs.reputation) + 1
                }
            )
        }

        const [upvotes, downvotes] = await Promise.all([
            databases.listDocuments(db, voteCollection, [
                Query.equal("type", type),
                Query.equal("typeId", typeId),
                Query.equal("voteStatus", "upvoted"),
                Query.equal("votedById", votedById),
                Query.limit(1),
           
            ]),
                databases.listDocuments(db, voteCollection, [
                Query.equal("type", type),
                Query.equal("typeId", typeId),
                Query.equal("voteStatus", "downvoted"),
                Query.equal("votedById", votedById),
                Query.limit(1),
           
            ]),
        ])
        return NextResponse.json(
            {
                data: {
                    document: null, voteResult: upvotes.total = downvotes.total
                },
                
                message:"vote handeled"
                

            }, {
                
            }
        )


    } catch (error:any) {
        return NextResponse.json(
            {
                error: error?.message || "Error in voting"
            }, {
                status:error?.status || error?.code || 500
            }
        )
    }
}