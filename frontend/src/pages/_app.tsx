import type { AppProps } from "next/app";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ja } from "date-fns/locale";
import Navbar from "../../components/Navbar";
import { AuthProvider } from "../context/auth";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <div>
        <Navbar />
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
          <Component {...pageProps} />
        </LocalizationProvider>
      </div>
    </AuthProvider>
  );
}
