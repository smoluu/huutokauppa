"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import '../app/globals.css';

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const ProfileContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
  },
}));

export default function Profile() {
  const { isLoggedIn, userData } = useAuth(); // Assuming the AuthContext provides userData
  const [profile, setProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/SignIn");
    } else {
      // Fetch the private profile data from the server
      const fetchProfile = async () => {
        try {
          const response = await fetch("/api/user/profile", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userData.token}`, // Assuming you have the token from AuthContext
            },
          });
          const data = await response.json();
          if (response.ok) {
            setProfile(data); // Set the profile data
          } else {
            console.error("Failed to fetch profile:", data);
          }
        } catch (error) {
          console.log("Error fetching profile:", error);
        }
      };

      fetchProfile();
    }
  }, [isLoggedIn, userData, router]);

  if (!profile) {
    return (
      <ProfileContainer
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="h5">Loading Profile...</Typography>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer direction="column" justifyContent="space-between">
      <Card variant="outlined">
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          Profiilisi
        </Typography>
        <Box
          component="form"
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel htmlFor="name">Nimi</FormLabel>
            <TextField
              id="name"
              value={profile.name || ""}
              disabled
              fullWidth
              variant="outlined"
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="email">Sähköposti</FormLabel>
            <TextField
              id="email"
              value={profile.email || ""}
              disabled
              fullWidth
              variant="outlined"
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="role">Rooli</FormLabel>
            <TextField
              id="role"
              value={profile.role || ""}
              disabled
              fullWidth
              variant="outlined"
            />
          </FormControl>
          <Button
            variant="contained"
            onClick={() => {
              // Add logic to edit profile, if needed
            }}
          >
            Muokkaa profiilia
          </Button>
        </Box>
      </Card>
    </ProfileContainer>
  );
}
