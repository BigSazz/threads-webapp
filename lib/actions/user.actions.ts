'use server';

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";

interface Params {
	userId: string;
	username: string;
	name: string;
	image: string;
	bio: string;
	path: string;
}

export async function updateUser({
	userId,
	username,
	name,
	image,
	bio,
	path
}: Params): Promise<void> {
	connectToDB();

	try {
		await User.findOneAndUpdate(
			{ id: userId },
			{
				username: username.toLowerCase(),
				name,
				image,
				bio,
				onboarded: true,
			},
			{ upsert: true }
		)
	
		if (path === '/profile/edit') {
			console.log('revalidating path', Boolean(path === '/profile/edit'));
			revalidatePath('/profile');
		}
	} catch (error: any) {
		throw new Error(`Failed to update user: ${error.message}`);
	}
}

export async function fetchUser(userId: string) {
	try {
		connectToDB();

		return await User
			.findOne({ id: userId })
			// .populate({
			// 	path: 'communities',
			// 	model: Community
			// })
	} catch (error: any) {
		throw new Error(`Failed to fetch user: ${error.message}`);
	}
}

export async function fetchUserThreads(userId: string) {
	try {
		connectToDB();

		// TODO: populate community
		const threads = await User.findOne({ id: userId })
			.populate({
				path: 'threads',
				model: Thread,
				options: { sort: { createdAt: -1 } },
				populate: {
					path: 'children',
					model: Thread,
					populate: {
						path: 'author',
						model: User,
						select: 'id name image'
					}
				}
			}).exec();

		return threads;
	} catch (error: any) {
		throw new Error(`Failed to fetch user threads: ${error.message}`);
	}
}

export async function fetchUsers({ 
	userId,
	searchString = '',
	pageNumber = 1,
	pageSize = 10,
	sortBy = 'desc',
}: {
	userId: string;
	searchString?: string;
	pageNumber?: number;
	pageSize?: number;
	sortBy?: SortOrder;
}) {
	try {
		connectToDB();

		const skipAmount = (pageNumber - 1) * pageSize;

		const regex = new RegExp(searchString, 'i');

		const query: FilterQuery<typeof User> = {
			id: { $ne: userId }
		}

		if (searchString.trim() !== '') {
			query.$or = [
				{ username: { $regex: regex} },
				{ name: { $regex: regex} },
			];
		}

		const sortOptions = { createdBy: sortBy };

		const userQuery = User.find(query)
			.sort(sortOptions)
			.skip(skipAmount)
			.limit(pageSize);

		const totalUsersCount = await User.countDocuments(query);

		const users = await userQuery.exec();

		const isNext = totalUsersCount > skipAmount + users.length;

		return {
			users,
			isNext
		}
	} catch (error: any) {
		throw new Error(`Failed to fetch users: ${error.message}`);
	}
}

export async function getActivity(userId: string) {
	try {
		connectToDB();

		const userThreads = await Thread.find({ author: userId });

		const childThreadIds = userThreads.reduce((acc, thread) => {
			return acc.concat(thread.children);
		}, []);

		const replies = await Thread.find({ 
			_id: { $in: childThreadIds },
			author: { $ne: userId },
		})
		.sort({ createdAt: 'desc' })
		.populate({
			path: 'author',
			model: User,
			select: '_id name image'
		});

		return replies;
		
	} catch (error: any) {
		throw new Error(`Failed to fetch activity: ${error.message}`);
	}
}