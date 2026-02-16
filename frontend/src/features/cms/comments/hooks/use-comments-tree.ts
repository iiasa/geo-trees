import { useMemo } from "react";
import type {
	CommentWithDetailsDto,
	VoloCmsKitPublicCommentsCommentDto,
} from "@/infrastructure/api/types.gen";

export interface CommentNode {
	id?: string;
	entityType?: string | null;
	entityId?: string | null;
	text?: string | null;
	repliedCommentId?: string | null;
	creatorId?: string;
	creationTime?: string;
	author?: {
		id?: string;
		userName?: string | null;
		name?: string | null;
		surname?: string | null;
	};
	children: CommentNode[];
}

/**
 * Transform CommentWithDetailsDto (which has nested replies) into CommentNode tree
 * The API returns replies as a flat array under each root comment, but nested replies
 * have repliedCommentId pointing to their parent reply. We need to build the tree.
 * @param comments Array of CommentWithDetailsDto from the API
 * @returns Tree structure with nested replies as children
 */
export function useCommentsTree(
	comments: CommentWithDetailsDto[],
): CommentNode[] {
	return useMemo(() => {
		if (!comments || comments.length === 0) return [];

		const buildReplyTree = (
			replies: VoloCmsKitPublicCommentsCommentDto[],
		): CommentNode[] => {
			if (!replies || replies.length === 0) return [];

			// Create a map for quick lookup
			const replyMap = new Map<string, CommentNode>();

			// Initialize all replies with empty children array
			for (const reply of replies) {
				if (reply.id) {
					replyMap.set(reply.id, {
						id: reply.id,
						entityType: reply.entityType,
						entityId: reply.entityId,
						text: reply.text,
						repliedCommentId: reply.repliedCommentId,
						creatorId: reply.creatorId,
						creationTime: reply.creationTime,
						author: reply.author,
						children: [],
					});
				}
			}

			// Build the tree - separate first-level replies from nested ones
			const firstLevelReplies: CommentNode[] = [];

			for (const reply of replies) {
				const node = replyMap.get(reply.id || "");
				if (!node) continue;

				// Check if this reply's parent is another reply (nested)
				if (reply.repliedCommentId && replyMap.has(reply.repliedCommentId)) {
					// This is a nested reply, add to parent reply's children
					const parentReply = replyMap.get(reply.repliedCommentId);
					if (parentReply) {
						parentReply.children.push(node);
					}
				} else {
					// This is a first-level reply (direct reply to root comment)
					firstLevelReplies.push(node);
				}
			}

			// Sort first-level replies (oldest first)
			firstLevelReplies.sort((a, b) => {
				const dateA = a.creationTime ? new Date(a.creationTime).getTime() : 0;
				const dateB = b.creationTime ? new Date(b.creationTime).getTime() : 0;
				return dateA - dateB;
			});

			// Recursively sort nested children
			const sortChildren = (nodes: CommentNode[]) => {
				nodes.sort((a, b) => {
					const dateA = a.creationTime ? new Date(a.creationTime).getTime() : 0;
					const dateB = b.creationTime ? new Date(b.creationTime).getTime() : 0;
					return dateA - dateB;
				});
				for (const node of nodes) {
					if (node.children.length > 0) {
						sortChildren(node.children);
					}
				}
			};

			for (const reply of firstLevelReplies) {
				if (reply.children.length > 0) {
					sortChildren(reply.children);
				}
			}

			return firstLevelReplies;
		};

		const nodes: CommentNode[] = comments.map((comment) => ({
			id: comment.id,
			entityType: comment.entityType,
			entityId: comment.entityId,
			text: comment.text,
			repliedCommentId: undefined,
			creatorId: comment.creatorId,
			creationTime: comment.creationTime,
			author: comment.author,
			children: buildReplyTree(comment.replies ?? []),
		}));

		// Sort root comments by creation time (newest first)
		nodes.sort((a, b) => {
			const dateA = a.creationTime ? new Date(a.creationTime).getTime() : 0;
			const dateB = b.creationTime ? new Date(b.creationTime).getTime() : 0;
			return dateB - dateA;
		});

		return nodes;
	}, [comments]);
}
