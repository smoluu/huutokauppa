"use client";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid2,
  CardActionArea,
  CardActions,
  Box,
  TextField,
InputAdornment
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import { msToDHMS } from "@/helperFunctions/Time";
import { useRouter } from "next/navigation";

const ProductCard = ({ product, durationMS, timeFormatted}) => {
  const timeElement = useRef(null);
  const router = useRouter()
  var duration = durationMS;
  const [expiryMS, setExpiryMS] = useState(
    new Date(product.end).getTime() - Date.now()
  );
  const [expiryDateFormatted, setExpiryDateFormatted] = useState("");

  const updateExpiry = () => {
    setExpiryMS((prevExpiryMS) => {
      const newExpiryMS = prevExpiryMS - 1000;
      const TimeDHMS = msToDHMS(newExpiryMS);
      const days = TimeDHMS.days > 0 ? `${TimeDHMS.days}:` : "";
      const hours = TimeDHMS.hours > 0 ? `${TimeDHMS.hours}:` : "";
      const minutes = TimeDHMS.minutes > 0 ? `${TimeDHMS.minutes}:` : "";
      const timeFormatted = `${days}${hours}${minutes}${TimeDHMS.seconds}`;
      setExpiryDateFormatted(newExpiryMS > 0 ? timeFormatted : "Päättynyt");
      return newExpiryMS;
    });
  };

  useEffect(() => {
    const interval = setInterval( () => {updateExpiry()}, 1000);
    return () => {
      clearInterval(interval)
    }
  }),
  [];
  return (
    <Grid2 item="true" xs={12} sm={6} md={4}>
      <Card onClick={() => {router.push(/product/ + product._id)}} sx={{ width: 250, height: 350, padding: 1 }}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="150"
            image={product.imageUrl}
            alt="Product image"
            
          />

          <CardContent>
            <Typography height={40} noWrap variant="h6" component="div">
              {product.name}
            </Typography>
            <Box>

            <Typography
              height={70}
              variant="body2"
              sx={{ color: "text.secondary", overflowY: "scroll", overflowX: "hidden", scrollbarWidth: "none" }}
              >
              {product.desc}
            </Typography>
              </Box>
          </CardContent>
        </CardActionArea>
        <CardActions sx={{display: "flex", justifyContent: "center"}}>
          
          <Button variant="outlined" size="small" color="primary">
            HUUDA
          </Button>

            <TextField
            sx={{textAlign: "center"}}
              variant="standard"
              ref={timeElement}
              value={expiryDateFormatted ? expiryDateFormatted : timeFormatted}
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <HourglassTopIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />
        </CardActions>
      </Card>
    </Grid2>
  );
};
export default ProductCard;
