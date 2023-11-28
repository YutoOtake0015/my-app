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

  // アカウント情報
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string | null>("");

  // エラー表示
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await apiClient
        .post("/users/update", {
          id: user.id,
          email,
          password,
        })
        .then((res) => {
          alert(res.data.message);
          router.push("/");
        })
        .catch((err) => {
          handleErrorResponse(err);
        });
    } catch (err) {
      alert("予期せぬエラーが発生しました。\nもう一度やり直してください。");
    }
  };

  const handleErrorResponse = (err) => {
    switch (err.response.status) {
      case 500:
        alert("サーバで問題が発生しました。\nもう一度やり直してください。");
        router.push("/mypage");
        break;
      case 400:
        err.response.data.message
          ? alert(err.response.data.message)
          : setValidationErrors(err.response.data.messages);
        break;
      case 401:
        alert(err.response.data.message);
        setValidationErrors([]);
        break;
      default:
        alert("予期せぬエラーが発生しました。\nもう一度やり直してください。");
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Enterキー押下時、送信処理を抑制する
    if (e.key === "Enter") {
      e.preventDefault();
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
        {validationErrors.length > 0 && (
          <Box style={{ color: "red" }}>
            <ul>
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </Box>
        )}
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
                InputLabelProps={{
                  shrink: !!email,
                }}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) =>
                  handleKeyDown(e)
                }
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
                onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) =>
                  handleKeyDown(e)
                }
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
