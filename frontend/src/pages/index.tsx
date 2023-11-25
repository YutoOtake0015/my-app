import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import { useAuth } from "../context/auth";
import RemainingLife from "../../components/RemainingLife";
import { format, differenceInYears } from "date-fns";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";

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
  backgroundColor: "rgba(255, 255, 255, 0.9)", // 半透明の背景色
  borderRadius: "10px",
};

type personType = {
  birthDate: Date;
  sex: sexType;
} | null;

export default function Home() {
  const { user } = useAuth();

  const [person, setPerson] = useState<personType>(null);
  const [selectBirthDate, setSelectBirthDate] = useState<Date | null>(null);
  const [selectSex, setSelectSex] = useState<sexType | "">("");
  const [showModal, setShowModal] = useState(false);

  const handleChangeSex = (e: SelectChangeEvent<sexType>) => {
    setSelectSex(e.target.value as sexType);
  };

  const handleChangeBirth = (e: Date | null) => {
    setSelectBirthDate(e);
  };

  const calculateAge = (birthDate: Date) => {
    const currentDate = new Date();
    return differenceInYears(currentDate, birthDate);
  };

  const handleSetting = async () => {
    try {
      if (!selectBirthDate || !selectSex) {
        return alert("情報を設定してください");
      }

      setPerson({
        birthDate: selectBirthDate,
        sex: selectSex,
      });

      setSelectBirthDate(null);
      setSelectSex("");
      setShowModal(false);
    } catch (err) {
      console.error("err: ", err);
    }
  };

  useEffect(() => {
    if (!user) {
      setPerson(null);
    } else {
      setPerson({
        birthDate: new Date(user.birthDate),
        sex: user.sex as sexType,
      });
    }
  }, [user]);

  return (
    <Container
      style={{ display: "flex", alignItems: "center", flexDirection: "column" }}
    >
      {user ? (
        <Button href="/persons" variant="contained" sx={{ marginTop: "1rem" }}>
          みんなの余命
        </Button>
      ) : (
        <Button
          variant="contained"
          onClick={() => setShowModal(true)}
          sx={{ marginTop: "1rem" }}
        >
          情報を設定
        </Button>
      )}
      <div style={{ marginTop: "20px" }}>
        {person && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              backgroundColor: "#f0f0f0",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            <div style={{ marginBottom: "20px", textAlign: "center" }}>
              <Typography variant="subtitle1">
                <span style={{ fontSize: "2rem" }}>
                  {format(person.birthDate, "yyyy年MM月dd日")}
                </span>
                生まれ
              </Typography>
              <Typography variant="h5">
                <span style={{ fontSize: "2rem" }}>
                  {calculateAge(person.birthDate)}歳
                </span>
                の{person.sex === "male" ? "男性" : "女性"}
              </Typography>
            </div>
          </div>
        )}
        {person && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                display: "flex",
                fontSize: "2rem",
                fontWeight: "bold",
                alignItems: "center",
              }}
            >
              <HistoryToggleOffIcon
                sx={{ marginRight: "0.5rem", fontSize: "2.5rem" }}
              />
              あなたに残された時間
            </Typography>
            <Typography sx={{ fontSize: "1.5rem" }}>
              <RemainingLife person={person} />
            </Typography>
          </Box>
        )}
      </div>
      {showModal && (
        <>
          <Modal open={showModal} onClose={() => setShowModal(false)}>
            <CenteredModalContainer>
              <div style={modalStyle}>
                <div style={{ marginBottom: "10px" }}>
                  <Typography variant="h6" sx={{ marginBottom: "5px" }}>
                    生年月日
                  </Typography>
                  <DatePicker
                    value={selectBirthDate}
                    onChange={handleChangeBirth}
                  />
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <Typography variant="h6" sx={{ marginBottom: "5px" }}>
                    性別
                  </Typography>
                  <Select value={selectSex} onChange={handleChangeSex}>
                    <MenuItem value={"male"}>男</MenuItem>
                    <MenuItem value={"female"}>女</MenuItem>
                  </Select>
                </div>
                <Button
                  variant="contained"
                  onClick={handleSetting}
                  sx={{ marginTop: "10px" }}
                >
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
