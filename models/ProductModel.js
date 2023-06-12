import mongoose from "mongoose";
import {FilterData} from "./FilterDataModel.js";


const schema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter product name"],
  },
  description: {
    type: String,
    required: [true, "Please enter product description"],
  },

  logo: {
    type: String,
    required: [true, "Please enter product logo"],
  },
  category: {
    type: String,
    required: [true, "Please enter product category"],
  },
  link: {
    type: String,
    required: [true, "Please enter product link"],
  },

  comments: {
    type: Array,
    default: [],
  },

  commentCnt : {
    type: Number,
    default: 0,
  },

  likes: {
    type: Number,
    default: 0,
  },

  author : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

schema.pre("save", async function (next) {
  let arr = this.category.split(" ");
  for(let i=0; i<arr.length; i++){
    let temp = await FilterData.findOne({filterName: arr[i]});
    if(temp)continue;
    await FilterData.create({filterName: arr[i]});
  }
});



export const Product = mongoose.model("Product", schema);
