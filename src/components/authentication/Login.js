import {
  Facebook,
  Google,
  Twitter,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Button,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../../AppContext";

export default function Login() {
  const { setUserData, giveNotification } = useContext(AppContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.email === "" || formData.password === "") {
      return giveNotification("error", "all fields are required");
    }
    fetch(process.env.REACT_APP_BASE_URL + "/api/user/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          giveNotification("success", "logged in successfully");
          setUserData(data.user).then(() => {
            localStorage.setItem("app-token", data.token);
            navigate("/home");
          });
        } else {
          giveNotification("error", data.message);
        }
      });
  };

  const [showPass, setShowPass] = useState(false);
  const handleClickShowPassword = () => {
    setShowPass(!showPass);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="space-between"
        sx={{}}
      >
        <Typography variant="h6">Welcome back !</Typography>
        <Typography
          sx={{ width: "80%", mb: 2 }}
          variant="body2"
          textAlign="center"
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis,
          quibusdam.
        </Typography>
        <TextField
          sx={{ width: "80%", mb: 2 }}
          label="email"
          variant="outlined"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <FormControl variant="outlined" sx={{ width: "80%", mb: 2 }}>
          <InputLabel htmlFor="password">password</InputLabel>
          <OutlinedInput
            id="password"
            name="password"
            type={showPass ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPass ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
        <Link href="" variant="body2" sx={{ width: "80%", mb: 2 }}>
          Forgot password?
        </Link>

        <Button variant="contained" type="submit">
          Sign In
        </Button>
        <Divider variant="middle" sx={{ width: "90%", my: 2 }} />
        <Typography gutterBottom variant="body2" textAlign="center">
          or continue using
        </Typography>
        <Stack direction="row" gap={2}>
          <IconButton>
            <Google fontSize="large" />
          </IconButton>
          <IconButton>
            <Facebook fontSize="large" />
          </IconButton>

          <IconButton>
            <Twitter fontSize="large" />
          </IconButton>
        </Stack>
      </Stack>
    </form>
  );
}
