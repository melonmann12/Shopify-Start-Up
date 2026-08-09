import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Initialize Cloudinary only if environment variables exist
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
}

export async function POST(req: Request) {
  try {
    // Check configuration first
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('[Upload API] Cloudinary environment variables missing')
      return NextResponse.json({ error: 'Server is not configured for image uploads' }, { status: 500 })
    }

    const formData = await req.formData()
    const files = formData.getAll('images') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    if (files.length > 5) {
      return NextResponse.json({ error: 'Maximum 5 files allowed' }, { status: 400 })
    }

    const uploadPromises = files.map(async (file) => {
      // Security Validation
      if (file.size > 10 * 1024 * 1024) {
        throw new Error(`File ${file.name} exceeds 10MB limit`)
      }
      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`Invalid file type for ${file.name}. Only JPG, PNG, and WEBP are allowed.`)
      }
      
      const buffer = Buffer.from(await file.arrayBuffer())
      
      return new Promise<string>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'nailestial/reviews' },
          (error, result) => {
            if (result && result.secure_url) {
              resolve(result.secure_url)
            } else {
              console.error('[Cloudinary Upload Error]', error)
              reject(error || new Error('Upload failed'))
            }
          }
        )
        stream.end(buffer)
      })
    })

    const urls = await Promise.all(uploadPromises)

    return NextResponse.json({ success: true, urls })
  } catch (error: any) {
    console.error('[Upload API] Error processing upload:', error)
    
    // Provide a safe generic message for the user, plus dev details if needed
    const devDetails = process.env.NODE_ENV === 'development' ? ` (${error.message || 'Unknown'})` : ''
    
    return NextResponse.json({ 
      error: `Photo upload failed. Please try again.${devDetails}` 
    }, { status: 500 })
  }
}
