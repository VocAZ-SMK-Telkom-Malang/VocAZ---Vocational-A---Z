import { GoogleCallback } from './google-callback'

type Props = {
  searchParams: Promise<{ next?: string }>
}

export default async function GoogleCallbackPage({ searchParams }: Props) {
  const { next } = await searchParams
  return <GoogleCallback requestedPath={next} />
}
