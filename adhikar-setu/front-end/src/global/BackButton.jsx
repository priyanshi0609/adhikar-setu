import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      title="Go Back"
      className="flex items-center justify-center w-10 h-10 bg-gray-200 hover:bg-gray-300 
                 text-gray-800 shadow-sm transition rounded-full mb-4"
    >
      <ArrowLeft size={20} />
    </button>
  );
};

export default BackButton;
