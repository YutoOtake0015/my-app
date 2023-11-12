import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import React, { useState } from "react";
import apiClient from "../../lib/apiClient";
import { useRouter } from "next/router";
import { useAuth } from "../../context/auth";

type sexType = "male" | "female";

const CreatePersonData = () => {
  const router = useRouter();
  const { user } = useAuth();

  // ユーザ情報
  const [personName, setPersonName] = useState<string>();
  const [sex, setSex] = useState<sexType | "">("");
  const [birthDate, setBirthDate] = useState<Date>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // アカウント新規登録APIを実行
      await apiClient.post("/persons/create", {
        personName,
        birthDate,
        sex,
        userId: user.id,
      });
      router.push("/persons");
    } catch (error) {
      alert("入力内容が正しくありません");
    }
  };

  return (
    <div>
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
            余命を登録しましょう
          </Typography>
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPersonName(e.target.value)
                  }
                />
              </Grid>

              <Grid item xs={12} sm={8}>
                <DatePicker
                  label="生年月日"
                  onChange={(e: Date) => setBirthDate(e as Date)}
                  value={birthDate}
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
              登録
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default CreatePersonData;
