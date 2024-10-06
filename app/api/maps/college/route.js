import College from '@lib/models/College.js'
import { connectToDB } from "@lib/mongodb/mongoose";

export const POST = async(req,{params})=>{
    try {
        await connectToDB();
        const college = await College.find(
            { name: params?.name||"" }
        )
        let res;
        if(!college){
            res=await College.create(
                {
                    name:params.name,
                }
            )
            if(!res){
                return new Response("Failed to create college", { status: 500 });
            }
        }
        
        return new Response(JSON.stringify(res), { status: 200 });
    } catch (error) {
        console.error(err);
        return new Response("Failed to get user", { status: 500 });
    }
}