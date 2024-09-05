import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const Posts = ({feedType}) => {

	const getPostEndPoint = () => {
		switch(feedType) {
			case 'foryou':
				return '/api/posts/all';
			case 'following':
				return '/api/posts/following';
			default:
				return '/api/posts/all';
		}
	}

	const POST_ENDPOINT = getPostEndPoint()

	const {data:posts, isLoading, refetch, isRefetching } = useQuery({
		queryKey: ['postQuery'],
		queryFn: async () => {
			try {
				const res = await fetch(POST_ENDPOINT)
				const data = await res.json();

				if(!res.ok) {
					throw new Error(data.error || "Something went wrong")
				}

				return data;
			} 
			catch (error) {
				throw new Error(error)
			}
		}
	})

	useEffect(() => {
	  refetch();
	}, [feedType, refetch])
	

	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && posts && 
				posts.map((post) => {
					return <Post key={post._id} post={post} />;
				}
			)}
		</>
	);
};
export default Posts;