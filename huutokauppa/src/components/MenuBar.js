"use client";
import React, { useEffect } from "react";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Link from "next/link"; // Import Link from next/link
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.6)`
    : alpha(theme.palette.background.default, 0.6),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: "12px 16px",
}));

export default function Menubar({  }) {
  const [open, setOpen] = React.useState(false);
  const { isLoggedIn, token, setLoggedIn, user } = useAuth();
  const router = useRouter();

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  let signInText = user ? user : "Kirjaudu";
  let sellLink = "/SignIn";
  let signInLink = "/SignIn";
  if (isLoggedIn) {
    sellLink = "/Sell";
    signInLink = "/Profile";
  }


  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: "calc(var(--template-frame-height, 0px) + 28px)",
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          {/* Desktop Menu Items */}
          <Box
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 2 }}
          >
            <Button
              variant="Title"
              color="info"
              sx={{ "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.08)" } }}
              onClick={() => { router.push("/")}}
            >
              Huutokauppa
            </Button>
          </Box>

          {/* Desktop Sign In/Sign Up Buttons */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
            }}
          >
            <Link href={sellLink} passHref>
              <Button
                variant="outlined"
                color="success"
                size="small"
                sx={{
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.08)" },
                }}
              >
                Myy tuote
              </Button>
            </Link>

            <Link href={signInLink} passHref>
              <Button
                color="primary"
                variant="outlined"
                size="small"
                sx={{ "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.08)" } }}
              >
                {signInText}
              </Button>
            </Link>
          </Box>

          {/* Mobile Drawer Icon */}
          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: "var(--template-frame-height, 0px)",
                  backgroundColor: "background.default", // Added background color for mobile menu
                  padding: 2,
                },
              }}
            >
              {/* Mobile Drawer Content */}
              <Box>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                <MenuItem
                  sx={{ "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.08)" } }}
                >
                  Blog
                </MenuItem>
                <Divider sx={{ my: 3 }} />

                <MenuItem>
                  <Button
                    color="primary"
                    variant="outlined"
                    fullWidth
                    sx={{
                      "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.08)" },
                    }}
                  >
                    Kirjaudu
                  </Button>
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
