'use client';
import * as z from 'zod';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { usePathname, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// import { updateUser } from '@/lib/actions/user.actions';
import { CommentValidation } from '@/lib/validations/thread';
import { addCommentToThread } from '@/lib/actions/thread.actions';

interface Props {
	threadId: string;
	currentUserImg: string;
	currentUserId: string;
}

const Comment = ({ threadId, currentUserImg, currentUserId }: Props) => {
	const router = useRouter();
	const pathname = usePathname();

	const form = useForm({
		resolver: zodResolver(CommentValidation),
		defaultValues: {
			thread: '',
		},
	});

	const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
		await addCommentToThread(
			threadId,
			values?.thread,
			JSON.parse(currentUserId),
			pathname
		);

		form.reset();
	};
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='mt-10 flex items-center gap-4 border-y border-y-dark-4 py-5 max-xs:flex-col !important'
			>
				<FormField
					control={form.control}
					name='thread'
					render={({ field }) => (
						<FormItem className='flex items-center justify-center gap-3 w-full'>
							<FormLabel>
								<Image
									src={currentUserImg}
									alt='user'
									width={48}
									height={48}
									className='rounded-full object-cover'
								/>
							</FormLabel>
							<FormControl className='border-none bg-transparent'>
								<Input
									type='text'
									placeholder='Write a comment...'
									className='focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 !important text-light-1 outline-none'
									autoComplete='off'
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<Button
					type='submit'
					className='rounded-3xl bg-primary-500 px-8 py-2 !text-small-regular text-light-1 max-xs:w-full !important'
				>
					Reply
				</Button>
			</form>
		</Form>
	);
};

export default Comment;
