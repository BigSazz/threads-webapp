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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

// import { updateUser } from '@/lib/actions/user.actions';
import { ThreadValidation } from '@/lib/validations/thread';
import { createThread } from '@/lib/actions/thread.actions';

const PostThread = ({ userId }: { userId: string }) => {
	const router = useRouter();
	const pathname = usePathname();

	const form = useForm({
		resolver: zodResolver(ThreadValidation),
		defaultValues: {
			thread: '',
			accountId: userId,
		},
	});

	const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
		await createThread({
			text: values?.thread,
			author: values?.accountId,
			communityId: null,
			path: pathname,
		});

		router.push('/');
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='mt-10 flex flex-col justify-start gap-10'
			>
				<FormField
					control={form.control}
					name='thread'
					render={({ field }) => (
						<FormItem className='flex flex-col justify-start gap-3 w-full'>
							<FormLabel className='text-base-semibold text-light-2'>
								What's on your mind?
							</FormLabel>
							<FormControl className='focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 !important border border-dark-4 bg-dark-3 text-light-1'>
								<Textarea
									rows={10}
									autoComplete='off'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type='submit' className='bg-primary-500'>
					Post Thread
				</Button>
			</form>
		</Form>
	);
};

export default PostThread;
