import {
  Box,
  FormControl,
  FormControlLabel,
  IconButton,
  Input,
  InputAdornment,
  InputBase,
  Tooltip,
} from "@mui/material";
import { Stack } from "@mui/system";
import React, { useContext, useState } from "react";
import { AttachFile, InsertEmoticon, Mic, Send } from "@mui/icons-material";
import AppContext from "../../AppContext";

export default function ConvoBottomBar({
  sendMessage,
  setTyping,
  setUploading,
}) {
  const { uploadImage } = useContext(AppContext);
  const [message, setMessage] = useState("");

  const handleVoice = (e) => {
    //voice listener
  };

  const handleImage = (file) => {
    setUploading(true);
    uploadImage(file)
      .then((url) => {
        sendMessage(url.split("/")[2], url);
      })
      .catch((err) => {
        setUploading(false);
      });
  };

  const handleSubmit = (e) => {
    setTyping(false);
    e.preventDefault();
    sendMessage(message);
    setMessage("");
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    setTyping(true);
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={0.5}
      sx={{ height: "9%", p: 1, bgcolor: "#D3D3D3", mb: 1 }}
    >
      <IconButton>
        <InsertEmoticon />
      </IconButton>

      <Input
        type="file"
        sx={{ display: "none" }}
        name="imgMsg"
        id="imgMsg"
        onChange={(e) => handleImage(e.target.files[0])}
      />
      <Tooltip title="file share" arrow>
        <IconButton>
          <label htmlFor="imgMsg" id="fileInp"><AttachFile /></label>
          
        </IconButton>
      </Tooltip>
      <Box
        sx={{
          bgcolor: "#c3c3c3",
          borderRadius: 1,
          p: 0.5,
          pl: 2,
          width: "85%",
        }}
      >
        <form id="msgForm" onSubmit={handleSubmit}>
          <FormControl sx={{ width: "100%" }}>
            <InputBase
              placeholder="Type a message..."
              autoFocus
              value={message}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton type="submit">
                    <Send />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </form>
      </Box>

      <IconButton onClick={handleVoice}>
        <Mic />
      </IconButton>
    </Stack>
  );
}
