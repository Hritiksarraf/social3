"use client";

import PostCard from '@components/cards/PostCard'
import SkeletonCard from '@components/ui/SkeletonCard'
import EmptyState from '@components/ui/EmptyState'
import { useQuery } from 'convex/react'
import { api } from '@convex/_generated/api'
import { useCurrentUser } from '@lib/hooks/useCurrentUser'

const SavedPosts = () => {
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
      {!loading && profile.savedPosts.length === 0 && (
        <EmptyState emoji="🔖" title="Nothing saved yet" subtitle="Tape posts to keep them here." />
      )}
      {!loading &&
        profile.savedPosts.map((post) => (
          <PostCard key={post._id} post={post} currentUser={currentUser} />
        ))}
    </div>
  )
}

export default SavedPosts
