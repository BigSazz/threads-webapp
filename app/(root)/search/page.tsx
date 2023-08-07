import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs';

import UserCard from '@/components/cards/UserCard';
import SearchBar from '@/components/shared/SearchBar';
import Pagination from '@/components/shared/Pagination';

import { fetchUser, fetchUsers } from '@/lib/actions/user.actions';

const page = async ({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) => {
	const user = await currentUser();

	if (!user) return null;

	const userInfo = await fetchUser(user.id);

	if (!userInfo?.onboarded) redirect('/onboarding');

	// console.log('searchParams======>', searchParams);

	const result = await fetchUsers({
		userId: user.id,
		searchString: searchParams.q,
		pageNumber: searchParams.page ? +searchParams.page : 1,
		pageSize: 25,
	});

	console.log('result======>', result);

	return (
		<section>
			<h1 className='head-text mb-10'>Search</h1>

			<SearchBar routeType='search' />

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

			<Pagination
				path='search'
				pageNumber={searchParams?.page ? +searchParams.page : 1}
				isNext={result.isNext}
			/>
		</section>
	);
};

export default page;
