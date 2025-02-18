"use client";
import { useState } from "react";
import {
  TextField,
  Typography,
  Button,
  Stack,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ImageList,
  ImageListItem,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import Alert from "@mui/material/Alert";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { useDropzone } from "react-dropzone";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/de";
import { useAuth } from "@/context/AuthContext";
import useAlert from "@/hooks/useAlert";
import { useRouter } from "next/navigation";
import { FormatAlignCenter } from "@mui/icons-material";
import { format } from "date-fns";

export default function AddItemPage() {
  const { token, user } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [endDate, setendDate] = useState(new Date());
  const [selectedImages, setSelectedImages] = useState([]);
  const { setAlert } = useAlert();
  const router = useRouter();

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    multiple: true,
    maxFiles: 10,
    onDrop: (acceptedFiles) => {
      setSelectedImages([...selectedImages, ...acceptedFiles]);
    },
  });

  const handleImageChange = (files) => {
    setSelectedImages([...selectedImages, ...files]);
  };

  const removeImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    //validate inputs

    //create formdata
    const formData = new FormData();
    formData.append("userId", user);
    formData.append("name", name);
    formData.append("desc", description);
    formData.append("end", endDate);

    selectedImages.forEach((image, index) => {
      formData.append(`images`, image, "img_" + index);
    });

    const product = {
      product: {
        name: name,
        desc: description,
        end: endDate,
      },
    };

    try {
      const response = await fetch("http://localhost:5000/api/product/create", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: formData,
      });
      console.log(formData);

      if (!response.ok) {
        throw new Error("Failed to add item");
      }
      setAlert("Tuote lisätty myyntiin", "success");
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
      <Box sx={{ maxWidth: "1200px" }}>
        <Dialog open={true}>
          <DialogTitle>Myy uusi tuote</DialogTitle>
          <DialogContent>
            <Stack spacing={3}>
              <TextField
                label="Nimi"
                fullWidth
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <TextField
                label="Lisätiedot"
                multiline
                rows={4}
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <TextField
                label="Osta heti hinta"
                fullWidth
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ display: "inline-flex", width: "30%" }}
              />
              <TextField
                label="Alin hinta"
                fullWidth
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ display: "inline-block", width: "30%" }}
              />

              <DateTimePicker
                label="Päättymis päivämäärä"
                onChange={(newValue) => {
                  setendDate(new Date(newValue));
                  console.log(newValue);
                }}
              />

              <Box sx={{ width: "100%" }}>
                <Box
                  {...getRootProps()}
                  sx={{
                    border: "2px dashed gray",
                    padding: "40px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  <input {...getInputProps()} />
                  <Typography variant="h6" align="center">
                    Vedä kuvat tähän, tai paina avataksesi valikon
                  </Typography>
                </Box>

                {selectedImages.length > 0 && (
                  <ImageList sx={{ width: "100%", height: 256 }}>
                    {selectedImages.map((image, index) => (
                      <ImageListItem key={index}>
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`_uploaded${index}`}
                        />
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => removeImage(index)}
                          sx={{ position: "absolute", right: 0, left: "" }}
                        >
                          X
                        </Button>
                      </ImageListItem>
                    ))}
                  </ImageList>
                )}
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={() => window.history.back()}>
              Takaisin
            </Button>
            <Button variant="contained" type="submit" onClick={handleSubmit}>
              Valmis
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}
