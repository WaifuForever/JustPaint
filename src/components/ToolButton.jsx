const ToolButton = ({ icon: Icon, action, selected }) => {
    return (
        <div
            className={`flex w-7 h-7 m-1 rounded-md ${selected ? "bg-blue-300 hover:bg-gray-500" : "bg-blue-100 hover:bg-gray-300"} justify-center items-center`}
            onClick={action}
        >
            {Icon}
        </div>
    );
};

export default ToolButton;
