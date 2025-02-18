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
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { msToDHMS } from "@/helperFunctions/Time";
import { useRouter } from "next/navigation";

const ProductCard = ({ product, durationMS, timeFormatted}) => {
  const timeElement = useRef(null);
  const router = useRouter()
  var duration = durationMS;


  function reduceTimems(ms,interval) {
    if (duration > 0) {
      duration -= ms;
      const TimeDHMS = msToDHMS(duration);
      const days = TimeDHMS.days > 0 ? `${TimeDHMS.days}:` : "";
      const hours = TimeDHMS.hours > 0 ? `${TimeDHMS.hours}:` : "";
      const minutes = TimeDHMS.minutes > 0 ? `${TimeDHMS.minutes}:` : "";
      timeElement.current.innerHTML = `${days}${hours}${minutes}${TimeDHMS.seconds}`;
    } else {
      clearInterval(interval)
      timeElement.current.innerHTML = `Loppunut`;

    }
  }

  useEffect(() => {
    const interval = setInterval( () => {reduceTimems(1000, interval)}, 1000);
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
            <Typography height={40} variant="h6" component="div">
              {product.name}
            </Typography>
            <Typography
              height={70}
              variant="body2"
              sx={{ color: "text.secondary" }}
            >
              {product.desc}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button variant="" size="small" color="primary">
            HUUDA
          </Button>
          <Button
            ref={timeElement}
            variant=""
            color="primary"
            className="endTimeButton"
            sx={{ width: 100, justifyContent: "left" }}
          >{timeFormatted}
            </Button>
        </CardActions>
      </Card>
    </Grid2>
  );
};
export default ProductCard;
