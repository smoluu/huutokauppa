import MenuBar from "@/components/MenuBar";
import { Grid2, Box } from "@mui/material";

import Page from "./page.client";
import ProductCard from "@/components/ProductCard";
import { msToDHMS } from "@/helperFunctions/Time";

export default async function Home() {
  // Get cookies from the headers
  //const cookieStore = await cookies();
  //const token = cookieStore.get("auth_token"); // Get token from cookies
  let userdata = {};
  let range = "0-100";
  const url =
    process.env.NEXT_PUBLIC_API_ENDPOINT +
    "/api/product?" +
    new URLSearchParams({ range: range });
  const response = await fetch(url, {
    method: "GET",
  });
  const products = await response.json();
  console.log(products);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-middle",
        background:
          "radial-gradient(at 50% 50%, hsla(210, 100%, 60%, 0.5), hsl(220, 30%, 5%))",
      }}
    >
      <Page></Page>
      <MenuBar userdata={userdata} />
      <Box sx={{ m: 15 }}> </Box>
      <Grid2
        container
        spacing={2}
        padding={0}
        sx={{
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        {products.map(function (product, index) {
          var durationMS = new Date(product.end).getTime() - Date.now();
          var timeFormatted = ""
          if (durationMS > 0) {
            const TimeDHMS = msToDHMS(durationMS);
            const days = TimeDHMS.days > 0 ? `${TimeDHMS.days}:` : "";
            const hours = TimeDHMS.hours > 0 ? `${TimeDHMS.hours}:` : "";
            const minutes = TimeDHMS.minutes > 0 ? `${TimeDHMS.minutes}:` : "";
            timeFormatted = `${days}${hours}${minutes}${TimeDHMS.seconds}`
          }else {
            timeFormatted = "Loppunut"
          }
          // calculate remaining time
          return (
            <ProductCard
              key={index}
              product={product}
              durationMS={durationMS}
              timeFormatted={timeFormatted}
            ></ProductCard>
          );
        })}
      </Grid2>
    </div>
  );
}
