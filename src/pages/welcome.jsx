import { Link } from "react-router-dom";
import { useUserStore } from "../utils/auth";

export default function Welcome() {
  const { user } = useUserStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 gap-12">
      {/* Header Text */}
      <span className="text-4xl font-bold text-slate-200 text-center">
        Wrzuć swoje zdjęcia na HoServ
      </span>

      {/* Button */}
      <Link to={user ? "/photos" : "/login"}>
        <button className="
          px-8 py-4
          rounded-full
          bg-gradient-to-tr from-gray-900/70 via-slate-800/60 to-zinc-800/70
          text-white font-semibold
          shadow-lg
          hover:scale-105 hover:brightness-110
          transition-all duration-200
        ">
          {user ? "Zdjęcia" : "Zaloguj się"}
        </button>
      </Link>
    </div>
  );
}
