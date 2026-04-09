import SearchIcon from "@mui/icons-material/Search";
import { Search, SearchIconWrapper, StyledInputBase } from "./SearchBar_styles";
import { useMediaQuery } from "@mui/material";

export default function SearchBar({ value, onChange }) {
    const Desk = useMediaQuery("(min-width:600px)");
    return (
        <Search>
            <SearchIconWrapper>
                <SearchIcon />
            </SearchIconWrapper>

            <StyledInputBase
                placeholder={Desk ? "Cerca utenti..." : "Cerca..."}
                inputProps={{
                    "aria-label": "search",
                    style: { fontFamily: "'Rische', sans-serif" }
                }}
                value={value}
                onChange={onChange}
                sx={{ fontFamily: "'Rische', sans-serif" }}
            />
        </Search>
    );
}
