import College from '@lib/models/College.js'
import { connectToDB } from "@lib/mongodb/mongoose";

export const POST = async(req,{params})=>{
    try {
        await connectToDB();
        const {name}= await req.json()
        let college = await College.findOne(
            { name: name||"" }
        )
        
        if(!college){
            college=await College.create(
                {
                    name:name,
                    radioStations:[]
                }
            )
            if(!college){
                return new Response("Failed to create college", { status: 500 });
            }
        }
        
        return new Response(JSON.stringify(college), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response("Server Error", { status: 500 });
    }
}
export const GET = async(req,{params})=>{
    try {
        await connectToDB();
        const colleges = await College.find();
        return new Response(JSON.stringify(colleges), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response("Server Error", { status: 500 });
    }
}