export async function handleAppLoginOAuthCallback( oauthCode: string, request:Request, env:Env ):Promise<Response> {

    const userCognitoId:string = await getCognitoId( oauthCode )

    const appUserInfo:{ [id:string]: string } = {
        "user_id"       : userCognitoId,
        "session_id"    : crypto.randomUUID(),
    }

    // Get the durable object for this user (which will create it if 
    //      it doesn't yet exist) and set its session ID
    const durableObjectId = env.FGA_USER.idFromName( appUserInfo['user_id'] )
    let userDurableObject = env.FGA_USER.get( durableObjectId )
    const setSessionIdUrl:URL = new URL( request.url )
    setSetSessionIdUrl.pathname = "/session_id?id=" + encodeURIComponent(appUserInfo['session_id'] )
    const setSessionIdResponse:Response = await userDurableObject.fetch( setSessionIdUrl.toString(),
        {
            method: 'PUT',
        }
    )

    return setSessionIdResponse
    
    // Trim out the path, after the hostname, stuff, and just put the part that the durable object will trigger on
    /*
    const getSessionIdUrl:URL = new URL( request.url 
    getSessionIdUrl.pathname = "/session_id"
    const setSessionIdResponse:Response = await userDurableObject.fetch( getSessionIdUrl.toString() )
    return setSessionIdResponse
    */

    /*

    let responseObject:Response;
    if ( setSessionIdResponse.ok === true ) {
        responseObject = new Response( `Successfully set user ${appUserInfo['user_id']} session ID to ${appUserInfo['session_id']}` )
    } else {
        responseObject = new Response( 'Failed setting session ID', { status: 500 } )
    }

    return responseObject
    */
}

async function getCognitoId( oauthCode: string ):Promise<string> {
    // TODO: figure out how to get the stupid OAuth dance to not puke
    return "f803355d-4396-4b79-b7b8-d887402b25cd"
}

interface Env {
    FGA_USER: DurableObjectNamespace
}
