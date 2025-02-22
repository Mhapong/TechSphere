import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../../context/Auth.context";
import ax from "../../conf/ax";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import usericon from "./Image/user-icon.webp";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

const Chat = ({ open, close }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [data, setData] = useState(null);
  const [messages, setMessages] = useState([]);
  const { state: ContextState } = useContext(AuthContext);
  const { user } = ContextState;
  const [usersAll, setUsersAll] = useState([]);
  const [queryUserAll, setQueryUserAll] = useState(null);
  const chatLoaded = useRef(true);

  useEffect(() => {
    fetchChat();
    fetchUserALL();
    if (selectedUser && data.length > 0) {
      openchat(selectedUser);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchChat();
      // if (selectedUser && data.length > 0) {
      //   openchat(selectedUser);
      // }
    }, 5000);

    return () => clearInterval(interval);
  }, [messages]);

  useEffect(() => {
    if (selectedUser && messages.length > 0 && !chatLoaded.current) {
      openchat(selectedUser);
      chatLoaded.current = true;
    }
  }, [messages]); // ทำงานเมื่อ messages เปลี่ยน
  const fetchUserALL = async () => {
    try {
      // if (user.userRole === "User"){
      const response = await ax.get(
        `users?filters[id][$ne]=${user.id}&populate=*`
      );
      setUsersAll(response.data);
      // }else {
      //   const response = await ax.get(`user?`)
      //   console.log(response.data.data)
      //   setUsersAll(response.data.data)
      // }
    } catch (e) {
      console.log("Error", e);
    }
  };
  const fetchChat = async () => {
    try {
      const response = await ax.get(
        `chats?filters[$or][0][sender][id][$eq]=${user.id}&filters[$or][1][request][id][$eq]=${user.id}&populate=*`
      );
      setData(response.data.data);
      const senders = response.data.data.reduce((acc, item) => {
        const existingSender = acc.find(
          (sender) =>
            sender.id === item.sender.id || sender.id === item.request.id
        );

        if (item.sender.id === user.id || item.request.id === user.id) {
          if (existingSender) {
            if (
              item.request.id === user.id &&
              item.reading_status === "unread"
            ) {
              existingSender.reading_status = "unread";
            }
          } else {
            acc.push({
              id: item.sender.id === user.id ? item.request.id : item.sender.id,
              first_name:
                item.sender.id === user.id
                  ? item.request.first_name
                  : item.sender.first_name,
              last_name:
                item.sender.id === user.id
                  ? item.request.last_name
                  : item.sender.last_name,
              reading_status:
                item.request.id === user.id && item.reading_status === "unread"
                  ? "unread"
                  : "read",
              message: item.message,
            });
          }
        }

        return acc;
      }, []);

      setUsers(senders);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const filteredUserAll = queryUserAll
    ? usersAll.filter(
        (value) =>
          value.first_name.toLowerCase().includes(queryUserAll.toLowerCase()) ||
          value.last_name.toLowerCase().includes(queryUserAll.toLowerCase()) ||
          value.role.name.toLowerCase().includes(queryUserAll.toLowerCase())
      )
    : usersAll;

  const [isTyping, setIsTyping] = useState(false);
  const [SendMassage, setSendMassage] = useState(null);

  const openchat = (value) => {
    fetchChat();
    setSelectedUser(value);
    console.log("Opencaht");
    const massagedata = data
      .filter(
        (item) => item.request.id === value.id || item.sender.id === value.id
      )
      .map((item) => {
        const isRequest = item.request.id === value.id;

        return {
          type: isRequest ? "request" : "sender", // ประเภท request หรือ sender
          id: isRequest ? item.request.id : item.sender.id,
          first_name: isRequest
            ? item.request.first_name
            : item.sender.first_name,
          last_name: isRequest ? item.request.last_name : item.sender.last_name,
          message: item.massage, // ข้อความ
          createdAt: new Date(item.createdAt), // แปลงเป็น Date object
        };
      })
      .sort((a, b) => a.createdAt - b.createdAt); // เรียงตามเวลา (เก่า -> ใหม่)
    setMessages(massagedata);
  };

  const ChatMessage = ({ messageData }) => {
    const isMe = messageData.type === "request";

    return (
      <div
        className={`flex flex-col ${isMe ? "items-end" : "items-start"} my-2`}
      >
        <div className="text-gray-500 text-sm mb-1">{`${
          isMe
            ? `${user.first_name} ${user.last_name}`
            : `${messageData.first_name} ${messageData.last_name}`
        }`}</div>

        <div
          className={`px-4 py-2 rounded-lg max-w-xs ${
            isMe
              ? "bg-blue-500 text-white rounded-br-none"
              : "bg-gray-200 text-gray-900 rounded-bl-none"
          }`}
        >
          {messageData.message}
        </div>
      </div>
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!SendMassage.trim()) return;
    setIsTyping(true);
    try {
      await ax.post("chats?populate=*", {
        data: {
          massage: SendMassage,
          sender: user.id,
          request: selectedUser.id,
        },
      });

      setIsTyping(false);
      setSendMassage("");
      await fetchChat();
      openchat(selectedUser);
    } catch (e) {
      console.log("Error", e);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      const updateMessagesStatus = async () => {
        try {
          const updatedMessages = data.filter(
            (item) =>
              item.request.id === user.id &&
              item.sender.id === selectedUser.id &&
              item.reading_status === "unread"
          );
          const updateRequests = updatedMessages.map((msg) =>
            ax.put(`chats/${msg.documentId}?populate=*`, {
              data: { reading_status: "read" },
            })
          );
          if (updatedMessages) {
            await Promise.all(updateRequests);
          }
          console.log("All messages updated to read");
        } catch (error) {
          console.error("Error updating messages:", error);
        }
      };

      updateMessagesStatus();
    }
  }, [selectedUser]);

  // const GetPicture = (URL) => {

  // }

  return (
    <Dialog
      open={open}
      onClose={close}
      className="relative z-30"
      aria-labelledby="slide-over-title"
      role="dialog"
      aria-modal="true"
    >
      <DialogBackdrop
        transition-opacity
        // className="fixed inset-0 bg-gray-500/75 transition-opacity pointer-events-none"
        className="fixed inset-0 bg-black bg-opacity-60 transition-opacity pointer-events-none"
        aria-hidden="true"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
              style={{ top: "3rem" }}
            >
              <TransitionChild style={{ top: "1rem" }}>
                <div className="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 duration-500 ease-in-out data-closed:opacity-0 sm:-ml-10 sm:pr-4">
                  <button
                    type="button"
                    onClick={() => close()}
                    className="relative rounded-md text-gray-300 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden"
                  >
                    <span className="absolute -inset-2.5" />
                    <span className="sr-only">Close panel</span>
                    <XMarkIcon aria-hidden="true" className="size-6" />
                  </button>
                </div>
              </TransitionChild>
              <div class="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                <div className="flex-1 overflow-y-auto">
                  {selectedUser ? (
                    // Display messages for the selected user
                    <div className="p-4">
                      <div className="px-4 sm:px-6">
                        <h2 className="text-2xl font-semibold text-gray-900 flex items-center space-x-3">
                          {/* ปุ่มย้อนกลับ */}
                          <button
                            onClick={() => setSelectedUser(null)}
                            className="p-2 text-blue-700"
                            // className="p-2 bg-gray-200 text-blue-700 rounded-full hover:bg-gray-300 focus:outline-none transition duration-200"
                          >
                            <ArrowBackIosNewOutlinedIcon />
                          </button>

                          {/* ข้อความชื่อแชท */}
                          <span>แชทกับ </span>
                          <span className="font-medium text-gray-800 flex items-center">
                            {`${selectedUser.first_name} ${selectedUser.last_name}`}
                          </span>
                        </h2>
                      </div>
                      <div className="p-4 bg-gray-100 h-[calc(75vh-75px)] overflow-y-auto rounded-lg">
                        {/* <div className="p-4 bg-gray-100 h-screen overflow-y-auto"> */}
                        {messages.map((msg, index) => (
                          <ChatMessage key={index} messageData={msg} />
                        ))}
                      </div>
                      <div className="p-4 border-t">
                        <form onSubmit={onSubmit} className="flex w-full gap-2">
                          <input
                            value={SendMassage}
                            onChange={(e) => setSendMassage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            type="submit"
                            disabled={isTyping}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                          >
                            Send
                          </button>
                        </form>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 space-y-4">
                      <div class="px-4 sm:px-6 bg-">
                        <h2
                          class="text-2xl font-semibold text-gray-900"
                          id="slide-over-title"
                        >
                          แชทของ {`${user.first_name} ${user.last_name}`}
                        </h2>
                      </div>
                      <div className="relative flex items-center gap-3 bg-white p-3 rounded-lg shadow-md border border-gray-200">
                        <GroupAddIcon className="w-6 h-6 text-gray-600" />
                        <div className="w-full">
                          <input
                            id="search"
                            title="ค้นหา"
                            type="text"
                            placeholder="ติดต่อหาผู้ติดต่อใหม่"
                            className="flex-none w-10/12 ml-2 bg-gray-100 focus:bg-white h-10 border border-gray-300 rounded-lg px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            value={queryUserAll || ""}
                            onChange={(e) => setQueryUserAll(e.target.value)}
                          />
                          {queryUserAll &&
                            (filteredUserAll?.length ?? 0) > 0 && (
                              <ul className="absolute left-0 mt-1 w-4/6 ml-14 bg-white border border-gray-300 rounded-lg shadow-md max-h-48 overflow-y-auto z-50">
                                {filteredUserAll.map((user) => (
                                  <li
                                    key={user.id}
                                    className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                                    onClick={() => {
                                      openchat?.(user);
                                      setQueryUserAll(null);
                                    }}
                                  >
                                    {`[${user?.role?.name || "Unknown"}] ${
                                      user?.first_name || ""
                                    } ${user?.last_name || ""}`}
                                  </li>
                                ))}
                              </ul>
                            )}
                        </div>
                      </div>

                      {users.map((value) => (
                        <div
                          key={value.id}
                          onClick={() => openchat(value)}
                          className="flex items-center p-4 bg-white shadow-md rounded-lg hover:bg-gray-100 cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
                        >
                          {/* Avatar */}
                          <img
                            src={usericon}
                            alt="User Icon"
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
                          />

                          <div className="ml-4 flex-1 flex justify-between items-center">
                            {/* Name */}
                            <div className="font-semibold text-gray-800 text-lg">
                              {`${value.first_name} ${value.last_name}`}
                            </div>
                            {/* Message Status */}
                            {value.reading_status &&
                              value?.reading_status === "unread" && (
                                <span className="ml-3 px-3 py-1 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full animate-bounce">
                                  มีข้อความใหม่
                                </span>
                              )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
export default Chat;
