import DownloadIcon from "@mui/icons-material/Download";
import { IconButton, TextField, Tooltip } from "@mui/material";

export const FileDisplay = ({
  originalFile,
  uploadedFile,
}: {
  originalFile: string;
  uploadedFile: File | null;
}) => {
  const fileName = uploadedFile
    ? uploadedFile.name
    : originalFile.split("/").pop() || "";

  return (
    <TextField
      value={fileName}
      fullWidth
      label="File"
      slotProps={{
        input: {
          readOnly: true,
          endAdornment: originalFile && !uploadedFile && (
            <Tooltip title="Download">
              <IconButton
                color="primary"
                onClick={() => window.open(originalFile, "_blank")}
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          ),
        },
      }}
      sx={{ cursor: "pointer" }}
      onClick={() => {
        if (originalFile && !uploadedFile) {
          window.open(originalFile, "_blank");
        }
      }}
      disabled
    />
  );
};
