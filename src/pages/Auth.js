import { Box, Paper, Tab , Stack, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import React, { useEffect } from "react";
import Login from "../components/authentication/Login";
import Signup from "../components/authentication/Signup";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const navigate = useNavigate()
  const [value, setValue] = React.useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if(localStorage.getItem('app-token')){
      navigate('/home')
    }
  }, [])
  
  return (
    <Stack direction="row" justifyContent="center" sx={{ height: "100vh" }}>
      <Paper
        elevation={3}
        sx={{
          my: "auto",
          width: { sm: "80vw", md: "60vw" },
          height: { sm: "50%", md: "80%" },
          bgcolor: "#d3d3d3",
          borderRadius: 2,
          display: "flex",
        }}
      >
        <Box
          sx={{
            width: "50%",
            height: "100%",
            borderRight: "1px solid #bebebe",
            background : 'url(https://i.pinimg.com/736x/8f/87/1d/8f871db726cc745e7f19064655688335.jpg) no-repeat ',
          }}
        >
          <Stack sx={{p : 3 , color : 'white'}} direction="column">
            <Typography variant="h6" sx={{mb:1}}>
              Try these test credentials :
            </Typography>
            <Typography variant="body1" sx={{mb:1}}>
              email : oggy@g.com <br/>
              password : pp0pp
            </Typography>
            <Typography variant="body1" sx={{mb:1}}>
              email : olly@g.com <br/>
              password : pp0pp
            </Typography>
            <Typography variant="body1" sx={{mb:1}}>
              email : bob@g.com <br/>
              password : pp0pp
            </Typography>
            <Typography variant="body1" sx={{mb:1}}>
              email : joey@g.com <br/>
              password : pp0pp
            </Typography>
            <Typography variant="body1" sx={{mb:1}}>
              email : deedee@g.com <br/>
              password : pp0pp
            </Typography>
          </Stack>
        </Box>
        <Box sx={{ width: "50%", height: "100%" }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
                sx={{}}
              >
                <Tab
                  label="Sign In"
                  value="1"
                  sx={{
                    width: "50%",
                    typography: "subtitle1",
                    fontWeight: "bold",
                  }}
                />
                <Tab
                  label="Sign Up"
                  value="2"
                  sx={{
                    width: "50%",
                    typography: "subtitle1",
                    fontWeight: "bold",
                  }}
                />
              </TabList>
            </Box>
            <TabPanel value="1">
              <Login />
            </TabPanel>
            <TabPanel value="2">
              <Signup />
            </TabPanel>
          </TabContext>
        </Box>
      </Paper>
    </Stack>
  );
}
