import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
    const { image_url } = await request.json();
    console.log(image_url);

    // Try to get the active file from db
    try {
        const client = await clientPromise;
        const db = client.db("deepfake-detection");
        console.log("connected to db ");
        const data = await db.collection("flickr_results").findOneAndUpdate({
            active: false,
            url: image_url
        }, {
            $set: {
                active: true
            }
        });
        console.log("data", data);
        if (data) {
            return NextResponse.json(data);
        }
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }

    // FIND IMAGE ONLINE TEMPORARILY
    if (!image_url) {
        return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }
    try {
        const response = await fetch(image_url);
        const text = await response.text();

        // finding all html image sources that end with .jpg
        const match = text.match(/https:\/\/live\.staticflickr\.com\/\d+\/\w+\.jpg/g);

        const count = match ? match.length : 0;
        console.log(count);
        if (count > 0) {
            return NextResponse.json({ url: match[0] });
        } else {
            return NextResponse.json({ url: "" });
        }
    } catch (error) {
        console.error(error); // Use console.error for errors
        return NextResponse.json({ error: "Error Occured in fetching image" }, { status: 500 });
    }
}