"use client";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CardMedia,
  Box,
  TextField,
  Grid2,
  InputAdornment,
} from "@mui/material";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
// components/Carousel.js
import React, { useRef, useState } from "react";
import PriceChart from "./priceChart";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import sendBid from "@/app/action/sendBid";
import useAlert from "@/hooks/useAlert";
import { msToDHMS } from "@/helperFunctions/Time";

export default function Product(props) {
  const product = props.product;
  const [newBid, setNewBid] = useState(product.bid);
  const [currentBid, setCurrentBid] = useState(product.bid);
  const { isLoggedIn, token, user } = useAuth();
  const { setAlert } = useAlert();
  const currentPriceRef = useRef();
  const newBidFieldRef = useRef();
  const [bidButtonDisabled, setbidButtonDisabled] = useState(false);
  const [expiryMS, setExpiryMS] = useState(
    new Date(props.product.end).getTime() - Date.now()
  );
  const [expiryDateFormatted, setExpiryDateFormatted] = useState("");
  const router = useRouter();
  const audioRef = useRef(null)


  const playSound = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/sounds/newBid.mp3").play();
    }
    audioRef.current.play();
  };

  const handleBid = async () => {
    setbidButtonDisabled(true);
    if (isLoggedIn) {
      const response = await sendBid(
        newBidFieldRef.current.value,
        user,
        product._id,
        token
      );
      const result = await response.json();
      console.log(result.message);
      if (response.status == 200) {
        setAlert(`Huudettu ${newBid}€`, "success");
      } else {
        // error status
        setAlert(`Huuto epäonnistui: ${result.message}`, "error");
      }
      setTimeout(() => {
        setbidButtonDisabled(false);
      }, 500);
    } else {
      router.push("/SignIn");
    }
  };
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

  const bidHistory = [
    { bidder: "John Doe", bidAmount: "2,400.00€", time: "2025-02-17 14:30" },
    { bidder: "Jane Smith", bidAmount: "2,350.00€", time: "2025-02-17 13:50" },
    { bidder: "Sam Wilson", bidAmount: "2,300.00€", time: "2025-02-17 12:45" },
  ];
  useEffect(() => {
    updateExpiry();
    audioRef.current = new Audio("/sounds/newBid.mp3")
    // sse listener for price
    const price_eventSource = new EventSource(
      process.env.NEXT_PUBLIC_API_ENDPOINT +
        "/api/product/price?productId=" +
        product._id
    );
    price_eventSource.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.price) {
        setCurrentBid(data.price);
        const button = currentPriceRef.current;
        audioRef.current.play()
        //trigger price change animation on button
        button.style.transition = "transform 0.25s ease-in-out";
        button.style.transform = "scale(1.6)";
        setTimeout(() => {
          button.style.transform = "scale(1)";
        }, 250);
      }
    };
    var expiryInterval = setInterval(() => {
      updateExpiry();
    }, 1000);
    return () => {
      price_eventSource.close();
      clearInterval(expiryInterval);
    };
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: "0 16px",
        paddingTop: "150px",
      }}
    >
      <Card
        sx={{
          width: "70vw",
          boxShadow: 5,
          borderRadius: "16px",
          backgroundColor: "background.paper",
          marginBottom: 5,
          transition: "transform 0.2s ease",
          "&:hover": {
            transform: "scale(1.05)",
          },
          maxWidth: 1200,
        }}
      >
        <CardMedia
          component="img"
          image={product.imageUrls[0]}
          alt="Product image"
          sx={{ width: "50%", margin: "auto" }}
        />
        <Grid2 container>
          <Grid2 size={12} padding={5}>
            <Typography
              variant="h4"
              sx={{
                fontSize: "2rem",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {product.name}
            </Typography>
            <Grid2 size={12}>
              <TextField
                fullWidth
                multiline
                rows={10}
                disabled
                id="outlined-disabled"
                label="Lisätiedot"
                defaultValue={product.desc}
              />
            </Grid2>
          </Grid2>
        </Grid2>

        <Grid2
          container
          sx={{
            justifyContent: "center",
            alignItems: "center",
          }}
          padding={5}
        >
          <Grid2 size={3} sx={{ display: "flex", justifyContent: "center" }}>
            <Button variant="outlined" size="small">
              {product.price}€
            </Button>
            <Button variant="contained" size="small" sx={{ marginX: 2 }}>
              Osta
            </Button>
          </Grid2>
          <Grid2 size={9} sx={{ display: "flex", justifyContent: "center" }}>
            <TextField
              label="Päättyminen"
              disabled
              value={expiryDateFormatted}
              sx={{ maxWidth: 150, marginX: 2 }}
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
            <Button ref={currentPriceRef} variant="outlined">
              {currentBid}€
            </Button>
            <TextField
              ref={newBidFieldRef}
              label="Uusi huuto"
              type="number"
              onChange={(e) => {
                newBidFieldRef.current.value = e.target.value;
              }}
              sx={{ maxWidth: 150, marginX: 2 }}
              size="small"
            />
            <Button
              loading={bidButtonDisabled}
              variant="contained"
              onClick={handleBid}
            >
              Huuda
            </Button>
          </Grid2>
        </Grid2>
        {/* CONTAINER END */}
      </Card>

      {/* Bid History Table */}
      <Box
        sx={{
          maxWidth: 1200,
          marginBottom: 2,
          display: "inline-flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          sx={{
            height: 350,
            marginRight: 2,
            maxWidth: 600,
            boxShadow: 5,
            borderRadius: "16px",
            marginBottom: 0,
            transition: "transform 0.2s ease",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Huuto historia
            </Typography>

            <TableContainer>
              <Table sx={{}} aria-label="bid history table">
                <TableHead>
                  <TableRow>
                    <TableCell>Nimi</TableCell>
                    <TableCell align="right">Hinta</TableCell>
                    <TableCell align="right">Aika</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bidHistory.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {row.bidder}
                      </TableCell>
                      <TableCell align="right">{row.bidAmount}</TableCell>
                      <TableCell align="right">{row.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
        <PriceChart></PriceChart>
      </Box>
    </Box>
  );
}
