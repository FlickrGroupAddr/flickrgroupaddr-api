import { Router } from "itty-router" 

export class FlickrGroupAddrUser {
    session_id: string = ""
    state: DurableObjectState

    constructor(state: DurableObjectState, env: Env) {
        this.state = state;
        // `blockConcurrencyWhile()` ensures no requests are delivered until
        // initialization completes.
        this.state.blockConcurrencyWhile(async () => {
            let storedSessionId:string|undefined = await this.state.storage?.get<string>("session_id");
            this.session_id = storedSessionId || "";
        })
    }

    async setSessionId( newSessionId:string ) {
        // Update in-memory state
        this.session_id = newSessionId;

        // Persist the change to disk
        await this.state.storage?.put( "session_id", this.session_id )

        return new Response( "", { status: 204 } )
    }


    // Handle HTTP requests from clients.
    async fetch(request: Request) {
        const router = Router()

        // Setting session ID
        //router.put( '^/session_id', (req) => {
        router.get( '^/session_id/?$', (req) => {
            const pathParams = req.params
            const queryStringParams = req.query

            if ( queryStringParams ) {
                // Update in-memory state
                this.session_id = queryStringParams['id'];

                // Persist the change to disk
                await this.state.storage?.put( "session_id", this.session_id )

                return new Response( "", { status: 204 } )
            } else {
                return new Response( "Failed at setting ID", { status: 500 } ) 
            }
        })

        // get session ID
        router.get( '^/session_id/?$', (req) => {
            const responseObj:{ [id:string]:string } = { "session_id": this.session_id };

            return new Response( JSON.stringify(responseObj),
                {
                    "status": 200,
                    "headers": new Headers(
                        {
                            "Content-Type": "application/json",
                        }
                    )
                }
            )
        })

        // Fallback is to say "I don't know what you wanted, you misused the API"
        //router.all( '*', () => new Response( 'Got URL: ' + request.url, { status: 404 } ) )
        router.all( '*', () => new Response( 'Got URL: ' + request.url ) )

        const eventResponse = router.handle( request )

        return router.handle( request )
    }
}

interface Env {}
