import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import querystring from "querystring";

export async function GET(request) {
    const query = querystring.parse(request.url.split("?")[1]);
    try {
        // console.log(query)
        const client = await clientPromise;
        const db = client.db("deepfake-detection");

        const data = await db.collection("flickr_results").findOne({
            filename: query.filename
        });

        return NextResponse.json(data);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}