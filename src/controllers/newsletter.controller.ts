import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import fs from "fs/promises";
import path from "node:path";
const currentDir = __dirname;

export const getNews = async (req: Request, res: Response) => {
  try {
    const newsDir = path.join(currentDir, "../emails");

    const files = await fs.readdir(newsDir);
    console.log(files);
    console.log("Reading from:", newsDir);
    const htmlFiles = await Promise.all(
      files
        .filter(file => file.endsWith(".html"))
        .map(async file => ({
          file,
          time: (await fs.stat(path.join(newsDir, file))).mtimeMs
        }))
    );
    for (const file of files) {
    const stat = await fs.stat(path.join(newsDir, file));

    console.log(file, {
        modified: stat.mtime,
        created: stat.birthtime
    });
}

    htmlFiles.sort((a, b) => b.time - a.time);

    const latestFile = htmlFiles[0];

    console.log("Latest file:", latestFile);
    res.status(200).json({
        status : true,
        body : latestFile.file
    });

  } catch (error) {
    console.error(error);
  }
};

export const get_articles = async (req: Request, res: Response) => {
    try {
        const response = await fetch(
            `https://newsapi.org/v2/everything?q=tech-updates&pageSize=5&sortBy=publishedAt&apiKey=${process.env.NEWS_API_KEY}`
        );

        if (!response.ok) {
            return res.status(response.status).json({
                message: "Failed to fetch articles"
            });
        }

        const data = await response.json();

        return res.status(200).json({
            articles: data.articles
        });

    } catch (error) {
        console.error("Error fetching articles:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const build_draft = async (req: Request, res: Response) => {
    try {
        const { articles } = req.body;

        if (!articles || !Array.isArray(articles)) {
            return res.status(400).json({
                message: "Articles are required"
            });
        }

        const draft = {
            title: "Daily Tech Brief",
            date: new Date().toISOString(),
            articles: articles.slice(0, 5).map((article) => ({
                title: article.title,
                description: article.description,
                url: article.url,
                imageUrl: article.urlToImage,
                publishedAt: article.publishedAt,
                source: article.source?.name
            }))
        };
        const saved_draft = await prisma.newsletterDraft.create({
            data : {
                title : draft.title,
                articles : draft.articles
            }
        });
        

        return res.status(200).json({
            message: "Newsletter draft created",
            id : saved_draft.id,
            draft : saved_draft
        });

    } catch (error) {
        console.error("Error building newsletter draft:", error);

        return res.status(500).json({
            message: "Failed to build newsletter draft"
        });
    }
};

export const get_latest_draft = async (req: Request, res: Response) => {
    try {
        const draft = await prisma.newsletterDraft.findFirst({
            orderBy: {
                createdAt: "desc"
            }
        });

        if (!draft) {
            return res.status(404).json({
                message: "No newsletter draft found"
            });
        }

        return res.status(200).json({
            draft
        });

    } catch (error) {
        console.error("Error fetching latest draft:", error);

        return res.status(500).json({
            message: "Failed to fetch latest draft"
        });
    }
};