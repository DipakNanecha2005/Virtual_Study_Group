import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { HOST, SEARCH_CONTACTS_ROUTE } from "@/utils/constants";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";

const NewDM = () => {
  const { setSelectedChatType, setSelectedChatData } = useAppStore();
  const [openNewContactModel, setOpenNewContactModel] = useState(false);
  const [searchContacts, setSearchContacts] = useState([]);

  const getContacts = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        const res = await apiClient.post(
          SEARCH_CONTACTS_ROUTE,
          { searchTerm },
          { withCredentials: true }
        );
        if (res.status === 200 && res.data.contacts) {
          setSearchContacts(res.data.contacts);
        }
      } else {
        setSearchContacts([]);
      }
    } catch (error) {
      console.log("error in getContacts", { error });
    }
  };

  const selectNewContact = (contact) => {
    setOpenNewContactModel(false);
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    setSearchContacts([]);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-sm hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setOpenNewContactModel(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog
        open={openNewContactModel}
        onOpenChange={setOpenNewContactModel}
      >
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please select a contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="">
            <Input
              placeholder="Search contacts"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => getContacts(e.target.value)}
            />
          </div>
          {searchContacts.length > 0 && (
            <ScrollArea className="h-[250px]">
              <div className="flex flex-col gap-5">
                {searchContacts.map((contact) => (
                  <div
                    key={contact._id}
                    className="flex gap-3 items-center cursor-pointer"
                    onClick={() => selectNewContact(contact)}
                  >
                    <div className="w-12 h-12 relative">
                      <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                        {contact.image ? (
                          <AvatarImage
                            src={`${HOST}/${contact.image}`}
                            alt="profile"
                            className="object-cover w-full h-full bg-black text-white rounded-full"
                          />
                        ) : (
                    // tesing avatar character color
                          <div className="uppercase h-12 w-12 text-lg border-[1px] flex justify-center items-center text-black bg-[#c0b1b6]">
                            {contact.firstName
                              ? contact.firstName.split("").shift()
                              : contact.email.split("").shift()}
                          </div>
                        )}
                      </Avatar>
                    </div>
                    <div className="flex flex-col">
                      <span>
                        {contact.firstName && contact.lastName
                          ? `${contact.firstName} ${contact.lastName}`
                          : contact.email}
                      </span>
                      <span className="text-xs">{contact.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          {searchContacts.length <= 0 && (
            <div className="text-opacity-80 flex flex-col gap-5 items-center mt-6 lg:text-2xl text-xl transition-all duration-300 text-center">
              <h3 className=" text-stone-500">
                Hi<span className="text-[#c0b1b6]">! </span>
                Search Your{" "}
                <span className="block text-[#c0b1b6]">Contact</span>
              </h3>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDM;
