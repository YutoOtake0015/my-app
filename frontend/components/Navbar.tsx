import {
  AppBar,
  Box,
  Container,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import { useAuth } from "../src/context/auth";
import { useRouter } from "next/router";

type navType = {
  text: string;
  url: string;
};

const navLinks: Array<navType> = [
  { text: "サインアップ", url: "/signup" },
  { text: "ログイン", url: "/signin" },
];

const Navbar = () => {
  const { signout, user } = useAuth();

  const router = useRouter();

  const handleSignout = () => {
    signout();
    router.push("/");
  };

  return (
    <>
      <AppBar
        component="header"
        position="static"
        sx={{ backgroundColor: "gray" }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography component="h1">
                <Link
                  style={{ color: "white", textDecoration: "none" }}
                  href="/"
                >
                  トップ
                </Link>
              </Typography>
            </Box>
            <List
              component="nav"
              sx={{ display: "flex", justifyContent: "flex-start" }}
            >
              {!user ? (
                <>
                  {navLinks.map((navLink) => (
                    <ListItem disablePadding key={navLink.url}>
                      <ListItemButton
                        sx={{
                          whiteSpace: "nowrap",
                        }}
                        href={navLink.url}
                      >
                        <ListItemText primary={navLink.text} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </>
              ) : (
                <ListItem disablePadding>
                  <ListItemButton
                    sx={{ whiteSpace: "nowrap" }}
                    onClick={handleSignout}
                  >
                    <ListItemText primary={`サインアウト`} />
                  </ListItemButton>
                  <ListItemButton sx={{ whiteSpace: "nowrap" }}>
                    <ListItemText primary={`ユーザ設定`} />
                  </ListItemButton>
                </ListItem>
              )}
            </List>
          </Box>
        </Container>
      </AppBar>
    </>
  );
};

export default Navbar;
