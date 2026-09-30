import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const sendNews = async(req : Request, res : Response)=>{
    try {
        const today = new Date().toISOString().split("T")[0];
        const startOfToday = new Date(`${today}T00:00:00.000Z`);
        const latest_email = await prisma.emails_sent.findMany({
            where : {
                createdAt : {
                    gte : startOfToday
                }
            },
            orderBy : {
                createdAt : "desc"
            }
        });
        

    } catch (error) {
        
    }
}