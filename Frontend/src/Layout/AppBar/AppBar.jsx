import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import Logo from "../../Assets/Logo.png";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import LogoutIcon from '@mui/icons-material/Logout';

//Notifiche
import { useNotifiche } from "../Notifiche/NotificheProvider";
import NotificheMenu from "../Notifiche/NotificheMenu";

//Aggiornamento profilo 
import ModaleModificaProfilo from "./AggiornaUtente";

//Logout
import { logoutUser } from "../../Auth/Slice/authSlice";

//Barra di Ricerca 
import SearchBar from "./SearchBar/SearchBar";
import { useSearchBar } from "../../Hooks/useSearchBar";


export default function PrimarySearchAppBar({
  onOpenDrawer,
  setUtenteSelezionato,
  setActiveContent,
  setUtenteSelezionatoOggetto
}) 
{
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const [anchorElNotifiche, setAnchorElNotifiche] = React.useState(null);
  const {searchValue,results,isSearching,noResults,searchRef,handleSearchChange,resetSearch} = useSearchBar();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const { notifiche } = useNotifiche();
  const [openEditUser, setOpenEditUser] = React.useState(false);
    
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMoreAnchorEl(null); 
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };


  const handleEditProfile = () => {
    handleMenuClose();
    setOpenEditUser(true);
  };

  const handleLogout = async () => {
    handleMenuClose();
    try {
      await fetch("https://apuliaeventsbackend.onrender.com/api/user/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Errore durante il logout:", error);
    }
    dispatch(logoutUser());
    navigate("/");
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      PaperProps={{
        sx: {
          backgroundColor: "#001126",
          color: "#fff",
          borderRadius: 2,
          mt: 1,
          "& .MuiMenuItem-root": {
            fontSize: "0.95rem",
            "&:hover": { backgroundColor: "#03162aff" },
          },
        },
      }}
    >
      <MenuItem onClick={handleEditProfile} sx={{ gap: 1.5, py: 1.2 }}>       
          <ModeEditOutlineOutlinedIcon fontSize="small" />
          <Typography>Modifica profilo</Typography>
      </MenuItem>
      <MenuItem onClick={handleLogout} sx={{ gap: 1.5, py: 1.2 }}>
        <LogoutIcon fontSize="small" />
        <Typography>Logout</Typography>
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";

const renderMobileMenu = (
  <Menu
    anchorEl={mobileMoreAnchorEl}
    anchorOrigin={{ vertical: "top", horizontal: "right" }}
    id={mobileMenuId}
    keepMounted
    transformOrigin={{ vertical: "top", horizontal: "right" }}
    open={isMobileMenuOpen}
    onClose={() => setMobileMoreAnchorEl(null)}
    PaperProps={{
      sx: {
        backgroundColor: "#001126",
        color: "#fff",
        borderRadius: 3,
        mt: 1,
        minWidth: 180,
        p: 0.5,
      },
    }}
  >

    <MenuItem sx={{ gap: 1, py: 1.2 }}>
      <AccountCircle fontSize="medium" />
      <Typography sx={{ fontWeight: 600 }}>
        {user?.username || "Utente"}
      </Typography>
    </MenuItem>

    {/* Mod Profilo */}
    <MenuItem
      onClick={handleEditProfile}
      sx={{ gap: 1, py: 1.2 }}
    >
      <ModeEditOutlineOutlinedIcon fontSize="small" />
      <Typography>Modifica profilo</Typography>
    </MenuItem>
    {/* Logout */}
    <MenuItem
      onClick={handleLogout}
      sx={{ gap: 1, py: 1.2 }}
    >
      <LogoutIcon fontSize="small" />
      <Typography>Logout</Typography>
    </MenuItem>

  </Menu>
);

return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed"
        sx={{
              backgroundColor: "#001126",
    zIndex: (theme) => theme.zIndex.drawer + 1,
           }}>
        <Toolbar sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    minHeight: 68,
                    px: 2
                }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2, display: { sm: 'none' }}}
            onClick={onOpenDrawer}
          >
            <MenuIcon />
          </IconButton>
        {/*Box Logo+Nome*/}
          <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                gap: 2,
                ml:-2
                
              }}
            >
              <img
                src={Logo}
                alt="Logo"
                style={{ height: "45px", width: "auto" }} 
              />

              <Typography
                variant="h5"
                noWrap
                sx={{
                  fontWeight: 550,
                  letterSpacing: 1.2,
                  color: "#fff",
                  fontSize: "1.5rem",
                  fontFamily: "'Rische', sans-serif",
                }}
              >
                ApuliaEvents
              </Typography>
          </Box>
          {/*Box SearchBar*/}
          <Box sx={{flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center",}}>
            <Box ref={searchRef} sx={{ position: "relative",width: "100%", maxWidth: 480, mx: 4}}>
              <SearchBar
                value={searchValue}
                onChange={handleSearchChange}
              />
              {(results.length > 0 || noResults || isSearching) && (
                <Paper sx={{position: "absolute",top: "100%",width:{xs:"100%",sm:"300px",md:"300px",lg:"400px"},left:{xs:0,sm:48,md:70,lg:160},backgroundColor: "#001126",color: "#fff",borderRadius: 2,boxShadow: 4,zIndex: 1300,maxHeight: 272,overflowY: "auto",mt: 1.2,fontFamily: "'Rische', sans-serif"}}>
                    {isSearching && (
                          <Box sx={{ p: 1.4, color: "#ffffff99", fontFamily: "'Rische', sans-serif" }}>
                                Sto cercando…
                          </Box>
                      )}
                    {!isSearching && results.filter(u => u._id !== user._id).length === 0 && (
                        <Box sx={{ p: 1.4, color: "#ffffff99",fontFamily: "'Rische', sans-serif"  }}>
                          Nessun utente trovato
                        </Box>
                      )}
                    {!isSearching && results.length > 0 && (
                        <List>
                          {results
                              .filter((u) => u._id !== user._id)
                              .slice(0, 3)
                              .map((u) => (
                                  <ListItem key={u._id} disablePadding sx={{ mb:0, "&:last-child": { mb: 0 } }}>
                                    <ListItemButton onClick={() => {
                                        if (setUtenteSelezionato) setUtenteSelezionato(u._id);
                                        if (setUtenteSelezionatoOggetto) setUtenteSelezionatoOggetto(u);
                                        if (setActiveContent) setActiveContent("chat");
                                        resetSearch();
                                      }}
                                    sx={{ background: "#001126",borderRadius: "12px",px: 2,py: 1,mb: 0,fontFamily: "'Rische', sans-serif",color: "#fff",fontWeight: 580,
                                              "&:hover": {backgroundColor: "#03264bff", },
                                              transition: "background .16s"}}>
                                        <ListItemText 
                                            primary={u.username}
                                            primaryTypographyProps={{fontSize: "1.06rem",color: "#fff",fontWeight: 600,fontFamily: "'Rische', sans-serif"}}
                                        />
                                    </ListItemButton>
                                  </ListItem>
                                ))}
                          </List>
                      )}
                </Paper> )}
            </Box>
          </Box>
          {/*Box Notifiche + Utente*/}
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display:"flex", alignItems: "center", gap: 2 }}>
            
            {/* NOtifiche */}
            <IconButton
              size="large"
              sx={{
                display: "flex",
                color: "#f08c23",
                background: "transparent",
                "&:hover": { background: "rgba(240,140,35,0.12)" }
              }}
              onClick={(e) => setAnchorElNotifiche(e.currentTarget)}
            >
              <Badge
                badgeContent={notifiche.reduce((sum, n) => sum + n.count, 0)}
                color="error"
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <NotificheMenu
              anchorEl={anchorElNotifiche}
              onClose={() => setAnchorElNotifiche(null)}
              onApriChat={(n) => {
                const targetId = n.fromUserId;
                localStorage.setItem("chatAperta", targetId);
                setActiveContent("chat");
                setUtenteSelezionato(targetId);
                setUtenteSelezionatoOggetto({ _id: targetId, username: n.username });
              }}
            />

            {/* Profilo */}
            <Box sx={{ display:{ xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
              <IconButton
                size="large"
                color="inherit"
                onClick={handleProfileMenuOpen}
              >
                <AccountCircle />
              </IconButton>

              <Typography
                variant="subtitle1"
                noWrap
                sx={{
                  fontFamily: "'Rische', sans-serif",
                  color: "#fff",
                  fontWeight: 550,
                  letterSpacing: 0.6,
                  fontSize: "1.14rem"
                }}
              >
                {user?.username || "Utente"}
              </Typography>
            </Box>

          </Box>

          {/* More Icon per mobile */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      <ModaleModificaProfilo
                open={openEditUser}
                onClose={() => setOpenEditUser(false)}
            />
    </Box>
  );
}
