import React from "react";
import Product from "@/components/Product";
import Menubar from "@/components/MenuBar";
import { json } from "stream/consumers";

export default async function Page({ params }) {
  const productId = (await params).productId;

  const response = fetch(
    process.env.NEXT_PUBLIC_API_ENDPOINT +
      "/api/product?" +
      new URLSearchParams({ productId: productId }),
    {
      Method: "GET",
      "Content-type": "application/json",
    }
  ).then((response) => {
      return response.json();
    })
    .then((response_json) => {
      return response_json
    });
  const product = await response
  console.log("FETCHED PRODUCT: \n", product);

  return (
    <div>
      <Menubar></Menubar>
      <Product {...product} key={productId}></Product>
    </div>
  );
}
