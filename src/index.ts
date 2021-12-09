// In order for the workers runtime to find the class that implements
// our Durable Object namespace, we must export it from the root module.
export { FlickrGroupAddrUser } from './FlickrGroupAddrUser'

import { Router } from "itty-router"

export default {
    async fetch(request: Request, env: Env) {
        try {
            return await handleRequest(request, env)
        } catch (e) {
            return new Response(`${e}`)
        }
    },
}

async function handleRequest(request: Request, env: Env) {
    /*
    let id = env.COUNTER.idFromName('A')
    let obj = env.COUNTER.get(id)
    let resp = await obj.fetch(request.url)
    let count = parseInt(await resp.text())
    let wasOdd = isOdd(count) ? 'is odd' : 'is even'

    return new Response(`${count} ${wasOdd}`)
    */

    const router = Router()

    router.get( '^/api/auth/app/callback', (req) => {
        const params        = req.params
        const queryString   = req.query

        return new Response( "Got an OAuth callback with code: " + JSON.stringify(queryString) )
    })

    router.all( '*', () => new Response( 'Invalid request', { status: 404 } ) )


    return router.handle( request )
}

interface Env {
  FGA_USER: DurableObjectNamespace
}
