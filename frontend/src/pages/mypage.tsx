import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "../context/auth";
import apiClient from "../lib/apiClient";
import { useRouter } from "next/router";
import BackLink from "../../components/BackLink";

const MyPage = () => {
  const router = useRouter();

  const { user } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string | null>("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await apiClient
        .post("/users/update", {
          id: user.id,
          email,
          password,
        })
        .then((res) => {
          alert("アカウント情報が変更されました");
          router.push("/");
        })
        .catch((err) => {
          if (err.response.status === 500) {
            // サーバー側での問題が発生
            alert("サーバーエラーが発生しました。");
          } else {
            // その他のエラー
            alert(err.response.data.message || "エラーが発生しました");
          }
        });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      setEmail(user.email);
    }
  }, [user]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          アカウントを編集
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="メールアドレス"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputLabelProps={{
                  shrink: !!email,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="パスワード"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            変更
          </Button>
        </Box>
      </Box>
      <BackLink />
    </Container>
  );
};

export default MyPage;
