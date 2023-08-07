import { fetchUser, getActivity } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getTimeAgoFromNow } from '@/lib/utils';

const page = async () => {
	const user = await currentUser();

	if (!user) return null;

	const userInfo = await fetchUser(user.id);
	if (!userInfo?.onboarded) redirect('/onboarding');

	const activity = await getActivity(userInfo._id);

	console.log(activity, 'activity');

	return (
		<section>
			<h1 className='head-text mb-10'>Activity</h1>

			<section className='mt-10 flex flex-col gap-5'>
				{activity.length === 0 ? (
					<div className='flex flex-col items-center justify-center'>
						<p className='no-result'>
							No activities yet to show 😢
						</p>
					</div>
				) : (
					<>
						{activity.map((activity) => (
							<Link
								key={activity._id}
								href={`/thread/${activity?.parentId}`}
							>
								<article className='activity-card'>
									<div className='flex flex-1 items-center gap-2'>
										<Image
											src={activity?.author?.image}
											alt='profile picture'
											width={28}
											height={28}
											className='rounded-full object-contain'
										/>
										<p className='!text-small-regular text-light-1'>
											<span className='mr-1 text-primary-500'>
												{activity?.author?.name}
											</span>{' '}
											replied to your thread
										</p>
									</div>
									<p className='!text-small-regular text-light-1'>
										{getTimeAgoFromNow(activity?.createdAt)}
									</p>
								</article>
							</Link>
						))}
					</>
				)}
			</section>
		</section>
	);
};

export default page;
