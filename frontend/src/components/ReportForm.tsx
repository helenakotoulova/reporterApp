import { Box, Button, styled, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../redux/hooks";
import { setNotification } from "../redux/notificationSlice";
import { createReport } from "../redux/reportsSlice";

const ReportForm = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [job, setJob] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("sender_name", name);
      formData.append("age", age);
      formData.append("job", job);

      if (file) {
        formData.append("file", file);
      }

      await dispatch(createReport(formData));

      dispatch(
        setNotification({
          message: "Report created successfully!",
          severity: "success",
        })
      );

      setName("");
      setAge("");
      setJob("");
      setFile(null);
      navigate("/");
    } catch (error) {
      dispatch(
        setNotification({
          message: "Error creating report.",
          severity: "error",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledMainWrapper>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Create new report
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Job"
            value={job}
            onChange={(e) => setJob(e.target.value)}
            fullWidth
            required
          />
          <TextField
            type="file"
            onChange={handleFileChange}
            fullWidth
            variant="outlined"
            label="File"
            slotProps={{
              inputLabel: { shrink: true },
            }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 2,
          }}
        >
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/")}
            sx={{ width: "48%" }}
          >
            Go Back
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ width: "48%" }}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </Box>
      </form>
    </StyledMainWrapper>
  );
};

export default ReportForm;

const StyledMainWrapper = styled(Box)({
  maxWidth: "800px",
  minWidth: "600px",
  margin: "24px auto 0",
  padding: 2,
  display: "flex",
  flexDirection: "column",
  gap: 2,
});
