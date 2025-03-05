import  env  from "@/app/env"
import { Client, Avatars, Storage, Databases, Users } from "node-appwrite";

const client = new Client()
    client
    .setEndpoint(env.appwrite.endPoint) // Your API Endpoint
    .setProject(env.appwrite.projectId)
    .setKey(env.appwrite.apikey)

const users = new Users(client);
const avatars = new Avatars(client);
const storage = new Storage(client);

const databases = new Databases(client);

export {client, users, avatars, storage, databases}


  