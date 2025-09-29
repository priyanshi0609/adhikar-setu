import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CustomTooltip from "./CustomTooltip";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <CustomTooltip text="Go Back">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center justify-center w-10 h-10 bg-gray-200 hover:bg-gray-300 
                   text-gray-800 shadow-sm transition rounded-full mb-4 cursor-pointer"
      >
        <ArrowLeft size={20} />
      </button>
    </CustomTooltip>
  );
};

export default BackButton;
