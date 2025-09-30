// Server-side only: loads Google OAuth client credentials from the bundled JSON
// Do not import this in client components
// eslint-disable-next-line @typescript-eslint/no-var-requires
const client = require("./client_secret_1068518430509-lnl00h91ngceqnkr6a39o4fkqmegd060.apps.googleusercontent.com.json")

type InstalledClient = {
  installed: {
    client_id: string
    project_id: string
    auth_uri: string
    token_uri: string
    auth_provider_x509_cert_url: string
    client_secret: string
    redirect_uris: string[]
  }
}

const cfg = client as InstalledClient

export const GOOGLE_CLIENT_ID = cfg.installed.client_id
export const GOOGLE_CLIENT_SECRET = cfg.installed.client_secret
export const GOOGLE_TOKEN_URI = cfg.installed.token_uri

