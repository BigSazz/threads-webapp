'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import { unlikeThread } from '@/lib/actions/thread.actions';

interface Props {
	threadId: string;
	userId: string;
}

const UnlikeButton = ({ threadId, userId }: Props) => {
	const pathname = usePathname();

	return (
		<>
			<Image
				src='/assets/heart-filled.svg'
				alt='Heart Icon'
				width={24}
				height={24}
				className='cursor-pointer object-contain'
				onClick={async () => {
					await unlikeThread(JSON.parse(threadId), userId, pathname);
				}}
			/>
		</>
	);
};

export default UnlikeButton;
