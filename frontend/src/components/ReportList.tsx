import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../redux/hooks";
import { deleteReport, fetchReports } from "../redux/reportsSlice";
import { RootState } from "../redux/store";
import { LoadingSpinner } from "./LoadingSpinner";

const ReportList = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const { reports, status } = useSelector((state: RootState) => state.reports);

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  const handleDelete = () => {
    if (selectedReportId) {
      dispatch(deleteReport(selectedReportId));
      setOpenDialog(false);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedReportId(null);
  };

  const handleDeleteClick = (reportId: string) => {
    setSelectedReportId(reportId);
    setOpenDialog(true);
  };

  return (
    <StyledBox>
      <StyledHeaderBox>
        <Typography variant="h4">Reports List</Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/create"
        >
          Create new report
        </Button>
      </StyledHeaderBox>

      {status === "loading" ? (
        <LoadingSpinner />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>Sender Name</StyledTableCell>
                <StyledTableCell>Age</StyledTableCell>
                <StyledTableCell>Job</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <StyledTableCell>{report.id}</StyledTableCell>
                  <StyledTableCell>{report.sender_name}</StyledTableCell>
                  <StyledTableCell>{report.age}</StyledTableCell>
                  <StyledTableCell>{report.job}</StyledTableCell>
                  <StyledTableCell>
                    <Tooltip title="View Details">
                      <IconButton
                        color="primary"
                        component={Link}
                        to={`/reports/${report.id}`}
                        sx={{ marginRight: "8px" }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Report">
                      <IconButton
                        color="error"
                        sx={{ marginRight: "8px" }}
                        onClick={() => handleDeleteClick(report.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this report?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
    </StyledBox>
  );
};

export default ReportList;

const StyledBox = styled(Box)(({ theme }) => ({
  maxWidth: "1200px",
  minWidth: "1000px",
  margin: "24px auto 0",
  padding: "16px",
  [theme.breakpoints.up("sm")]: {
    padding: "32px",
  },
}));

const StyledHeaderBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: 6,
  marginBottom: "16px",
  [theme.breakpoints.up("sm")]: {
    gap: 18,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: "1.2rem",
  fontWeight: "normal",
  [theme.breakpoints.up("sm")]: {
    fontSize: "1.4rem",
  },
}));
