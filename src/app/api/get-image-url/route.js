import { NextResponse } from "next/server";

export async function POST(request) {
    const { image_url } = await request.json();

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