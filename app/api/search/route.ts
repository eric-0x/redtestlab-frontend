import { NextResponse } from "next/server"
import { getAccessToken } from "@/lib/googleAuth"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    let token = await getAccessToken()

    let resp = await fetch(
      "https://discoveryengine.googleapis.com/v1alpha/projects/1068518430509/locations/global/collections/default_collection/engines/redtestlab_1757135006647/servingConfigs/default_search:search",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: body?.query || "",
          pageSize: body?.pageSize ?? 10,
          queryExpansionSpec: body?.queryExpansionSpec ?? { condition: "AUTO" },
          spellCorrectionSpec: body?.spellCorrectionSpec ?? { mode: "AUTO" },
          languageCode: body?.languageCode ?? "en-US",
          safeSearch: body?.safeSearch ?? true,
          userInfo: body?.userInfo ?? { timeZone: "Asia/Calcutta" },
        }),
      },
    )

    const text = await resp.text()
    let json: any
    try {
      json = text ? JSON.parse(text) : {}
    } catch {
      json = { raw: text }
    }

    // On 401 UNAUTHENTICATED, mint a fresh token and retry once
    if (resp.status === 401) {
      token = await getAccessToken()
      resp = await fetch(
        "https://discoveryengine.googleapis.com/v1alpha/projects/1068518430509/locations/global/collections/default_collection/engines/redtestlab_1757135006647/servingConfigs/default_search:search",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: body?.query || "",
            pageSize: body?.pageSize ?? 10,
            queryExpansionSpec: body?.queryExpansionSpec ?? { condition: "AUTO" },
            spellCorrectionSpec: body?.spellCorrectionSpec ?? { mode: "AUTO" },
            languageCode: body?.languageCode ?? "en-US",
            safeSearch: body?.safeSearch ?? true,
            userInfo: body?.userInfo ?? { timeZone: "Asia/Calcutta" },
          }),
        },
      )
    }

    if (!resp.ok) {
      return NextResponse.json(
        {
          error: "Discovery Engine request failed",
          status: resp.status,
          statusText: resp.statusText,
          details: json,
        },
        { status: resp.status },
      )
    }

    return NextResponse.json(json, { status: 200, headers: { "Cache-Control": "no-store" } })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Search failed", stack: e?.stack }, { status: 500 })
  }
}


