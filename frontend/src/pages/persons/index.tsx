import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Button, Container } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import apiClient from "../../lib/apiClient";
import RemainingLife from "../../../components/RemainingLife";
import { format } from "date-fns";
import BackLink from "../../../components/BackLink";

type personData = {
  id: number;
  name: string;
  sex: string;
  birthDate: string;
  remainingLife: number;
};

const Persons = () => {
  const [persons, setPersons] = useState<personData[]>();

  useEffect(() => {
    const setPersonData = async () => {
      // ユーザに紐づく登録人物の情報を取得
      const personsData = await apiClient.get("/persons/findAll");

      setPersons(personsData.data.formattedPersons);
    };
    setPersonData();
  }, [setPersons]);

  // birthDate を "yyyy年MM月dd日" の形式にフォーマット
  const formatBirthDate = (params: GridRenderCellParams<any>) => {
    const formattedDate = format(
      new Date(params.row.birthDate),
      "yyyy年MM月dd日"
    );
    return formattedDate;
  };

  // 表のカラム設定
  const cols: GridColDef[] = [
    {
      field: "name",
      headerName: "名前",
      minWidth: 150,
    },
    {
      field: "sex",
      headerName: "性別",
      renderCell: (params: GridRenderCellParams<any>) => {
        // 表示するsexをmale/femaleから男/女に変換
        const formattedSex = params.row.sex === "male" ? "男" : "女";
        return formattedSex;
      },
    },
    {
      field: "birthDate",
      headerName: "生年月日",
      minWidth: 150,
      renderCell: formatBirthDate,
    },
    {
      field: "remainingLife",
      headerName: "余命",
      minWidth: 250,
      flex: 0.3,
      renderCell: (params: GridRenderCellParams<any>) => (
        // RemainingLifeコンポーネントにpersonを渡す
        <RemainingLife person={{ ...params.row }} />
      ),
    },
    {
      field: "show",
      headerName: "詳細",
      headerAlign: "center",
      align: "center",
      sortable: false,
      minWidth: 100,
      flex: 0.3,
      renderCell: (params: GridRenderCellParams<any>) => (
        <>
          <Link className="text-blue-400" href={`/persons/${params.id}`}>
            詳細
          </Link>
        </>
      ),
    },
  ];

  return (
    <Container>
      <Button
        href="/persons/create"
        variant="contained"
        sx={{ marginTop: "1rem" }}
      >
        新規登録
      </Button>
      {persons ? (
        <div>
          <DataGrid
            columns={cols}
            rows={persons}
            density="compact"
            autoHeight
          />
        </div>
      ) : (
        <h1>読み込み中...</h1>
      )}
      <BackLink />
    </Container>
  );
};

export default Persons;
