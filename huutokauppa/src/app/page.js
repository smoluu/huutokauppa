import MenuBar from "@/components/MenuBar";
import { Grid2, Box } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import Page from "./page.client";

export default async function Home() {
  // Get cookies from the headers
  //const cookieStore = await cookies();
  //const token = cookieStore.get("auth_token"); // Get token from cookies
  let userdata = {};
  let range = "0-100";
  const url =
    process.env.EXTERNAL_API_URL +
    "/api/product?" +
    new URLSearchParams({ range: range });
  const response = await fetch(url, {
    method: "GET",
  });
  const products = await response.json();

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
          // calculate remaining time
          var durationMS = new Date(product.end).getTime() - Date.now();
          return (
            <Grid2 key={index} item="true" xs={12} sm={6} md={4}>
              <Card sx={{ width: 250, height: 300, justifyItems: ""}}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    image="https://placehold.co/150x150"
                    alt="Product image"
                  />
                  <CardContent  >
                    <Typography gutterBottom variant="h5" component="div" >
                      {product.name}
                    </Typography >
                    <Typography 
                      variant="body2"
                      
                      sx={{ color: "text.secondary", flexGrow: 1}}
                    >
                       {product.desc}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions >
                  <Button variant="" size="small" color="primary" >
                    Huuda
                  </Button>
                  <Button
                    variant=""
                    color="primary"
                    className="endTimeButton"
                    sx={{ display: "none", width: 100, justifyContent: "left" }}
                  >
                    {durationMS}
                  </Button>
                </CardActions>
              </Card>
            </Grid2>
          );
        })}
      </Grid2>
    </div>
  );
}
