import { Permission } from "node-appwrite";
import {db, commentCollection } from "../name"

import { databases } from "./config";

export default async function createCommentCollection() {
    // Creating Collection
    await databases.createCollection(db, commentCollection, commentCollection, [
        Permission.read("any"),
        Permission.read("users"),
        Permission.create("users"),
        Permission.update("users"),
        Permission.delete("users"),
    ])
    console.log("comment collection is created");

    // crearting attributes

    await Promise.all(
        [   
            databases.createStringAttribute(db, commentCollection, "content", 10000, true),
            databases.createEnumAttribute(db, commentCollection, "type", ["answer", "question"], true),
            databases.createStringAttribute(db, commentCollection, "typeId", 50, true),
            databases.createStringAttribute(db, commentCollection, "authorId", 50, true),]
    )
    console.log("comment Attribute created");
    
    
}