import { Box, CircularProgress, Stack } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../AppContext";
import Left from "../components/main/Left";
import Right from "../components/main/Right";


export default function Home() {
  const navigate = useNavigate();
  const {setUserData} = useContext(AppContext);
  const [loading , setLoading] = useState(false)

  const getUser = () => {
    setLoading(true)
    setUserData().then(()=>{
      setLoading(false)
    })
  };

 

  useEffect(() => {
    if (!localStorage.getItem("app-token")) {
      navigate("/");
    } else {
      getUser();
    }
  }, []);

  return (
    <Stack direction="row" sx={{ height: "100vh", p: 2  }}>
     {loading ? <Stack direction="row" justifyContent="center" alignItems="center" sx={{width:"100%"}}><CircularProgress color="inherit" /></Stack> : <> <Box flex={3}>
        <Left/>
      </Box>
      <Box flex={7}>
        <Right />
      </Box> </>}
    </Stack>
  );
}
