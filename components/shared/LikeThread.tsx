// 'use client';

import Image from 'next/image';
import LikeButton from '../forms/LikeButton';
import UnlikeButton from '../forms/UnlikeButton';

interface Props {
	threadId: string;
	likes: {
		id: string;
		name: string;
		image: string;
	}[];
	currentUserId: string;
}

const LikeThread = ({ threadId, likes, currentUserId }: Props) => {
	const userAlreadyLiked = likes?.filter((like) => like.id === currentUserId);
	const hasLiked = Boolean(userAlreadyLiked.length);

	// console.log(
	// 	'LikeThread ============> got here',
	// 	likes,
	// 	currentUserId,
	// 	userAlreadyLiked
	//	threadId
	// );

	return (
		<>
			{hasLiked ? (
				<UnlikeButton threadId={threadId} userId={currentUserId} />
			) : (
				<LikeButton threadId={threadId} userId={currentUserId} />
			)}
		</>
	);
};

export default LikeThread;
