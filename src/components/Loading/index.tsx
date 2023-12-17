
const Loading = () => {
  return (
      <div className="grid min-h-[95vh] place-content-center">

          <div className="flex items-center gap-2 text-black">
              <span className="h-6 w-6 block rounded-full border-4 border-t-blue-300 animate-spin"></span>
              Loading...
          </div>

      </div>
  );
};

export default Loading;