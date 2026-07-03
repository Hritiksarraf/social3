"use client";

import PostCard from '@components/cards/PostCard'
import SkeletonCard from '@components/ui/SkeletonCard'
import EmptyState from '@components/ui/EmptyState'
import { useQuery } from 'convex/react'
import { api } from '@convex/_generated/api'
import { useCurrentUser } from '@lib/hooks/useCurrentUser'

const LikedPosts = () => {
  const { currentUser, currentUserLoading } = useCurrentUser()
  const profile = useQuery(
    api.users.getProfile,
    currentUser ? { userId: currentUser._id } : "skip"
  )

  const loading = currentUserLoading || !currentUser || profile === undefined

  return (
    <div className='flex flex-col gap-8 items-center'>
      {loading && (
        <>
          <SkeletonCard />
          <SkeletonCard />
        </>
      )}
      {!loading && profile.likedPosts.length === 0 && (
        <EmptyState emoji="🩶" title="Nothing liked yet" subtitle="Posts you like will show up here." />
      )}
      {!loading &&
        profile.likedPosts.map((post) => (
          <PostCard key={post._id} post={post} currentUser={currentUser} />
        ))}
    </div>
  )
}

export default LikedPosts
