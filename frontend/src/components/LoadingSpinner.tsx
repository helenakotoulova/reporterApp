import styled from "@emotion/styled";
import { Box, CircularProgress } from "@mui/material";

export const LoadingSpinner = () => {
  return (
    <StyledLoadingWrapper>
      <CircularProgress />
    </StyledLoadingWrapper>
  );
};

const StyledLoadingWrapper = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "300px",
});
