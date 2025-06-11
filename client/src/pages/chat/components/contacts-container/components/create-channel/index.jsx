import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import MultipleSelector from "@/components/ui/multipleselect";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import {
  CREATE_CHANNEL_ROUTE,
  GET_ALL_CONTACTS_ROUTE,
} from "@/utils/constants";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";

const CreateChannel = () => {
  const { setSelectedChatType, setSelectedChatData, addChannel } =
    useAppStore();
  const [newChannelModel, setNewChannelModel] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [channelName, setChannelName] = useState("");

  useEffect(() => {
    const getData = async () => {
      const res = await apiClient.get(GET_ALL_CONTACTS_ROUTE, {
        withCredentials: true,
      });
      setAllContacts(res.data.contacts);
    };
    getData();
  }, []);

  const CreateChannel = async () => {
    try {
      if (channelName.length > 0 && selectedContacts.length > 0) {
        const res = await apiClient.post(
          CREATE_CHANNEL_ROUTE,
          {
            name: channelName,
            members: selectedContacts.map((contact) => contact.value),
          },
          {
            withCredentials: true,
          }
        );
        if (res.status === 201) {
          setChannelName("");
          setSelectedContacts([]);
          setNewChannelModel(false);
          addChannel(res.data.channel);
          // socket event
        }
      }
    } catch (error) {
      console.log("error in CreateChannel", { error });
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-sm hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setNewChannelModel(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Create New Channel
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog
        open={newChannelModel}
        onOpenChange={setNewChannelModel}
      >
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Please fill up the details for new channel
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="">
            <Input
              placeholder="Channel Name"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
            />
          </div>
          <div className="">
            <MultipleSelector
              className="rounded-lg p-6 bg-[#2c2e3b] border-none outline-none py-2 text-white"
              placeholder="Search Contacts"
              defaultOptions={allContacts}
              value={selectedContacts}
              onChange={setSelectedContacts}
              emptyIndicator={
                <h2 className="text-center text-lg leading-10 text-gray-600 ">
                  {/* {console.log({ selectedContacts })} */}
                  {selectedContacts.length > 0
                    ? "No more contacts"
                    : `No results found`}
                </h2>
              }
            />
          </div>
          <div className="">
            <Button
              className="w-full mt-2 bg-purple-700 hover:bg-purple-900 transition-all duration-300"
              onClick={CreateChannel}
            >
              Create Channel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;
