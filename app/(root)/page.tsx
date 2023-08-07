//app/page.tsx
// import { UserButton } from "@clerk/nextjs";

import ThreadCard from '@/components/cards/ThreadCard';
import Pagination from '@/components/shared/Pagination';

import { fetchThreads } from '@/lib/actions/thread.actions';
import { currentUser } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';

async function Home({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) {
	const user = await currentUser();
	const result = await fetchThreads(
		searchParams.page ? +searchParams.page : 1,
		20
	);

	revalidatePath('/');

	const { posts = [], isNext } = result;

	return (
		<>
			<h1 className='head-text text-left'>Your Feed</h1>

			<section className='mt-9 flex flex-col gap-10'>
				{posts.length === 0 ? (
					<div className='flex flex-col items-center justify-center'>
						<h1 className='text-2xl font-bold'>No threads yet</h1>
						<p className='text-gray-500'>
							Create a new thread to get started
						</p>
					</div>
				) : (
					<>
						{posts.map((post) => (
							<ThreadCard
								key={post._id}
								id={post._id}
								currentUserId={user?.id || ''}
								parentId={post.parentId}
								content={post.text}
								author={post.author}
								community={post.community}
								createdAt={post.createdAt}
								comments={post.children}
							/>
						))}
					</>
				)}
			</section>

			<Pagination
				path='/'
				pageNumber={searchParams?.page ? +searchParams.page : 1}
				isNext={isNext}
			/>
		</>
	);
}

export default Home;
