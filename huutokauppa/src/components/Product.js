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
  TextField
} from "@mui/material";
// components/Carousel.js
import React from 'react';
import Slider from 'react-slick';
import { useEffect } from "react";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function Product(props) {
  const product = props.product;
  console.log(product);

  const bidHistory = [
    { bidder: "John Doe", bidAmount: "$2,400.00", time: "2025-02-17 14:30" },
    { bidder: "Jane Smith", bidAmount: "$2,350.00", time: "2025-02-17 13:50" },
    { bidder: "Sam Wilson", bidAmount: "$2,300.00", time: "2025-02-17 12:45" },
  ];
  useEffect(() => {});

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
          height: "70vh",
          width: "80vw",
          boxShadow: 5,
          borderRadius: "16px",
          backgroundColor: "background.paper",
          marginBottom: 5,
          transition: "transform 0.2s ease",
          "&:hover": {
            transform: "scale(1.05)",
          },

        }}
      >
          <CardMedia
            component="img"
            image={product.imageUrls[0]}
            
            alt="Product image"
            sx={{ width: "50%", margin: "auto" }}
            
          />

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

          <Typography
            variant="body1"
            sx={{
              fontSize: "1.2rem",
              color: "text.secondary",
            }}
          >
            {product.desc}
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: 1 }}>
            Brand: Timeless Classics
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: 1 }}>
            Condition: Excellent
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: 1 }}>
            Shipping: Free Worldwide Shipping
          </Typography>

          <Box
            sx={{
              
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            >
            <Typography
              variant="h6"
              sx={{
                margin: 2,
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "primary.main",
              }}
              >
              {product.price}€
            </Typography>
            <TextField
                label="Korotus"
                value={""}
                onChange={(e) => {}}
              />
            <Button
              variant="contained"
              sx={{
                margin: 2,
                backgroundColor: "primary.main",
                color: "common.white",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
            >
              Place Bid
            </Button>
          </Box>
      </Card>

      {/* Bid History Table */}
      <Card
        sx={{
          boxShadow: 5,
          borderRadius: "16px",
          backgroundColor: "background.paper",
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
            sx={{ marginBottom: 0, fontWeight: "bold", textAlign: "center" }}
          >
            Bid History
          </Typography>

          <TableContainer>
            <Table sx={{}} aria-label="bid history table">
              <TableHead>
                <TableRow>
                  <TableCell>Bidder</TableCell>
                  <TableCell align="right">Bid Amount</TableCell>
                  <TableCell align="right">Time</TableCell>
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
    </Box>
  );
}
