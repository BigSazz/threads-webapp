'use server';

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
	text: string;
	author: string;
	communityId: string | null;
	path: string;
}

export async function createThread({ text, author, communityId, path }: Params) {
	try {
		connectToDB();

		const createThread = await Thread.create({
			text,
			author,
			community: null,
		});

		await User.findByIdAndUpdate(author, {
			$push: { threads: createThread._id },
		})

		revalidatePath(path);
	} catch (error: any) {
		throw new Error(`Failed to create thread: ${error.message}`);
	}
}

export async function fetchThreads(pageNumber = 1, pageSize = 20) {
	try {
		connectToDB();

		const skipAmount = (pageNumber - 1) * pageSize;

		// Fetch parent threads
		const postQuery = Thread.find({ parentId: {$in: [null, undefined]} })
			.sort({ createdAt: 'desc' })
			.skip(skipAmount)
			.limit(pageSize)
			.populate({ path: 'author', model: User })
			.populate({
				path: 'children',
				populate: {
					path: 'author',
					model: User,
					select: '_id name parentId image'
				}
			})

		const totalPostCount = await Thread.countDocuments({ parentId: {$in: [null, undefined]} });

		const posts = await postQuery.exec();

		const isNext = totalPostCount > skipAmount + posts.length;

		return {
			posts,
			isNext,
		}
	} catch (error: any) {
		throw new Error(`Failed to fetch threads: ${error.message}`);
	}
}

export async function fetchThreadById(id: string) {
	connectToDB();

	try {

		// TODO: populate community
		const thread = await Thread.findById(id)
			.populate({ path: 'author', model: User, select: '_id id name image' })
			.populate({
				path: 'children',
				populate: [
					{ path: 'author', model: User, select: '_id id name parentId image' },
					{ path: 'children', model: Thread, populate: { path: 'author', model: User, select: '_id id name parentId image' } },
				]
			}).exec();

			return thread;
	} catch (error: any) {
		throw new Error(`Failed to fetch thread: ${error.message}`);
	}
}

export async function addCommentToThread(
	threadId: string,
	commentText: string,
	userId: string,
	path: string,
) {
	connectToDB();

	try {
		
		//Find original thread by id
		const originalThread = await Thread.findById(threadId);

		if (!originalThread) {
			throw new Error('Thread not found');
		}

		// Create new thread with comment
		const commentThread = await Thread.create({
			text: commentText,
			author: userId,
			parentId: threadId,
		});

		// Save new thread
		const savedCommentThread = await commentThread.save();

		// Update original thread with new comment
		originalThread.children.push(savedCommentThread._id);

		// Save original thread
		await originalThread.save();

		revalidatePath(path);
	} catch (error: any) {
		throw new Error(`Failed to add comment to thread: ${error.message}`);
	}
}