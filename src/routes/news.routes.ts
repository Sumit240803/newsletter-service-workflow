import { Router } from "express";
import { build_draft, get_articles, get_latest_draft, getNews } from "../controllers/newsletter.controller";

const newsRoutes = Router();

newsRoutes.get("/get-news", getNews);
newsRoutes.get("/latest", get_articles);
newsRoutes.post("/build-draft", build_draft);
newsRoutes.get("/draft/latest", get_latest_draft);
export default newsRoutes;