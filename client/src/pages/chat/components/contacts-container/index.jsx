import { useEffect } from "react";
import NewDM from "./components/new-dm";
import ProfileInfo from "./components/profile-info";
import { apiClient } from "@/lib/api-client";
import {
  GET_DM_CONTACTS_ROUTE,
  GET_USER_CHANNELS_ROUTE,
} from "@/utils/constants";
import { useAppStore } from "@/store";
import ContactList from "@/components/contact-list";
import CreateChannel from "./components/create-channel";

const ContactsContainer = () => {
  const {
    directMessagesContacts,
    setDirectMessagesContacts,
    channels,
    setChannels,
  } = useAppStore();
  useEffect(() => {
    const getContacts = async () => {
      const res = await apiClient.get(GET_DM_CONTACTS_ROUTE, {
        withCredentials: true,
      });
      if (res.data.contacts) {
        setDirectMessagesContacts(res.data.contacts);
      }
    };
    const getChannels = async () => {
      const res = await apiClient.get(GET_USER_CHANNELS_ROUTE, {
        withCredentials: true,
      });
      if (res.data.channels) {
        setChannels(res.data.channels);
      }
    };

    getContacts();
    getChannels();
  }, [setChannels, setDirectMessagesContacts]);
  // }, []);

  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-b-2 border-[#2f303b] w-full">
      <div className="pt-3 pl-3 text-2xl text-violet-400">
        Virtual Study Group
      </div>
      <div className="my-5">
        <div className="flex justify-between items-center pr-10">
          <h6 className="uppercase tracking-widest text-neutral-400 pl-8 font-light text-opacity-90 text-sm">
            Direct Messages
          </h6>
          <NewDM />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={directMessagesContacts} />
        </div>
      </div>
      <div className="my-5">
        <div className="flex justify-between items-center pr-10">
          <h6 className="uppercase tracking-widest text-neutral-400 pl-8 font-light text-opacity-90 text-sm">
            Channels
          </h6>
          <CreateChannel />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList
            contacts={channels}
            isChannel={true}
          />
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
};

export default ContactsContainer;

// remove afterwards
const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400  font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};
