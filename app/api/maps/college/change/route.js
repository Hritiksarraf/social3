import College from '@lib/models/College.js'
import { connectToDB } from "@lib/mongodb/mongoose";

export const POST = async(req,{params})=>{
    try {
        await connectToDB();
        const {lat, lng, name,collegeName } = await req.json();
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        const college = await College.findOne(
            { name: collegeName }
        )
        if (!college) {
            return new Response("College not found", { status: 404 });
        }
        const newRadioStation = {
            lat: latitude + (Math.random() - 0.5) * 0.002,
            lng: longitude + (Math.random() - 0.5) * 0.002,
            name: name
        };
        await College.updateOne(
            { name: collegeName },
            { 
                $set: { 
                    lat, 
                    lng 
                },
                $push: {
                    radioStations: newRadioStation
                }
            }
        );
        return new Response("RadioStation Created successfully", { status: 200 });
        
    } catch (error) {
        console.error("Error in API:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
