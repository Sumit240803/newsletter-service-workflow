import { Router } from "express";
import newsRoutes from "./news.routes";

const routes= Router();
routes.use("/news", newsRoutes);
export default routes;