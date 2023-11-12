import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Container } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import apiClient from "../../lib/apiClient";

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

      // 人物情報を表示する形式に変換
      const formattedPersonsData = personsData.data.formattedPersons.map(
        (person) =>
          person.sex === "male"
            ? { ...person, sex: "男" }
            : { ...person, sex: "女" },
      );

      setPersons(formattedPersonsData);
    };
    setPersonData();
  }, [setPersons]);

  const cols: GridColDef[] = [
    {
      field: "name",
      headerName: "名前",
      minWidth: 250,
      flex: 0.5,
      renderCell: (params: GridRenderCellParams<any>) => (
        <Link
          className="text-blue-200 underline"
          href={`/persons/${params.id}`}
        >
          {params.row.name}
        </Link>
      ),
    },
    { field: "sex", headerName: "性別" },
    { field: "birthDate", headerName: "生年月日", minWidth: 100 },
    { field: "remainingLife", headerName: "余命", minWidth: 150 },
  ];

  return (
    <Container>
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
    </Container>
  );
};

export default Persons;
