import { NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL!,
    private_key: process.env.GCP_PRIVATE_KEY!.replace(/\\n/g, "\n"),
  },
});

const bucketName = process.env.GCP_BUCKET_NAME!;

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("image") as File;

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const bucket = storage.bucket(bucketName);
  const blob = bucket.file(`${Date.now()}_${file.name}`);
  const blobStream = blob.createWriteStream({
    resumable: false,
    contentType: file.type,
    predefinedAcl: "publicRead", // makes it publicly accessible
  });

  const arrayBuffer = await file.arrayBuffer();
  blobStream.end(Buffer.from(arrayBuffer));

  return new Promise((resolve, reject) => {
    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
      resolve(NextResponse.json({ imageUrl: publicUrl }));
    });
    blobStream.on("error", (err) => reject(err));
  });
}
