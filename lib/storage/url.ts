// lib/storage/url.ts
// Client-safe — TIDAK pakai 'server-only'
export function getPublicUrl(key: string): string {
  const endpoint = process.env.NEXT_PUBLIC_AWS_ENDPOINT_URL_S3!
  const bucket = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!
  return `${endpoint}/${bucket}/${key}`
}