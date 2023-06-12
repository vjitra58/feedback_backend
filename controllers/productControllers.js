import { catchAsyncError } from "../middlewares/catchAsyncError.js";

import { Product } from "../models/ProductModel.js";
import {User} from "../models/UserModel.js";
import { sendToken } from "../utils/sendToken.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { FilterData } from "../models/FilterDataModel.js";

export const AddProduct = catchAsyncError(async (req, res, next) => {
  const { title, description, link, logo, category } = req.body;

  if (!title || !description || !link || !logo || !category) {
    return next(new ErrorHandler("Please enter all field", 400));
  }

  const user = await User.findById(req.user._id);
  const product = await Product.create({
    title,
    description,
    link,
    logo,
    category,
    author: req.user._id,
  });

    user.products.push(product._id);
    user.save();

  res.status(200).json({
    success: true,
    message: "Product Added Successfully",
    product,
  });
});

export const getAllProducts = catchAsyncError(async (req, res, next) => {
    
    let query = {};
    if(req.query.filter && req.query.filter != "All"){
        query.category = new RegExp(req.query.filter, "i");
    }
    let sort = { createdAt: -1};
    if(req.query.sort == "upvote"){
        sort = { likes: -1, ...sort };
    }else{
        sort = {commentCnt: -1, ...sort};
    }
   
    const products = await Product.find(query)
      .sort(sort);
      
    res.status(200).json({
        success: true,
        products,
    });
});

export const likeProduct = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    product.likes = product.likes + 1;

    await product.save();

    res.status(200).json({
        success: true,
        message: "Product Liked Successfully",
        product,
    });

})

export const commentOnProduct = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    product.comments.unshift({
        // this is a anonymous comment
        comment: req.body.comment,
    });

    product.commentCnt = product.comments.length;

    await product.save();

    res.status(200).json({
        success: true,
        message: "Product Commented Successfully",
        product,
    });
});


export const EditProduct = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    if (String(product.author) != String(req.user._id)) {
      return next(
        new ErrorHandler("You are not authorized to edit this product", 401)
      );
    }

    if(req.body.title)product.title = req.body.title;
    if (req.body.description) product.description = req.body.description;
    if (req.body.link) product.link = req.body.link;
    if (req.body.logo) product.logo = req.body.logo;
    if (req.body.category) product.category = req.body.category;

    await product.save();

    res.status(200).json({
        success: true,
        message: "Product Edited Successfully",
        product,
    });
})

export const deleteProduct = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    if (String(product.author) != String(req.user._id)) {
      return next(
        new ErrorHandler("You are not authorized to delete this product", 401)
      );
    }

    const user = await User.findById(req.user._id);
    user.products = user.products.filter(
      (product) => String(product) != String(req.params.id)
    );
    await user.save();
    // await product.remove();
    await Product.deleteOne({ _id: req.params.id })

    res.status(200).json({
        success: true,
        message: "Product Deleted Successfully",
    });
})


export const getSingleProduct = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        product,
    });
})

// this is a api for getting all the filter data for the filter section

export const getFilterData = catchAsyncError(async (req, res, next) => {
    const filterdata = await FilterData.find();
    const result = filterdata.map((data) => data.filterName);
    res.status(200).json({
        success: true,
        result,
    });
})

