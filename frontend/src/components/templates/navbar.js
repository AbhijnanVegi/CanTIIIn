import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import LoginIcon from '@mui/icons-material/Login';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutIcon from '@mui/icons-material/Logout';

import { getUser, removeToken } from "../../services/auth";

const Navbar = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(async () => {
    var u = await getUser();
    setUser(u);
  }, [navigate])

  const Logout = () => {
    removeToken()
    navigate("/")
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            CANTIIIN
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {!user ? (
            <>
              <Button color="inherit" variant="outlined" onClick={() => navigate("/login")}>
                <LoginIcon />
              </Button>
              <Button sx={{marginX:"10px"}} color="inherit" variant="outlined" onClick={() => navigate("/register")} disableElevation>
                <PersonAddOutlinedIcon />
              </Button></>) : (
            <>
              <Button color="inherit" variant="outlined" onClick={() => navigate("/profile")}>
                <AccountCircleOutlinedIcon />
              </Button>
              <Button  sx={{marginX:"10px"}} color="inherit" variant="outlined" onClick={Logout}>
                  <LogoutIcon/>
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
