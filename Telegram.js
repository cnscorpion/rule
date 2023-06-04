// ==UserScript==
// @name         Pin Selected Telegram Chat
// @namespace    quantumultx
// @version      2
// @description  Pin selected Telegram chat using Quantumult X rewrite script.
// @match        https://api.telegram.org/*
// @grant        none
// ==/UserScript==

let selected_chat_id = null;

/**
 * Sets pinned flag for given chat ID.
 * @param {string} chatId - The ID of the chat to pin.
 */
function pinChat(chatId) {
   const body = $response.body;
   const obj = JSON.parse(body);

   if (obj.hasOwnProperty('result')) {
       // Loop through chats and set pinned flag if chat ID matches selected chat ID
       for (let i = 0; i < obj.result.chats.length; i++) {
           const chat = obj.result.chats[i];
           if (chat.id.toString() === chatId) {
               chat.pinned = true;
           }
       }
   }

   const newBody = JSON.stringify(obj);
   $done({body: newBody});
}

// Define response filter to capture user-selected chat ID
$done({_responseFilter: function (resp) {
   const body = resp.body;
   const obj = JSON.parse(body);

   if (obj.hasOwnProperty('result')) {
       // Determine if user has selected a chat by clicking on it
       if (obj.result.hasOwnProperty('chat') && obj.result.chat.hasOwnProperty('id')) {
           selected_chat_id = obj.result.chat.id.toString();
       }
   }

   return resp;
}});

// Pin selected chat if ID is set
if (selected_chat_id !== null) {
   pinChat(selected_chat_id);
}

$rewrite.*/chats/(all|pinned) requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/cnscorpion/rule/main/Telegram.js
