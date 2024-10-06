import mongoose from "mongoose";
const CollegeSchema = new mongoose.Schema({
    name: {
        type: String,
        unique:true,
        required:true
    },
    lat: {
        type: Number
    },
    lng: {
        type: Number
    },
    radioStations: [
        {
            name:{
                type:String
            },
            lat: {
                type: Number
            },
            lng: {
                type: Number
            },
            name: {
                type: String
            },
        }
    ]
});
const College = mongoose.models.College || mongoose.model("College", CollegeSchema);
export default College