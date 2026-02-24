import { Box, List, ListItem, ListItemButton, ListItemText } from "@mui/material";

export default function ChatList({ conversazioni, onSelectChat }) {
  return (
    <Box
      sx={{
        maxHeight: "270px",
        overflowY: "auto",
        borderRadius: "12px",
        mx: 1,
        mb: 1,
        p: 2,
        "&::-webkit-scrollbar": { width: "6px" },
        "&::-webkit-scrollbar-thumb": { backgroundColor: "#888", borderRadius: "4px" },
        "&::-webkit-scrollbar-thumb:hover": { backgroundColor: "#aaa" },
      }}
    >
      <List disablePadding>
        {Array.isArray(conversazioni) && conversazioni.length > 0 ? (
          conversazioni.map((conv) => {
            const nonLetti = conv.nonLetti || 0;

            return (
              <ListItem key={conv.utente._id} disablePadding sx={{ mb: 2 }}>
                <ListItemButton
                  sx={{
                    background: "#001126",
                    borderRadius: "18px",
                    minHeight: 60,
                    boxShadow: "0 2px 12px 0 #00121b35",
                    color: "#fff",
                    px: 2,
                    py: 1.1,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    "&:hover": {
                      backgroundColor: "#28659e",
                      boxShadow: "0 4px 20px 0 #00121b58",
                    },
                    transition: "background .15s, box-shadow .19s",
                  }}
                  onClick={() => onSelectChat(conv.utente)}
                >
                  <Box sx={{ width: "100%" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {/* username */}
                      <span
                        style={{
                          fontWeight: 650,
                          fontFamily: "'Rische', sans-serif",
                          fontSize: "1.05rem",
                          overflow: "hidden",       
                          textOverflow: "ellipsis", 
                          whiteSpace: "nowrap",    
                          minWidth: 0,             
                          flex: 1,
                        }}
                      >
                        {conv.utente.username}
                      </span>

                      {/* Orario e pallino verde */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          flexShrink: 0,
                        }}
                      >
                        {conv.dataUltimoMessaggio && (
                          <span
                            style={{
                              fontSize: "0.72rem",
                              color: "#aad1fb",
                              whiteSpace: "nowrap",
                            }}
                          >
                           {(() => {
                            const data = new Date(conv.dataUltimoMessaggio);
                            const oggi = new Date();

                            const stessoGiorno =
                                data.getDate() === oggi.getDate() &&
                                data.getMonth() === oggi.getMonth() &&
                                data.getFullYear() === oggi.getFullYear();

                            return stessoGiorno
                                ? data.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })
                                : data.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit" });
                            })()}
                          </span>
                        )}

                        {/* Pallino*/}
                        {nonLetti > 0 && (
                          <div
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              backgroundColor: "#00e676",
                              flexShrink: 0,
                            }}
                          ></div>
                        )}
                      </Box>
                    </Box>

                    {/* Ultimo mess */}
                    <span
                      style={{
                        color: "#dbefff",
                        fontSize: "0.9rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        display: "block",
                        fontFamily: "'Rische', sans-serif",
                      }}
                    >
                      {conv.ultimoMessaggio || "Nessun messaggio"}
                    </span>
                  </Box>
                </ListItemButton>
              </ListItem>
            );
          })
        ) : (
          <ListItem>
            <ListItemText
              primary="Nessuna conversazione"
              primaryTypographyProps={{
                fontFamily: "'Rische', sans-serif",
                fontWeight: 580,
                fontSize: "1.05rem",
                color: "#fff",
              }}
            />
          </ListItem>
        )}
      </List>
    </Box>
  );
}
