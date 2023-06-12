import express from "express";
import {
  AddProduct,
  getAllProducts,
  likeProduct,
  commentOnProduct,
  EditProduct,
  deleteProduct,
  getFilterData,
  getSingleProduct,
} from "../controllers/productControllers.js";
const router = express.Router();
import { isAuthenticated } from "../middlewares/auth.js";

router.route("/add").post(isAuthenticated, AddProduct);

router.route("/getall").get(getAllProducts);

router.route("/like/:id").put(likeProduct);

router.route("/comment/:id").put(commentOnProduct);

router.route("/edit/:id").put(isAuthenticated, EditProduct);

router.route("/delete/:id").delete(isAuthenticated, deleteProduct);

router.route("/filterdata").get(getFilterData);

router.route("/:id").get(getSingleProduct);

export default router;
