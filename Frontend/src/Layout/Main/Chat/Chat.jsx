import {useChat} from "../../../Hooks/useChat";
import "./Chat.css";
import SendIcon from '@mui/icons-material/Send';

const ChatBox = ({selectedUserId, selectedUsername, setNuovoMessaggio}) => {

    const {messages,newMessage,setNewMessage,handleSend,messagesEndRef,messagesContainerRef,isChatReady,titleName,userId} = useChat(selectedUserId, selectedUsername, setNuovoMessaggio);
    
    return (
        <div className="chat-container">
            {/* HEADER */}
            <div
                style={{
                    padding: 10,
                    borderBottom: "1px solid #2b2b2b",
                    fontWeight: "bold",
                    textAlign: "left", 
                    backgroundColor: "#001126", 
                    fontFamily: "'Rische', sans-serif", 
                }}
            >
                {titleName}
            </div>

            {/* AREA MESSAGGI */}
            <div
                ref={messagesContainerRef}
                style={{
                    flex: 1,
                    padding: 10,
                    overflowY: "scroll", 
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    minHeight: 0, 
                    scrollbarWidth: "none", // Firefox
                    msOverflowStyle: "none", // IE/Edge
                    WebkitOverflowScrolling: "touch", // iOS smooth scroll
                }}
                className="hide-scrollbar" 
            >

            {messages.map((msg, idx) => {
                    const isMine = msg.IdMittente === userId;
                    return (
                        <div
                            key={idx}
                            style={{
                                display: "flex",
                                justifyContent: isMine ? "flex-end" : "flex-start",
                            }}
                        >
                            <div
                                style={{
                                    backgroundColor: isMine ? "#063257" : "#e0e0e0", 
                                    color: isMine ? "#fff" : "#000",
                                    padding: "8px 12px",
                                    borderRadius: 15,
                                    maxWidth: "70%",
                                    wordWrap: "break-word",
                                    fontFamily: "'Rische', sans-serif", 
                                }}
                            >
                                {msg.Messaggio}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <form
                onSubmit={handleSend}
                className="input-area-container"
            >
                <input
                    type="text"
                    className="chat-input"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={
                        isChatReady ? "Scrivi un messaggio..." : "Seleziona un utente..."
                    }
                    disabled={!isChatReady}
                />
                <button
                    type="submit"
                    style={{
                        marginLeft: 5,
                        padding: "8px 15px",
                        borderRadius: 4,
                        backgroundColor: !newMessage.trim() ? "#f08c23" : "#f08c23", 
                        cursor: newMessage.trim() ? "pointer" : "default",
                        color: "white",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: !newMessage.trim() ? 0.6 : 1,
                        position: "relative", 
                        zIndex: 11, 
                    }}
                    disabled={!isChatReady || !newMessage.trim()}
                >
                    <SendIcon fontSize="small" />
                </button>
            </form>
        </div>
    );
};

export default ChatBox;
