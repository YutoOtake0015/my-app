import { useState } from "react";
import { useRouter } from "next/router";
import apiClient from "../lib/apiClient";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { MenuItem, Select } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import PageHead from "../../components/PageHead";
import HomeLink from "../../components/HomeLink";

type sexType = "male" | "female";

export default function SignUp() {
  // アカウント情報
  const [username, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // 人物情報
  const [sex, setSex] = useState<sexType | "">("");
  const [birthDate, setBirthDate] = useState<Date>(null);

  // エラー表示
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      // アカウント新規登録APIを実行
      await apiClient
        .post("/auth/signup", {
          username,
          email,
          password,
          birthDate,
          sex,
        })
        .then(() => {
          router.push("/signin");
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
        router.push("/signup");
        break;
      case 400:
        setValidationErrors(err.response.data.messages);
        break;
      case 403:
        alert(err.response.data.message);
        setValidationErrors([]);
        break;
      default:
        alert("予期せぬエラーが発生しました。\nもう一度やり直してください。");
    }
  };

  return (
    <>
      <PageHead>
        <title>アカウント登録</title>
      </PageHead>
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
            アカウントを作成
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
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="名前"
                  autoFocus
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUserName(e.target.value)
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="メールアドレス"
                  name="email"
                  autoComplete="email"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  inputProps={{
                    onKeyPress: (e) => {
                      if (e.key === " ") {
                        e.preventDefault();
                      }
                    },
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  inputProps={{
                    onKeyPress: (e) => {
                      if (e.key === " ") {
                        e.preventDefault();
                      }
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <DatePicker
                  label="生年月日"
                  onChange={(e: Date) => setBirthDate(e as Date)}
                  value={birthDate}
                  maxDate={new Date()}
                  openTo="year"
                  views={["year", "month", "day"]}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Select
                  value={sex}
                  required
                  label="性別"
                  fullWidth
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSex(e.target.value as sexType)
                  }
                >
                  <MenuItem value={"male"}>男</MenuItem>
                  <MenuItem value={"female"}>女</MenuItem>
                </Select>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              作成
            </Button>
          </Box>
        </Box>
        <HomeLink />
      </Container>
    </>
  );
}
