export async function handleAppLoginOAuthCallback( oauth_code: string ) {

    return new Response( "We did some stuff in the OAuth callback with code " + oauth_code )
}
