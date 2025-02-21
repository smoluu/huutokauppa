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
  Grid,
} from "@mui/material";
// components/Carousel.js
import React, { useRef, useState } from "react";
import PriceChart from "./priceChart";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import sendBid from "@/app/action/sendBid";
import useAlert from "@/hooks/useAlert";
import useSound from "use-sound";

export default function Product(props) {
  const product = props.product;
  const [newBid, setNewBid] = useState(product.bid);
  const [currentBid, setCurrentBid] = useState(product.bid);
  const { isLoggedIn, token, user } = useAuth();
  const { setAlert } = useAlert();
  const currentBidButton = useRef();
  const router = useRouter();
  const [newbidSoundPitch, setNewBidSoundPitch] = useState(0, 7);
  const [newBidSound] = useSound("/newBid", {
    playbackRate: newbidSoundPitch,
    volume: 1,
  });

  const handleBid = async () => {
    if (isLoggedIn) {
      const response = await sendBid(newBid, user, product._id, token);
      const result = await response.json();
      console.log(result.message);
      if (response.status == 200) {
        setAlert(`Huudettu ${newBid}€`, "success");
      } else {
        // error status
        setAlert(`Huuto epäonnistui: ${result.message}`, "error");
      }
    } else {
      router.push("/SignIn");
    }
  };

  const bidHistory = [
    { bidder: "John Doe", bidAmount: "2,400.00€", time: "2025-02-17 14:30" },
    { bidder: "Jane Smith", bidAmount: "2,350.00€", time: "2025-02-17 13:50" },
    { bidder: "Sam Wilson", bidAmount: "2,300.00€", time: "2025-02-17 12:45" },
  ];
  useEffect(() => {
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
        const button = currentBidButton.current;
        newBidSound();
        //trigger price change animation on button
        button.style.transition = "transform 0.25s ease-in-out";
        button.style.transform = "scale(1.6)";
        setTimeout(() => {
          button.style.transform = "scale(1)";
        }, 250);
      }
    };
    //
    return () => {
      price_eventSource.close();
    };
  });

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
          <Grid2 size={6}>
            <Button variant="outlined">{product.price}€</Button>
            <Button variant="contained" sx={{ marginX: 2 }}>
              Osta nyt
            </Button>
          </Grid2>
          <Grid2 size={6}>
            <Button ref={currentBidButton} variant="outlined">
              {currentBid}€
            </Button>
            <TextField
              label="Uusi huuto"
              value={newBid}
              type="number"
              onChange={(e) => {
                setNewBid(e.target.value);
              }}
              sx={{ maxWidth: 150, marginX: 2 }}
              size="small"
            />
            <Button variant="contained" onClick={handleBid}>
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
