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
  const { signout } = useAuth();
  const { user } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string | null>("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await apiClient
        .post("/users/update", {
          id: user.id,
          email,
          password,
        })
        .then(() => {
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

  const handleDeleteUser = async () => {
    try {
      // 削除確認
      const confirmed = window.confirm("本当に削除しますか？");
      if (confirmed) {
        await apiClient
          .delete("/users/delete/", {
            data: {
              id: user.id,
            },
          })
          .then(() => {
            alert("ユーザアカウトを削除しました");
            signout();
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
      } else {
        alert("処理を中断しました");
      }
    } catch (err) {
      alert("入力内容が正しくありません");
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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <BackLink />
        <Button onClick={handleDeleteUser}>ユーザアカウント削除</Button>
      </Box>
    </Container>
  );
};

export default MyPage;
