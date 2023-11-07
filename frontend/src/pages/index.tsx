import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  Button,
  Container,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { styled } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import apiClient from "../lib/apiClient";
import { useAuth } from "../context/auth";

type sexType = "male" | "female";

const CenteredModalContainer = styled("div")({
  position: "fixed",
  top: "50%",
  left: "50%",
});

const modalStyle = {
  transform: "translate(-50%, -50%)",
  border: "2px solid #000",
  boxShadow: "0px 3px 5px 2px rgba(0,0,0,0.3)",
  padding: "1rem",
};

type personType = {
  birthDate: Date;
  sex: string;
} | null;

export default function Home() {
  const { user } = useAuth();

  const [person, setPerson] = useState<personType>(null);
  const [selectBirthDate, setSelectBirthDate] = useState<Date>(null);
  const [selectSex, setSelectSex] = useState<sexType | "">("");
  const [lifeSpan, setLifeSpan] = useState<number>();
  const [showModal, setShowModal] = useState(false);

  const handleChangeSex = (e: SelectChangeEvent<string>) => {
    setSelectSex(e.target.value as any);
  };

  const handleChangeBirth = (e: Date) => {
    // 選択された日付をDate型でセット
    setSelectBirthDate(e);
  };

  const handleSetting = async () => {
    try {
      // 生年月日、性別が選択されていることを確認する
      if (!selectBirthDate || !selectSex) {
        return alert("情報を設定してください");
      }

      // 選択した値を状態にセット
      setPerson({
        birthDate: selectBirthDate,
        sex: selectSex,
      });

      // 寿命を取得
      const fetchData = await apiClient.get("/life/lifespan", {
        params: { sex: selectSex, year: selectBirthDate },
      });
      const data = fetchData.data;
      setLifeSpan(data.remainTime / (365 * 24 * 60 * 60));

      // 初期化
      setSelectBirthDate(null);
      setSelectSex("");

      setShowModal(false);
    } catch (err) {
      console.log("err: ", err);
    }
  };

  if (user && !person) {
    setPerson({
      birthDate: new Date(user.birthDate),
      sex: user.sex,
    });

    // 寿命を取得
    const getLife = async () => {
      const fetchData = await apiClient.get("/life/lifespan", {
        params: { year: new Date(user.birthDate), sex: user.sex },
      });
      const data = fetchData.data;
      setLifeSpan(data.remainTime / (365 * 24 * 60 * 60));
    };
    getLife();
  }

  useEffect(() => {
    if (!user) {
      setPerson(null);
    }
  }, [user]);

  return (
    <Container>
      <div>
        {person && (
          <div>
            <p>
              生年月日: {person.birthDate.toLocaleString("ja").split(" ")[0]}
            </p>
            <p>性別: {person.sex === "male" ? "男" : "女"}</p>
            <p>
              あなたに残された時間
              <br />
              <span>{lifeSpan}年</span>
            </p>
          </div>
        )}

        {!user && (
          <Button
            variant="contained"
            onClick={() => setShowModal(true)}
            sx={{ marginTop: "1rem" }}
          >
            情報を設定
          </Button>
        )}
      </div>
      {showModal && (
        <>
          <Modal open={showModal} onClose={() => setShowModal(false)}>
            <CenteredModalContainer>
              <div style={modalStyle}>
                <DatePicker onChange={handleChangeBirth} />
                <Select value={selectSex} onChange={handleChangeSex}>
                  <MenuItem value={"male"}>男</MenuItem>
                  <MenuItem value={"female"}>女</MenuItem>
                </Select>
                <Button variant="contained" onClick={handleSetting}>
                  設定
                </Button>
              </div>
            </CenteredModalContainer>
          </Modal>
        </>
      )}
    </Container>
  );
}
