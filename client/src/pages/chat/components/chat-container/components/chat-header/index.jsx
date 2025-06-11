import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { RiCloseFill } from "react-icons/ri";

const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();

  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
      <div className="flex gap-5 items-center justify-between w-full">
        <div className="flex gap-3 items-center justify-center ">
          <div className="w-12 h-12 relative">
            {selectedChatType === "contact" ? (
              <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                {selectedChatData.image ? (
                  <AvatarImage
                    src={`${HOST}/${selectedChatData.image}`}
                    alt="profile"
                    className="object-cover w-full h-full bg-black text-white"
                  />
                ) : (
                  // tesing avatar character color
                  <div className="uppercase h-12 w-12 text-lg border-[1px] flex justify-center items-center text-black bg-[#c0b1b6]">
                    {selectedChatData.firstName
                      ? selectedChatData.firstName.split("").shift()
                      : selectedChatData.email.split("").shift()}
                  </div>
                )}
              </Avatar>
            ) : (
              <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                #
              </div>
            )}
          </div>
          <div>
            {selectedChatType === "contact" &&
            selectedChatData.firstName &&
            selectedChatData.lastName
              ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
              : selectedChatData.email}
            { selectedChatType === "channel" && selectedChatData.name}
          </div>
        </div>
        <div className="flex justify-center items-center gap-5">
          <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all cursor-pointer active:border-white active:border-2">
            <RiCloseFill
              className="text-2xl"
              onClick={closeChat}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
