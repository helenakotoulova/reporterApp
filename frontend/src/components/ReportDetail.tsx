import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  IconButton,
  styled,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setNotification } from "../redux/notificationSlice";
import {
  deleteReport,
  fetchReportDetail,
  updateReport,
} from "../redux/reportsSlice";
import { FileDisplay } from "./FileDisplay";
import { FileEditor } from "./FileEditor";
import { LoadingSpinner } from "./LoadingSpinner";

const ReportDetail = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { reportDetail, detailStatus } = useAppSelector(
    (state) => state.reports
  );

  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [originalFileUrl, setOriginalFileUrl] = useState("");
  const [formData, setFormData] = useState({
    sender_name: "",
    age: "",
    job: "",
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchReportDetail(id));
    }
  }, [id, dispatch, isEditing]);

  useEffect(() => {
    if (reportDetail) {
      setFormData({
        sender_name: reportDetail.sender_name,
        age: reportDetail.age.toString(),
        job: reportDetail.job,
      });
      setOriginalFileUrl(reportDetail.file_url || "");
    }
  }, [reportDetail]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDeleteFile = () => {
    setFile(null);
    setOriginalFileUrl("");
  };

  const handleUpdate = async () => {
    if (
      !formData.sender_name.trim() ||
      !formData.age.trim() ||
      !formData.job.trim()
    ) {
      dispatch(
        setNotification({
          message: "Name, age, and job are required. Please fill out the form.",
          severity: "error",
        })
      );
      return;
    }
    try {
      const updatedData = new FormData();
      updatedData.append("sender_name", formData.sender_name);
      updatedData.append("age", formData.age);
      updatedData.append("job", formData.job);

      if (file) {
        updatedData.append("file", file);
      } else if (reportDetail?.file_url && originalFileUrl === "") {
        updatedData.append("remove_file", "true");
      }

      await dispatch(updateReport({ id, updatedData }));

      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          if (reader.result) {
            setOriginalFileUrl(reader.result.toString());
          }
        };
        reader.onerror = () => {
          dispatch(
            setNotification({
              message: "Error processing file.",
              severity: "error",
            })
          );
        };
      }
      setIsEditing(false);
      dispatch(
        setNotification({
          message: "Report updated successfully!",
          severity: "success",
        })
      );
    } catch (error) {
      dispatch(
        setNotification({
          message: "Error updating report.",
          severity: "error",
        })
      );
    }
  };

  const handleDeleteReport = async () => {
    try {
      await dispatch(deleteReport(id));
      dispatch(
        setNotification({
          message: "Report deleted successfully!",
          severity: "success",
        })
      );
      navigate("/");
    } catch (error) {
      dispatch(
        setNotification({
          message: "Error deleting report.",
          severity: "error",
        })
      );
    }
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setFormData({
      sender_name: reportDetail?.sender_name || "",
      age: reportDetail?.age.toString() || "",
      job: reportDetail?.job || "",
    });
    setFile(null);
    setOriginalFileUrl(reportDetail?.file_url || "");
  };

  return (
    <StyledMainWrapper>
      {detailStatus === "loading" ? (
        <LoadingSpinner />
      ) : !reportDetail ? (
        <Typography>Report not found.</Typography>
      ) : (
        <Box sx={{ width: "100%" }}>
          <StyledHeaderWrapper>
            <Typography variant="h4" sx={{ flexGrow: 1 }}>
              Report Detail
            </Typography>
            <Tooltip title="Go Back">
              <IconButton color="secondary" onClick={() => navigate("/")}>
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
            {!isEditing ? (
              <>
                <Tooltip title="Edit">
                  <IconButton
                    color="primary"
                    onClick={() => setIsEditing(true)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton color="error" onClick={handleDeleteReport}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip title="Save Changes">
                  <IconButton color="primary" onClick={handleUpdate}>
                    <SaveIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Cancel">
                  <IconButton color="secondary" onClick={handleCancelEditing}>
                    <CancelIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </StyledHeaderWrapper>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Sender Name"
              name="sender_name"
              value={formData.sender_name}
              onChange={handleInputChange}
              fullWidth
              required
              disabled={!isEditing}
            />
            <TextField
              label="Age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              fullWidth
              required
              disabled={!isEditing}
            />
            <TextField
              label="Job"
              name="job"
              value={formData.job}
              onChange={handleInputChange}
              fullWidth
              required
              disabled={!isEditing}
            />
            <Box>
              {!isEditing ? (
                originalFileUrl ? (
                  <FileDisplay
                    originalFile={originalFileUrl}
                    uploadedFile={file}
                  />
                ) : (
                  <Typography>No file attached</Typography>
                )
              ) : (
                <FileEditor
                  setFile={setFile}
                  originalFileUrl={originalFileUrl}
                  handleDeleteFile={handleDeleteFile}
                />
              )}
            </Box>
          </Box>
        </Box>
      )}
    </StyledMainWrapper>
  );
};

export default ReportDetail;

const StyledMainWrapper = styled(Box)({
  maxWidth: "1000px",
  minWidth: "600px",
  margin: "24px auto 0",
  padding: 2,
  display: "flex",
  flexDirection: "column",
  gap: 2,
});

const StyledHeaderWrapper = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 12,
});
