import { Backdrop, CircularProgress } from "@mui/material";
import { useLoader } from "../context/LoaderContext";

function GlobalLoader() {
  const { loading } = useLoader();

  return (
    <Backdrop
      open={loading}
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 999,
        backgroundColor: "rgba(0,0,0,0.5)"
      }}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

export default GlobalLoader;