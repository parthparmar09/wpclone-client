import { QuestionAnswerOutlined } from "@mui/icons-material";
import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import AppContext from "../../AppContext";
import ConvoBottomBar from "../convo/ConvoBottomBar";
import ConvoTopBar from "../convo/ConvoTopBar";
import Message from "../convo/Message";
import { io } from "socket.io-client";

const endpoint = process.env.REACT_APP_BASE_URL
var tempConvo, socket;

export default function Right() {
  const { conversation, user, fetchConvos, giveNotification, setConversation } =
    useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [typing, setTyping] = useState(false);
  const [typer, setTyper] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMsgs();
    tempConvo = conversation?._id;
  }, [conversation]);

  useEffect(() => {
    socket = io(endpoint);
    socket.emit("joinChat", user?._id);
    socket.on("chatJoined", (msg) => {});
  }, []);

  const fetchMsgs = () => {
    if (!conversation) return;
    setLoadingMsgs(true);
    fetch(`${process.env.REACT_APP_BASE_URL}/api/msg/${conversation._id}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem("app-token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessages(data.msgs);
          socket.emit("joinRoom", conversation._id);
          socket.on("roomJoined", (msg) => {
            // console.log("joined : " + msg);
          });
        }
        setLoadingMsgs(false);
      });
  };

  const sendMessage = (msg, url) => {
    if (msg === "") return;
    fetch(`${process.env.REACT_APP_BASE_URL}/api/msg/${conversation._id}`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${localStorage.getItem("app-token")}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        msg: msg,
        url: url,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUploading(false)
        setMessages((prev) => prev && [...prev, data.message]);
        socket.emit("sendMessage", data.message);
        fetchConvos();
        if (!data.success) {
          console.log(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      const convo_id = msg.convo_id._id;
      if (convo_id === tempConvo) {
        setMessages((prev) => prev && [...prev, msg]);
        fetchConvos();
      } else {
        fetchConvos();
        const sender = msg.sender.name;
        giveNotification("info", `New message from @${sender}`);
      }
    });
  }, []);

  useEffect(() => {
    const obj = {
      id: conversation?._id,
      typer: user,
    };
    typing === true
      ? socket.emit("imTyping", obj)
      : socket.emit("imNotTyping", obj.id);
  }, [typing]);

  useEffect(() => {
    socket.on("isTyping", (obj) => {
      const typer = obj.typer;
      if (typer._id === user._id) return;
      if (obj.id !== tempConvo) return;
      setTyper(typer);
    });

    socket.on("isNotTyping", (typer) => {
      setTyper(null);
    });

    socket.on("chatCleared", (obj) => {
      if (obj.id === tempConvo) {
        setMessages([]);
      }
      fetchConvos();
    });

    socket.on("chatDeleted", (obj) => {
      if (obj.id === tempConvo) {
        setConversation(null);
      }
      fetchConvos();
      giveNotification("info", `${obj.name} deleted the chat`);
    });

    socket.on("memberAdded", (obj) => {
      if (obj._id === tempConvo) {
        setConversation(obj);
        giveNotification("info", "new member added");
      }
    });
    socket.on("memberRemoved", (obj) => {
      const id = obj.convo._id;
      if (id === tempConvo) {
        if (obj.remove === user._id) {
          setConversation(null);
          giveNotification("error", "you were removed from the group");
          fetchConvos();
        } else {
          setConversation(obj.convo);
          giveNotification("info", "a user has been removed");
        }
      }
    });
  }, []);

  useEffect(() => {
    let box = conversation ? document.getElementById("msgBox") : null;
    if (box) {
      box.scrollTop = box.scrollHeight;
    }
  }, [messages, typer]);

  return (
    <Stack
      direction="column"
      justifyContent="space-between"
      sx={{ height: "100%" }}
    >
      {conversation ? (
        <>
          <ConvoTopBar socket={socket} fetchMsgs={fetchMsgs} />
          <Stack
            direction="column"
            sx={{ height: "82%", overflowY: "scroll", px: 4 }}
            id="msgBox"
          >
            {!loadingMsgs ? (
              <>
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <Message
                      message={message}
                      self={message.sender._id === user._id ? true : false}
                      sender={message.sender}
                      key={message._id}
                    />
                  ))
                ) : (
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#c3c3c3",
                    }}
                  >
                    <Typography variant="h6">say hello</Typography>
                    <IconButton
                      onClick={(e) => sendMessage("Hello👋")}
                      size="large"
                      id="quickMsg"
                    >
                      👋
                    </IconButton>
                    <Typography variant="h6">to your friend</Typography>
                  </Box>
                )}
              </>
            ) : (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress />
              </Box>
            )}
            {typer && (
              <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
                <Avatar
                  alt={`${typer?.name}`}
                  src={`${process.env.REACT_APP_BASE_URL}/${typer?.pfp}`}
                  sx={{ height: "32px", width: "32px", m: 1 }}
                />
                <Box
                  className="chat-bubble"
                  sx={{
                    bgcolor: "#d3d3d3",
                    width: "4rem",
                    display: "flex",
                    borderRadius: 1,
                    height: "100%",
                    justifyContent: "center",
                  }}
                >
                  <Box className="typing">
                    <Box className="dot"></Box>
                    <Box className="dot"></Box>
                    <Box className="dot"></Box>
                  </Box>
                </Box>
              </Stack>
            )}
          </Stack>
          {uploading && (
                  <Stack direction="row"  sx={{ bgColor: "#03c40a" ,p : 1, mb : 1, alignSelf : 'flex-end'}}>
                    <Typography sx={{pr : 1}} variant="body1">File Uploading</Typography>
                    <CircularProgress size="1.5rem"/>
                  </Stack>
                )}
          <ConvoBottomBar
            sendMessage={sendMessage}
            setTyping={setTyping}
            setUploading={setUploading}
          />
        </>
      ) : (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            opacity: "0.6",
          }}
        >
          <QuestionAnswerOutlined
            sx={{ height: "300px", width: "300px", color: "lightgreen" }}
          />
          <Typography variant="h6">
            Select a conversation and start messaging 😉
          </Typography>
        </Box>
      )}
    </Stack>
  );
}
