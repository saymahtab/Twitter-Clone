import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const CreatePost = () => {

  const queryClient = useQueryClient();

  const [text, setText] = useState('');
  const [img, setImg] = useState(null);

  const { mutate:createPost, isPending, isError, error } = useMutation({
    mutationFn: async ({text, img}) => {
      try {
        const res = await fetch('/api/posts/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({text, img})
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
      setText('');
      setImg(null)
      toast.success('Post Created Successfully');
      queryClient.invalidateQueries({queryKey: ['posts']});
    }
  })

  const imgRef = useRef(null);

  const { data:authUser } = useQuery({queryKey: ['authUser']})

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost({text, img});
  }

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if(file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="flex items-start p-4 gap-3 border-b border-zinc-700">

      <div className="avatar">
        <div className="w-10 rounded-full">
          <img src={authUser.profileImg || "/avatar-placeholder.png"} />
        </div>
      </div>

      <form className="flex flex-col w-full gap-2" onSubmit={handleSubmit}>
        <textarea
          className="textarea p-0 focus:outline-none border-none resize-none text-xl w-full border-gray-800" 
          placeholder="What is happening?!"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {img && (
          <div className="relative w-full mx-auto">
            <IoCloseSharp 
              className="absolute top-0 right-0 bg-zinc-800 text-white rounded-full size-5 cursor-pointer"
              onClick={() => {
                setImg(null)
                imgRef.current.value = null; 
              }}
            />
            <img src={img} className="rounded object-contain" />
          </div>
        )}

        <div className="flex justify-between border-t border-zinc-700 py-2">
          <div className="flex gap-2 items-center">
            <CiImageOn 
              className="size-6 fill-primary cursor-pointer"
              onClick={() => imgRef.current.click()}
            />
            <BsEmojiSmileFill className="size-5 fill-primary cursor-pointer" />
          </div>

          <input type="file" ref={imgRef} hidden onChange={handleImgChange}/>

          <button className="btn btn-primary rounded-full btn-sm text-white px-4">
            {isPending ? "Posting..." : "Post"}
          </button>

        </div>
        {isError && <div className='text-red-500'>{error.message}</div>}
      </form>
    </div>
  )
}

export default CreatePost
