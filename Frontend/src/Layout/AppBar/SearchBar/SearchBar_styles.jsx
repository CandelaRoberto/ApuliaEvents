import { InputBase } from "@mui/material";
import { styled } from "@mui/material/styles";

export const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: 10, 
  backgroundColor: "#D43921",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#ad2210",
  },
  width: "100%",
  boxShadow: "0px 2px 8px rgba(44,31,44,0.13)",
  fontFamily: "'Rische', sans-serif",
  transition: "background 0.18s",
  marginRight: theme.spacing(2),
  marginLeft: 0,
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },

  //Tablet
  [theme.breakpoints.between("sm", "lg")]: {
    width: "300px",
    left: "50%",
    transform: "translateX(-50%)",
  },
  //Desktop
  [theme.breakpoints.up("lg")]: {
    width: "400px",
    marginLeft: "120px",  
    left: "50%",
    transform: "translateX(-50%)",
  },
}));

export const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));