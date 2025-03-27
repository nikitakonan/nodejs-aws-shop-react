import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File | null>();
  const [error, setError] = React.useState<string | null>();

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setError(null);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    console.log("uploadFile to", url);

    if (!file) return;
    console.log("File to upload: ", file.name);

    try {
      const headers: AxiosRequestConfig["headers"] = {};
      const token = localStorage.getItem("authorization_token");
      if (token) {
        headers["Authorization"] = token;
      }

      const response = await axios({
        method: "GET",
        url,
        params: { name: encodeURIComponent(file.name) },
        headers,
      });
      console.log("response", response);
      const result = await axios.put(response.data, file);
      console.log("Successfully uploaded!", result.data);
      setFile(null);
    } catch (reason) {
      if (reason instanceof AxiosError) {
        let errorMessage = reason.message;
        if (reason.response) {
          errorMessage =
            reason.response.status + ": " + reason.response.data.message;
        }
        setError(errorMessage);
      } else {
        console.error(reason);
      }
    }
  };
  return (
    <Box>
      <Snackbar
        open={!!error}
        onClose={handleClose}
        message={error}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
