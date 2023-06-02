import { CssBaseline} from "@mui/material";
import { useState } from "react";
import AppContext from "./AppContext";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Notification from "./components/misc/Notification";

function App() {
  const [user, setUser] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [conversations, setConversations] = useState(null);
  const [alert, setAlert] = useState(null);

  const giveNotification = (type , msg) => {
    setAlert({type , msg})
  }

  const setUserData = (user = null) => {
    return new Promise((res, rej) => {
      if (user != null) {
        setUser(user);
        res(user);
      } else {
        fetch( process.env.REACT_APP_BASE_URL + "/api/user/", {
          method: "GET",
          headers: {
            authorization: `Bearer ${localStorage.getItem("app-token")}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setUser(data.user);
              res(user);
            } else {
              rej(data.msg);
            }
          })
          .catch((err) => rej(err));
      }
    });
  };

  const uploadImage = (file) => {
    return new Promise((res, rej) => {
      let data = new FormData();
      data.append("image", file);
      fetch( process.env.REACT_APP_BASE_URL + "/api/img/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          if(data.success){
            res(data.url);
          }else{
            giveNotification('error' , data.message)
            rej(data.message)
          }
        })
        .catch((err) => {
          rej(err);
        });
    });
  };

  const fetchConvos = () => {
    fetch( process.env.REACT_APP_BASE_URL + "/api/convo/", {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem("app-token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setConversations(data.conversations);
        } else {
          setConversations(null);
        }
      });
  };
  return (
    <>
      <CssBaseline />
      <AppContext.Provider
        value={{
          user,
          setUserData,
          uploadImage,
          conversation,
          setConversation,
          conversations,
          fetchConvos,
          alert,
          giveNotification
        }}
      >
        <Routes>
          <Route path="/" exact element={<Auth />} />
          <Route path="/home" exact element={<Home />} />
        </Routes>
        {alert && <Notification setAlert={setAlert}/>}
      </AppContext.Provider>
    </>
  );
}

export default App;
