import { useState } from 'react'
import CreatePost from './CreatePost'
import Posts from '../../components/common/Posts'

const HomePage = () => {

    const [feedType, setFeedType] = useState('foryou')

    return (
        <div className='flex-[4_4_0] border-r border-zinc-700 min-h-screen mr-auto'>
            <div className='flex w-full border-b border-zinc-700'>
                <div 
                    className='flex flex-1 justify-center p-3 hover:bg-secondary transition cursor-pointer duration-300 relative'
                    onClick={() => setFeedType('foryou')}
                >
                    For you

                    {feedType == 'foryou' && (
                        <div className='h-1 w-14 bg-primary absolute bottom-0 rounded-full'></div>
                    )}
                </div>
                <div 
                    className='flex flex-1 justify-center p-3 hover:bg-secondary transition cursor-pointer duration-300 relative'
                    onClick={() => setFeedType('following')}
                >
                    Following

                    {feedType == 'following' && (
                        <div className='h-1 w-16 bg-primary absolute bottom-0 rounded-full'></div>
                    )}
                </div>
            </div>
            <CreatePost />
            <Posts feedType={feedType}/>
        </div>
      )
}

export default HomePage
