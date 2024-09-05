import XSvg from "../svgs/X";
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Sidebar = () => {

    const queryClient = useQueryClient()

    const { mutate: logout } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch('/api/auth/logout', {
                    method: 'POST',
                });
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || "Something went wrong");

                return data;
            } catch (error) {
                console.error(error);
                throw new Error(error.message || "Logout failed");
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['authUser']})
        },
        onError: (error) => {
            toast.error(error.message || "Logout Failed");
        }
    });

    const { data:authUser } = useQuery({queryKey: ['authUser']})

    return (
        <div className="md:flex-[2_2_0] max-w-[16rem] w-18">
            <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-zinc-700 w-20 md:w-full mt-1">
                <Link to='/' className="flex justify-center md:justify-start">
                    <XSvg className="fill-white size-12 px-2 hover:bg-zinc-900 rounded-full" />
                </Link>
                
                <ul className="flex flex-col mt-4 gap-1">
                    <li className="flex justify-center md:justify-start">
                        <Link to='/' className="flex items-center gap-4 hover:bg-zinc-900 rounded-full max-w-fit pl-2 pt-[0.5rem] pb-[0.6rem] pr-8 max-md:pr-2">
                            <MdHomeFilled className="size-8" />
                            <span className="text-xl hidden md:block">Home</span>
                        </Link>
                    </li>
                    <li className="flex justify-center md:justify-start">
                        <Link to='/notifications' className="flex items-center gap-4 hover:bg-zinc-900 rounded-full max-w-fit pl-[0.65rem] pt-[0.5rem] pb-[0.6rem] pr-8 max-md:pr-2 max-md:pl-2">
                            <IoNotifications className="size-7" />
                            <span className="text-xl hidden md:block">Notifications</span>
                        </Link>
                    </li>
                    <li className="flex justify-center md:justify-start">
                        <Link to={`/profile/${authUser?.userName}`} className="flex items-center gap-4 hover:bg-zinc-900 rounded-full max-w-fit pl-[0.78rem] pt-[0.5rem] pb-[0.6rem] pr-8 max-md:pr-3 max-md:pt-3 max-md:pb-3">
                            <FaUser className="size-6" />
                            <span className="text-xl pl-[0.15rem] hidden md:block">Profile</span>
                        </Link>
                    </li>
                </ul>
                
                {authUser && (
                    <Link
                        to={`/profile/${authUser.userName}`}
                        className='mt-auto mb-8 flex gap-4 items-start transition-all duration-300 hover:bg-[#181818] pt-3 pb-2 pl-3 pr-4 rounded-full'
                    >
                        <div className='avatar hidden md:inline-flex'>
                            <div className='w-9  rounded-full'>
                                <img src={authUser?.profileImg || "/avatar-placeholder.png"} />
                            </div>
                        </div>
                        <div className='flex md:justify-between flex-1 justify-center'>
                            <div className='hidden md:block'>
                                <p className='text-white font-bold text-sm w-20 truncate'>{authUser?.fullName}</p>
                                <p className='text-zinc-500 text-sm'>@{authUser?.userName}</p>
                            </div>
                            <BiLogOut 
                                className='w-5 h-5 cursor-pointer' 
                                onClick={(e) => {
                                    e.preventDefault();
                                    logout(); 
                                }}
                            />
                        </div>
                    </Link>
                )}
            </div>
        </div>
    );
}

export default Sidebar;
