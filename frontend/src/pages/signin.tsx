import { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import apiClient from "../lib/apiClient";
import { useRouter } from "next/router";
import { useAuth } from "../context/auth";

export default function SignIn() {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  const router = useRouter();

  const { signin } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      // サインインAPIを実行
      const response = await apiClient.post("/auth/signin", {
        email,
        password,
      });
      const token = response.data.token;

      signin(token);

      router.push("/");
    } catch (error) {
      alert("入力内容が正しくありません");
    }
  };

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
          アカウントにログイン
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="メールアドレス"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="パスワード"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            ログイン
          </Button>
          <Grid container>
            <Grid item xs>
              パスワードを忘れた場合は
              <Link href="#" variant="body2">
                こちら
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
