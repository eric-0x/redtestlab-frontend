import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_TOKEN_URI } from "./googleClient"

// Exchanges a refresh token or service account style client credentials for an access token.
// Here we use OAuth2 installed app client with no refresh token, so fallback to exchanging via JWT not available.
// For Discovery Engine server-side, you should ideally use a service account.
// Given constraints, we support exchanging using OAuth2 Device Code or manual refresh token if provided via env.

export async function fetchAccessToken(): Promise<string> {
  // Hardcoded fallback access token (temporary). Prefer environment variables.
  const HARDCODED_ACCESS_TOKEN =
    "ya29.c.c0ASRK0GbnwiDNXZnPaju04Fe0ymMkWEsA4tut6KMeQexJq5WgVo4oerLVlUILpNDnB0j-0bob95Muzpk0Oa7Ge9X8mOuWJTz_f2Keh8CC3G-H3w5TI7ZEAOvSt0QFf8ro-jSL9xnlVMmtsyVAklYyi3o_jzn7Zs9XU3Vq7SxMB91pKIEFdgL7KV6wqtxBxCh0gqmfOyIvGvx2c-h6UKkm0MImkJv29AmTZzGf_ipEOsActJYGEu-ufzYKZGkbeeJ0JnDShBhhOqSmmeGH2iqdJWt2u0gLkS1MBV-Ftu-0suTH_q5JSgbfektf5eJJFvjLvCNWn21TdE0Q81-mXC3kFyWAxmSBz9QVtRwFlPN9d29BoBYSEKavPe-VhexPHYpkSIBKG397ARSO6bFMbod6frFdy2_W2rZ4sYdOFZBizv1SkVSjyM6kvZmaw_wQ7R-YO5hM3QnY2m6hyg5tqdd4-VOiBIB_d4-jgw9wMW431feanR_azuFuWlbZMIrkq5g3vnhhQxF0zlqdxUMQFnyR3eFkZVzWmIMRbjZrvRuwpv01OBbnnMt1J_7Y_YIy4MaI8s132QgzirvOnsnvU-8Z7kh1JuSh7QkJZ7yRvsFwmRekg0nzy1fkblybWmteBzc2o1I9r7netMz1nVnxyqU8M9yRy9v-Maat0J4am7z8Mxcn-xRSvVrzfZM5jQ1wI9fMw9qesedXbkFUV-6qm241bMeScWUd5iO2W1qg7cIx-7_J5_VI8opaV_OseFUW59nU-nVWi5xrr-mW-j-djZuVqV7Okf4puXfOtQwySrXvbS3imMcYdOwfQScoc6OwF-k2p9eB8mdW4v9khiQM1ryk7FX_RX6wsbSzIaJqUMn-Y9IaMY4oXXXIypoz7uFecWo7cSwcadIYauz3I90vwW6_O2aysliwvt7kqlh5snejvz5yOd_ao-uekW34q8rlRnrvZMByh-u2ka6fUXRd9dxtk688rf5zco71101BwwqWRbt7n4B1xMFbUoh"

  if (HARDCODED_ACCESS_TOKEN) return HARDCODED_ACCESS_TOKEN

  const stored = process.env.NEXT_PUBLIC_GDISCOVERY_ACCESS_TOKEN
  if (stored) return stored

  // Optional: hardcode a long-lived refresh token here to auto-refresh access tokens
  const HARDCODED_REFRESH_TOKEN = "" // paste refresh token here if you have one

  const refreshToken = HARDCODED_REFRESH_TOKEN || process.env.GOOGLE_REFRESH_TOKEN
  if (!refreshToken) {
    throw new Error("Missing GOOGLE_REFRESH_TOKEN or NEXT_PUBLIC_GDISCOVERY_ACCESS_TOKEN")
  }

  const body = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  })

  const res = await fetch(GOOGLE_TOKEN_URI, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  })
  if (!res.ok) throw new Error("Failed to refresh Google access token")
  const data = await res.json()
  return data.access_token as string
}

