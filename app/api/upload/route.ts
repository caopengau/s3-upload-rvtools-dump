import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { S3Client } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'
import { constructTagging } from '@/app/util'

export async function POST(request: Request) {
  const { filename, contentType, tagSets } = await request.json()
  try {
    const client = new S3Client({ region: process.env.AWS_REGION })
    const { url, fields } = await createPresignedPost(client, {
      Bucket: process.env.AWS_BUCKET_NAME!,
      // This is the filename that will be used in the S3 bucket
      // Need to confirm with the user that this is the desired behavior
      // Key: filename,
      // if not using filename, use uuidv4() to generate a unique key to prevent overwriting
      Key: uuidv4(),

      Conditions: [
        ['content-length-range', 0, 10485760], // up to 10 MB
        ['starts-with', '$Content-Type', contentType],
        ['eq', '$Tagging', constructTagging(tagSets)],
      ],
      Fields: {
        acl: 'public-read',
        'Content-Type': contentType,
      },
      Expires: 600, // Seconds before the presigned post expires. 3600 by default.
    })

    return Response.json({ url, fields })
  } catch (error) {
    return Response.json({ error: error })
  }
}
