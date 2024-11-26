import {
  AppBar,
  Link,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import GlobalNotification from "./components/GlobalNotification";
import ReportDetail from "./components/ReportDetail";
import ReportForm from "./components/ReportForm";
import ReportList from "./components/ReportList";
import { theme } from "./theme";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              <Link
                href="/"
                underline="none"
                color="inherit"
                style={{ cursor: "pointer" }}
              >
                ReporterApp
              </Link>
            </Typography>
          </Toolbar>
        </AppBar>

        <GlobalNotification />
        <Routes>
          <Route path="/" element={<ReportList />} />
          <Route path="/create" element={<ReportForm />} />
          <Route path="/reports/:id" element={<ReportDetail />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
