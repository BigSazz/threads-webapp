import UserCard from '@/components/cards/UserCard';
import { fetchUser, fetchUsers } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import Image from 'next/image';
import { redirect } from 'next/navigation';

const page = async () => {
	const user = await currentUser();

	if (!user) return null;

	const userInfo = await fetchUser(user.id);

	if (!userInfo?.onboarded) redirect('/onboarding');

	const result = await fetchUsers({
		userId: user.id,
		searchString: '',
		pageNumber: 1,
		pageSize: 25,
	});

	return (
		<section>
			<h1 className='head-text mb-10'>Search</h1>

			<div className='mt-14 flex flex-col gap-9'>
				{result.users.length === 0 ? (
					<div className='flex flex-col items-center justify-center'>
						{/* <Image
							src='/images/empty.svg'
							alt='No results found'
							width={200}
							height={200}
						/> */}
						<p className='no-result'>No users found</p>
					</div>
				) : (
					<>
						{result.users.map((person) => (
							<UserCard
								key={person.id}
								id={person.id}
								name={person.name}
								username={person.username}
								imgUrl={person.image}
								personType='User'
							/>
						))}
					</>
				)}
			</div>
		</section>
	);
};

export default page;
