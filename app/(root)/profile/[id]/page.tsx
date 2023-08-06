import PostThread from '@/components/forms/PostThread';
import ProfileHeader from '@/components/shared/ProfileHeader';
import ThreadsTab from '@/components/shared/ThreadsTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { profileTabs } from '@/constants';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import Image from 'next/image';
import { redirect } from 'next/navigation';

const Page = async ({ params }: { params: { id: string } }) => {
	const user = await currentUser();

	if (!user) return null;

	const userInfo = await fetchUser(params.id);

	if (!userInfo?.onboarded) redirect('/onboarding');

	const { _id } = userInfo;

	return (
		<section>
			<ProfileHeader
				accountId={userInfo._id}
				authUserId={user.id}
				name={userInfo.name}
				username={userInfo.username}
				imgUrl={userInfo.image}
				bio={userInfo.bio}
			/>

			<div className='mt-9'>
				<Tabs defaultValue='threads' className='w-full'>
					<TabsList className='flex min-h-[50px] flex-1 items-center gap-3 bg-dark-2 text-light-2 data-[state=active]:bg-[#0e0e12] data-[state=active]:text-light-2 !important'>
						{profileTabs.map((tab, idx) => (
							<TabsTrigger
								key={idx}
								value={tab.value}
								className='flex min-h-[50px] flex-1 items-center gap-3 bg-dark-2 text-light-2 data-[state=active]:bg-[#0e0e12] data-[state=active]:text-light-2 !important'
							>
								<Image
									src={tab?.icon}
									alt={tab?.value}
									width={24}
									height={24}
									className='object-contain'
								/>
								<p className='max-sm:hidden'>{tab?.label}</p>

								{tab?.label === 'Threads' && (
									<p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
										{userInfo?.threads?.length}
									</p>
								)}
							</TabsTrigger>
						))}
					</TabsList>
					{profileTabs.map((tab) => (
						<TabsContent
							key={`content-${tab.label}`}
							value={tab.value}
							className='w-full text-light-1'
						>
							<ThreadsTab
								currentUserId={user.id}
								accountId={userInfo.id}
								accountType='User'
							/>
						</TabsContent>
					))}
				</Tabs>
			</div>
		</section>
	);
};

export default Page;
