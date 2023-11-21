// components/BackLink.tsx
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const BackLink = () => {
  const router = useRouter();
  const [prevPage, setPrevPage] = useState<string | null>(null);

  useEffect(() => {
    setPrevPage(router.asPath);
  }, [router.asPath]);

  return (
    <>
      <Box>
        <Link
          href="#"
          onClick={() => router.back()}
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            color: "blue",
          }}
        >
          <ArrowBackIcon style={{ marginRight: "5px" }} />
          戻る
        </Link>
      </Box>
    </>
  );
};

export default BackLink;
