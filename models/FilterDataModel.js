import mongoose from "mongoose";


const schema = new mongoose.Schema({
    filterName:{
        type: String,
        unique: true,
        caseSensitive: false,
    }
});



export const FilterData = mongoose.model("FilterData", schema);

