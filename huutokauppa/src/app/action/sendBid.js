'use client'
export default async function sendBid(bid, name, productId, sessionToken) {
    // send request to api
    const response = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + "/api/bid", {
        method: "PUT",
        headers:  {
            Authorization: "Bearer " + sessionToken,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            bid: bid,
            productId: productId,
            sessionToken: sessionToken
        })
    })
    return response
}