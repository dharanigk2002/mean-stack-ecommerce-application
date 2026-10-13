import express from "express";
import http from "http";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "node:path";
import dns from "dns/promises";
import cookieParser from "cookie-parser";

import { healthCheck } from "./controllers/health.controller.js";
import { globalErrorHandler } from "./utils/globalErrorHandler.js";
import { cors } from "./middlewares/cors.middleware.js";
import { connectDB } from "./db/config.js";
import categoryRouter from "./routes/category.routes.js";
import productRouter from "./routes/product.routes.js";
import brandRouter from "./routes/brand.routes.js";
import { ApiError } from "./utils/ApiError.js";
import customerRouter from "./routes/customer.routes.js";
import authRouter from "./routes/auth.routes.js";
import { isAuthenticated } from "./middlewares/auth.middleware.js";
import wishlistRouter from "./routes/wishlist.routes.js";
import cartRouter from "./routes/cart.routes.js";
import orderRouter from "./routes/order.routes.js";

dotenv.config({ path: path.join(process.cwd(), "src", ".env") });
dns.setServers(["8.8.8.8"]);

const app = express();
const PORT = process.env.PORT ?? 8080;

app.use(cors);

app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

app.get("/api/health", healthCheck);

app.use("/api/category", isAuthenticated, categoryRouter);
app.use("/api/products", isAuthenticated, productRouter);
app.use("/api/brands", isAuthenticated, brandRouter);

app.use("/api/customer/home", isAuthenticated, customerRouter);
app.use("/api/wishlists", isAuthenticated, wishlistRouter);
app.use("/api/cart", isAuthenticated, cartRouter);
app.use("/api/orders", isAuthenticated, orderRouter);
app.use("/api/auth", authRouter);

app.use((req, _) => {
  throw new ApiError(
    404,
    {},
    `Route not found: ${req.method} ${req.originalUrl}`,
  );
});

app.use(globalErrorHandler);

const server = http.createServer(app);
server.listen(PORT, async () => {
  console.log("Server is listening on port", PORT);
  await connectDB();
});
