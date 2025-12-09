import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("deepfake-detection");
        console.log("connected to db ");
        const data = await db.collection("flickr_results").find({
            active: true
        });
        const result = await data.toArray();
        return NextResponse.json(result);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}