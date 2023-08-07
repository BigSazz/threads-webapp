import PostThread from '@/components/forms/PostThread';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import Head from 'next/head';

async function Page() {
	const user = await currentUser();

	if (!user) return null;

	const userInfo = await fetchUser(user.id);

	if (!userInfo?.onboarded) redirect('/onboarding');

	const { _id } = userInfo;
	const simpleId = _id.toString();

	return (
		<>
			<Head>
				<title key='title'>ChitChat | Create Thread</title>
			</Head>
			<h1 className='head-text text-left'>Create Thread</h1>

			<PostThread userId={simpleId} />
		</>
	);
}

export default Page;
