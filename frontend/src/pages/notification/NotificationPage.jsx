import { IoSettingsOutline } from "react-icons/io5";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { FaHeart, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const NotificationPage = () => {

    const queryClient = useQueryClient();

    const { data:notifications, isLoading } = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            try {
              const res = await fetch('/api/notifications');
              const data = await res.json();
    
              if(data.error) return null;
    
              if(!res.ok) {
                throw new Error(data.error || "Something went wrong")
              }
              console.log("authUser is here: ", data)
              return data;
            } 
            catch (error) {
              throw new Error(error)
            }
        }
      })

      const { mutate:deleteNotifications } = useMutation({
        mutationFn: async () => {
          try {
            const res = await fetch('/api/notifications', {
              method: 'DELETE',
            })
    
            const data = await res.json();
            if(!res.ok) throw new Error(data.error || 'Something went wrong');
    
            return data;
          } 
          catch (error) {
            throw new Error(error)
          }
        },
        onSuccess: () => {
          toast.success('Notifications deleted successfully');
          queryClient.invalidateQueries({queryKey: ['notifications']})
        },
        onError: (error) => {
            toast.error(error.message)
        }
      })
      console.log(notifications)

    return (
        <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
            <div className="flex justify-between items-center p-4 border-b border-zinc-700">
                <p className="font-bold">Notifications</p>
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="m-1">
                        <IoSettingsOutline className="w-4"/>
                    </div>
                    <ul 
                        tabIndex={0}
                        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded w-52"
                    >
                        <li>
                            <a onClick={deleteNotifications}>Delete all notifications</a>
                        </li>
                    </ul>
                </div>
            </div>

            {isLoading && (
                <div className='flex justify-center h-full items-center'>
                    <LoadingSpinner size='lg' />
                </div>
            )}

            {notifications?.length === 0 && <div className='text-center p-4 font-bold'>No notifications 🤔</div>}

            {notifications?.map((notification) => (
                <div className='border-b border-gray-700' key={notification._id}>
                    <div className='flex gap-4 p-4'>
                        {notification.type === "follow" && <FaUser className='w-6 h-6 text-primary' />}
                        {notification.type === "like" && <FaHeart className='w-6 h-6 text-red-500' />}
                        <Link to={`/profile/${notification.from.userName}`}>
                            <div className='avatar'>
                                <div className='w-8 rounded-full'>
                                    <img src={notification.from.profileImg || "/avatar-placeholder.png"} />
                                </div>
                            </div>
                            <div className='flex gap-2'>
                                <span className='font-bold'>@{notification.from.userName}</span>{" "}
                                {notification.type === "follow" ? "followed you" : "liked your post"}
                            </div>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default NotificationPage
