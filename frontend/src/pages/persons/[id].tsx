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
import BackLink from "../../../components/BackLink";
import PageHead from "../../../components/PageHead";
import { useRecoilValue } from "recoil";
import userAtom from "../../../recoil/atom/userAtoms";

type sexType = "male" | "female";

// サーバーサイドでのCookieの取得
export const getServerSideProps = async ({ req, params }) => {
  const { id } = params;

  // req.headers.cookie からCookieを取得
  // getServerSideProps内ではLocalStorageにアクセスできないため、Cookieを使用
  const token = req.headers.cookie
    ? req.headers.cookie.replace(
        /(?:(?:^|.*;\s*)auth_token\s*=\s*([^;]*).*$)|^.*$/,
        "$1",
      )
    : null;

  try {
    // APIリクエストを非同期で実行
    const response = await apiClient.get(`/persons/find/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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
  const user = useRecoilValue(userAtom);

  // ユーザ情報
  const [personName, setPersonName] = useState<string>("");
  const [sex, setSex] = useState<sexType | "">("");
  const [birthDate, setBirthDate] = useState<Date>(null);

  // エラー表示
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // アカウント新規登録APIを実行
      await apiClient
        .post(`/persons/edit/${person.id}`, {
          personName,
          birthDate,
          sex,
        })
        .then((res) => {
          alert(res.data.message);
          router.push("/persons");
        })
        .catch((err) => {
          handleErrorResponse(err);
        });
    } catch (err) {
      alert("入力内容が正しくありません");
    }
  };

  const handleDeletePerson = async () => {
    try {
      // 削除確認
      const confirmed = window.confirm("本当に削除しますか？");
      if (confirmed) {
        await apiClient.delete(`/persons/delete/${person.id}`, {
          data: { userId: user.id },
        });

        alert("人物情報を削除しました");
        router.push("/persons");
      } else {
        alert("処理を中断しました");
      }
    } catch (err) {
      alert("予期せぬエラーが発生しました。\nもう一度やり直してください。");
    }
  };

  const handleErrorResponse = (err) => {
    switch (err.response.status) {
      case 500:
        alert("サーバで問題が発生しました。\nもう一度やり直してください。");
        router.push("/persons/create");
        break;
      case 400:
        setValidationErrors(err.response.data.messages);
        break;
      default:
        alert("予期せぬエラーが発生しました。\nもう一度やり直してください。");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Enterキー押下時、送信処理を抑制する
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (person) {
      setPersonName(person.personName);
      setSex(person.sex);
      setBirthDate(new Date(person.birthDate));
    } else {
      // 人物情報が利用できない場合の処理
      alert("情報の編集に失敗しました");
      router.push("/persons");
    }
  }, []);

  return (
    <>
      <PageHead>
        <title>情報編集</title>
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
            情報編集
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
                  value={personName}
                  InputLabelProps={{
                    shrink: !!personName,
                  }}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPersonName(e.target.value)
                  }
                  onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) =>
                    handleKeyDown(e)
                  }
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={8}
                onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) =>
                  handleKeyDown(e)
                }
              >
                <DatePicker
                  label="生年月日"
                  value={birthDate}
                  closeOnSelect={false}
                  onChange={(e: Date) => setBirthDate(e as Date)}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={4}
                onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) =>
                  handleKeyDown(e)
                }
              >
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <BackLink />
          {!person.isAccountUser && (
            <Button onClick={handleDeletePerson}>削除</Button>
          )}
        </Box>
      </Container>
    </>
  );
};

export default PersonPage;
