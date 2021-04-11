module.exports = {
    // Admin events
    RESET_DATABASE:             "RESET_DATABASE", 

    // User events
    NEW_USER:                   "NEW_USER",
    USER_LOGIN:                 "USER_LOGIN",
    USER_LOGOUT:                "USER_LOGOUT",
    USER_DISCONNECTED:          "USER_DISCONNECTED",
    ADD_CONTACT:                "ADD_CONTACT",
    PUSH_CONTACT:               "PUSH_CONTACT",
    REMOVE_CONTACT:             "REMOVE_CONTACT",

    // Group events 
    CREATE_GROUP:               "CREATE_GROUP",
    ADD_GROUP_MEMBER:           "ADD_GROUP_MEMBER",
    QUIT_GROUP:                 "QUIT_GROUP",
    PUSH_GROUP:                 "PUSH_GROUP",
    DELETE_GROUP:               "DELETE_GROUP",
    GROUP_DELETED:              "GROUP_DELETED",
    
    // Private message
    SEND_MESSAGE_PRIVATE:       "SEND_MESSAGE_PRIVATE",
    RECEIVE_MESSAGE_PRIVATE:    "RECEIVE_MESSAGE_PRIVATE",

    // Group message
    SEND_MESSAGE_GROUP:         "SEND_MESSAGE_GROUP",
    RECEIVE_MESSAGE_GROUP:      "RECEIVE_MESSAGE_GROUP",

    // Data
    SEND_CHAT_STATE:            "SEND_CHAT_STATE",
    SEND_USER_DATA:             "SEND_USER_DATA",

    // Server messages
    SHOW_TOAST:                 "SHOW_TOAST",
}