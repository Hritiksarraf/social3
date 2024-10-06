import College from '@lib/models/College.js'
import { connectToDB } from "@lib/mongodb/mongoose";

export const GET =async(req,{params})=>{
    try {
        await connectToDB();
        const college = College.findById(params?.collegeid)
        if (!college) {
            return new Response("College not found", { status: 404 });
        }
        return new Response(JSON.stringify(college), { status: 200 });
        
    } catch (error) {
        console.error("Error in API:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}

export const POST = async(req,{params})=>{
    try {
        await connectToDB();
        const {lat, lng, name } = req.body;
        const college = College.findById(params?.collegeid)
        if (!college) {
            return new Response("College not found", { status: 404 });
        }
        const newRadioStation = {
            lat: college.lat + (Math.random() - 0.5) * 0.002,
            lng: college.lng + (Math.random() - 0.5) * 0.002,
            name: name
        };
        await College.updateOne(
            { 
                _id: collegeId 
            },
            { 
                $set: 
                    { 
                        radioStations: [...college.radioStations, newRadioStation],
                        lat,
                        lng
                    } 
            }
        );
        return new Response("RadioStation Created successfully", { status: 200 });
        
    } catch (error) {
        console.error("Error in API:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
