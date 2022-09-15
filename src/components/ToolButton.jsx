const ToolButton = ({ icon: Icon, action }) => {
    return (
        <div className="flex w-7 h-7 m-1 rounded-md bg-blue-100 hover:bg-gray-300  justify-center items-center" onClick={() => action}>
            {Icon}
        </div>
    );
};

export default ToolButton;
