import Image from 'next/image';
import Link from 'next/link';

import DeleteThread from '../forms/DeleteThread';
import { getTimeAgoFromNow } from '@/lib/utils';
import LikeThread from '../shared/LikeThread';

interface ThreadData {
	id: string;
	currentUserId: string;
	parentId: string | null;
	content: string;
	author: {
		id: string;
		name: string;
		image: string;
	};
	community: {
		id: string;
		name: string;
		image: string;
	} | null;
	createdAt: string;
	comments: {
		author: {
			image: string;
		};
	}[];
	likes: {
		id: string;
		name: string;
		image: string;
	}[];
	isComment?: boolean;
}

const ThreadCard = ({
	id,
	currentUserId,
	parentId,
	content,
	author,
	community,
	createdAt,
	comments,
	likes,
	isComment = false,
}: ThreadData) => {
	console.log('ThreadCard for likes ============>', likes, currentUserId);
	return (
		<article
			className={`${
				isComment ? 'px-0 xs:px-10' : 'rounded-xl bg-dark-2 p-7'
			} flex w-full flex-col`}
		>
			<div className='flex items-start justify-between'>
				<div className='flex w-full flex-1 flex-row gap-4'>
					<div className='flex flex-col items-center'>
						<Link
							className='relative h-11 w-11'
							href={`/profile/${author?.id}`}
						>
							<Image
								src={author?.image}
								alt='Profile Image'
								fill
								className='cursor-pointer rounded-full'
							/>
						</Link>

						<div className='thread-card_bar' />
					</div>

					<div className='flex w-full flex-col'>
						<div className='flex items-center justify-between'>
							<Link
								className='w-fit'
								href={`/profile/${author?.id}`}
							>
								<h4 className='cursor-pointer text-base-semibold text-light-1'>
									{author?.name}
								</h4>
							</Link>
							<p className='text-subtle-medium text-gray-1'>
								{getTimeAgoFromNow(createdAt)}
							</p>
						</div>
						<p className='mt-2 text-small-regular text-light-2'>
							{content}
						</p>

						<div
							className={`${
								isComment && 'mb-10'
							} mt-5 flex flex-col gap-3`}
						>
							<div className='flex gap-3.5'>
								<LikeThread
									threadId={JSON.stringify(id)}
									likes={likes}
									currentUserId={currentUserId}
								/>
								<Link href={`/thread/${id}`}>
									<Image
										src='/assets/reply.svg'
										alt='reply Icon'
										width={24}
										height={24}
										className='cursor-pointer object-contain'
									/>
								</Link>
								{/* <Image
									src='/assets/repost.svg'
									alt='repost Icon'
									width={24}
									height={24}
									className='cursor-pointer object-contain'
								/> */}
								{/* <Image
									src='/assets/share.svg'
									alt='share Icon'
									width={24}
									height={24}
									className='cursor-pointer object-contain'
								/> */}
							</div>

							{isComment && (
								<div className='ml-1 mt-3 flex items-center gap-2'>
									{comments.length > 0 && (
										<Link href={`/thread/${id}`}>
											<p className='mt-1 text-subtle-medium text-gray-1'>
												{comments.length} repl
												{comments.length > 1
													? 'ies'
													: 'y'}
											</p>
										</Link>
									)}

									{comments.length > 0 &&
										likes.length > 0 && (
											<p className='mt-1 text-subtle-medium text-gray-1'>
												{' \u2022 '}
											</p>
										)}

									{likes.length > 0 && (
										<p className='mt-1 text-subtle-medium text-gray-1'>
											{likes.length} like
											{likes.length > 1 ? 's' : ''}
										</p>
									)}
								</div>
							)}
						</div>
					</div>
				</div>

				<DeleteThread
					threadId={JSON.stringify(id)}
					currentUserId={currentUserId}
					authorId={author.id}
					parentId={parentId}
					isComment={isComment}
				/>
			</div>

			{!isComment && (
				<div className='ml-1 mt-3 flex items-center gap-2'>
					{comments.length > 0 && (
						<div className='flex gap-2 items-center'>
							{comments.slice(0, 2).map((comment, idx) => (
								<Image
									key={idx}
									src={comment.author.image}
									alt={`user_${idx}`}
									width={24}
									height={24}
									className={`${
										idx !== 0 && '-ml-5'
									} rounded-full object-cover`}
								/>
							))}

							<Link href={`/thread/${id}`}>
								<p className='mt-1 text-subtle-medium text-gray-1'>
									{comments.length} repl
									{comments.length > 1 ? 'ies' : 'y'}
								</p>
							</Link>
						</div>
					)}
					{comments.length > 0 && likes.length > 0 && (
						<p className='mt-1 text-subtle-medium text-gray-1'>
							{' \u2022 '}
						</p>
					)}

					{likes.length > 0 && (
						<p className='mt-1 text-subtle-medium text-gray-1'>
							{likes.length} like{likes.length > 1 ? 's' : ''}
						</p>
					)}
				</div>
			)}
		</article>
	);
};

export default ThreadCard;
