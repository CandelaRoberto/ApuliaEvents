import {useState, useEffect, useRef} from "react";

export function useSearchBar() {
    const [searchValue, setSearchValue] = useState("");
    const [serverResults, setServerResults] = useState([]);
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [noResults, setNoResults] = useState(false);

    const searchRef = useRef();
    const debounceTimeout = useRef(null);

    const applyClientFilter = (value, baseArray = serverResults) => {
    const term = value.trim().toLowerCase();
    if (!term) {
      setResults([]);
      setNoResults(false);
      return;
    }

    const exact = baseArray.filter(
      (u) => (u.username || "").toLowerCase() === term
    );
    const partial =
      exact.length > 0
        ? exact
        : baseArray.filter((u) =>
            (u.username || "").toLowerCase().includes(term)
          );

    setResults(partial);
    setNoResults(partial.length === 0);
  };


  const fetchFromServer = async (value) => {
    const q = value.trim();
    if (!q) {
      setServerResults([]);
      setResults([]);
      setNoResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(
        `https://apuliaeventsbackend.onrender.com/api/user/cercaUtenti?query=${encodeURIComponent(q)}`,
        { method: "GET", credentials: "include" }
      );
      const data = await res.json();
      const arr = Array.isArray(data) ? data : [];
      setServerResults(arr);
      applyClientFilter(q, arr);
    } catch (error) {
      console.error("Errore fetch utenti:", error);
      setServerResults([]);
      setResults([]);
      setNoResults(true);
    } finally {
      setIsSearching(false);
    }
  };


  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchValue(val);

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      fetchFromServer(val);
    }, 300);
  };
     useEffect(() => {
        const handleClickOutside = (event) => {
          if (searchRef.current && !searchRef.current.contains(event.target)) {
            setResults([]);
            setNoResults(false);
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
      }, []);
    
    const resetSearch = () => {
        setSearchValue("");
        setResults([]);
        setNoResults(false);
        };

  return {
    searchValue,
    results,
    isSearching,
    noResults,
    searchRef,
    handleSearchChange,
    resetSearch,
  };
}
   