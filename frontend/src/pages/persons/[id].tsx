import React, { useEffect, useState } from "react";
import apiClient from "../../lib/apiClient";
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
import { useRouter } from "next/router";

type sexType = "male" | "female";

export const getServerSideProps = async ({ params }) => {
  try {
    const { id } = params;

    // APIリクエストを非同期で実行
    const response = await apiClient.get(`/persons/find/${id}`);

    // レスポンスデータをpropsとして返却
    return {
      props: {
        person: response.data.person,
      },
    };
  } catch (err) {
    console.log("err: ", err);

    // エラーが発生した場合、propsを空のオブジェクトとして返却
    return {
      props: {},
    };
  }
};

const PersonPage = ({ person }) => {
  const router = useRouter();

  // ユーザ情報
  const [personName, setPersonName] = useState<string>();
  const [sex, setSex] = useState<sexType | "">("");
  const [birthDate, setBirthDate] = useState<Date>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // アカウント新規登録APIを実行
      await apiClient.post(`/persons/edit/${person.id}`, {
        personName,
        birthDate,
        sex,
      });

      alert("人物情報を変更しました");
      router.push("/persons");
    } catch (error) {
      alert("入力内容が正しくありません");
    }
  };

  useEffect(() => {
    if (person) {
      setPersonName(person.personName);
      setSex(person.sex);
      setBirthDate(new Date(person.birthDate));
    } else {
      // 人物情報を取得できなかった場合、余命一覧に移動
      alert("情報の編集に失敗しました");
      router.push("/persons");
    }
  }, []);

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
          情報編集
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
                value={personName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPersonName(e.target.value)
                }
                InputLabelProps={{
                  shrink: !!personName,
                }}
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
            編集
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default PersonPage;
