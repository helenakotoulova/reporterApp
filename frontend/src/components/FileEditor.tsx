import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import { IconButton, TextField, Tooltip } from "@mui/material";

export const FileEditor = ({
  originalFileUrl,
  setFile,
  handleDeleteFile,
}: {
  originalFileUrl: string;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  handleDeleteFile: () => void;
}) => (
  <>
    {originalFileUrl ? (
      <TextField
        label="File"
        value={originalFileUrl.split("/").pop() || ""}
        fullWidth
        slotProps={{
          input: {
            readOnly: true,
            endAdornment: (
              <>
                <Tooltip title="Download">
                  <IconButton
                    color="primary"
                    onClick={() => window.open(originalFileUrl, "_blank")}
                  >
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete File">
                  <IconButton color="error" onClick={handleDeleteFile}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </>
            ),
          },
        }}
      />
    ) : (
      <TextField
        type="file"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0] || null;
          setFile(file);
        }}
        fullWidth
        variant="outlined"
        label="File"
        slotProps={{
          inputLabel: { shrink: true },
        }}
      />
    )}
  </>
);
