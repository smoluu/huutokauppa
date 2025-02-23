"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { useTheme, styled } from "@mui/material/styles";
import ThemeProvider from "@/theme/ThemeProvider";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import nextConfig from "next.config.mjs";
import { set } from "date-fns";
import { name } from "dayjs/locale/de";

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

const SignInContainer = styled(Stack)(({ theme }) => ({
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

export default function SignIn(props) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn, login, setUser } = useAuth();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (emailError || passwordError) {
      return;
    }
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_ENDPOINT + "/api/auth/login",
        {
          method: "POST",
          mode: "cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json(); // Parse JSON response
      if (!response.ok) {
        alert("ERROR: " + result.message);
      } else {
        // login succesfull set auth state, cookies and go to home page
        console.log(JSON.stringify(result));
        const auth_token = result.token;
        console.log(auth_token);
        login(auth_token, result.name);
        setIsLoggedIn(true);
        setUser(result.name);
        console.log("name:", result.name);

        return;
      }
    } catch (error) {
      console.log("ERROR DURING LOGIN", error);
    }
  };

  const validateInputs = () => {
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Syötä oikea sähköposti.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Salasanan täytyy olla ainakin 6 kirjainta.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  React.useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn]);

  return (
    <SignInContainer direction="column" justifyContent="space-between">
      <Card variant="outlined">
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          Kirjautuminen
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel htmlFor="email">Sähköposti</FormLabel>
            <TextField
              error={emailError}
              helperText={emailErrorMessage}
              id="email"
              type="email"
              name="email"
              placeholder="nimi.sukunimi@email.com"
              autoComplete="email"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={emailError ? "error" : "primary"}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Salasana</FormLabel>
            <TextField
              error={passwordError}
              helperText={passwordErrorMessage}
              name="password"
              placeholder="•••••••••••"
              type="password"
              id="password"
              autoComplete="current-password"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={passwordError ? "error" : "primary"}
            />
          </FormControl>
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Muista minut"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={validateInputs}
          >
            Kirjaudu
          </Button>
          <Link
            component="button"
            type="button"
            onClick={handleClickOpen}
            variant="body2"
            sx={{ alignSelf: "center" }}
          >
            Unohditko salasanan?
          </Link>
        </Box>
        <Divider></Divider>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography sx={{ textAlign: "center" }}>
            Eikö sinulla ole tiliä?{" "}
            <Link href="/SignUp" variant="body2" sx={{ alignSelf: "center" }}>
              Rekisteröidy
            </Link>
          </Typography>
        </Box>
      </Card>
    </SignInContainer>
  );
}
