const EmptyChatContainer = () => {
  return (
    <div className="flex-1 md:bg-[#1c1d25] md:flex justify-center items-center hidden duration-1000 transition-all">
      <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center">
        <h3 className=" text-stone-500">
          Hi<span className="text-[#c0b1b6]">! </span> 
          Welcome to <span className="block text-[#c0b1b6]">Virtual Study Group</span>
        </h3>
      </div>
    </div>
  );
};

export default EmptyChatContainer;
