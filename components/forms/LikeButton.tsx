'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import { likeThread } from '@/lib/actions/thread.actions';

interface Props {
	threadId: string;
	userId: string;
}

const LikeButton = ({ threadId, userId }: Props) => {
	const pathname = usePathname();

	return (
		<>
			<Image
				src='/assets/heart-gray.svg'
				alt='Heart Icon'
				width={24}
				height={24}
				className='cursor-pointer object-contain'
				onClick={async () => {
					await likeThread(JSON.parse(threadId), userId, pathname);
				}}
			/>
		</>
	);
};

export default LikeButton;
