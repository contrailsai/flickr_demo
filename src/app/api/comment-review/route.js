import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

// POST handler to mark an image for review based on request body
export async function POST(request) {
    try {
        const { image_url, comment } = await request.json();
        const client = await clientPromise;
        const db = client.db("deepfake-detection");
        // Toggle or set the marked status based on provided value
        const update = { $set: { review_comment: comment } };
        const result = await db.collection("flickr_results").updateOne({ image_url }, update);
        return NextResponse.json({ success: true, result });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to update comment" }, { status: 500 });
    }
}