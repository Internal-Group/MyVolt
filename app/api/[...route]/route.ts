import { Hono } from 'hono'
import { handle } from 'hono/vercel'

export const runtime = 'nodejs'

const ICECAST = process.env.ICECAST_URL! // http://icecast-server:8000

const app = new Hono().basePath('/api')

app.put('/source/*', async (c) => {
  // /api/source/live → /live
  const mount = c.req.path.replace('/api/source', '') || '/live'

  // forward ice-* metadata headers Mixxx sends
  const iceHeaders: Record<string, string> = {}
  c.req.raw.headers.forEach((value, key) => {
    if (key.startsWith('ice-') || key === 'content-type') {
      iceHeaders[key] = value
    }
  })

  const upstream = await fetch(`${ICECAST}${mount}`, {
    method: 'PUT',
    headers: {
      ...iceHeaders,
      'Authorization': c.req.header('authorization') ?? '',
    },
    body: c.req.raw.body,
    // @ts-ignore — required for streaming request bodies in Node fetch
    duplex: 'half',
  })

  return new Response(null, { status: upstream.status })
})

export const PUT = handle(app)