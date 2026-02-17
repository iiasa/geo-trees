import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAuthState } from "@/features/auth/hooks/use-auth";
import {
	commentPublicCreateMutation,
	commentPublicDeleteMutation,
	commentPublicGetListOptions,
	commentPublicGetListQueryKey,
	commentPublicUpdateMutation,
} from "../api-stubs";
import { COMMENT_ACTION_MESSAGES, COMMENT_QUERY_KEYS } from "../constants";
import type { CommentNode } from "../hooks/use-comments-tree";
import {
	type InlineCommentFormData,
	InlineCommentForm,
} from "./inline-comment-form";
import { CommentsList } from "./comments-list";
import { toast } from "sonner";

interface PageCommentsProps {
	entityType: string;
	entityId: string;
}

export function PageComments({ entityType, entityId }: PageCommentsProps) {
	const queryClient = useQueryClient();
	const { user, isAuthenticated } = useAuthState();
	const [replyingToId, setReplyingToId] = useState<string | null>(null);
	const [editingId, setEditingId] = useState<string | null>(null);

	const { data: commentsResponse, isLoading } = useQuery({
		...commentPublicGetListOptions({
			path: { entityType, entityId },
		}),
		enabled: isAuthenticated,
	});

	const invalidateComments = () => {
		queryClient.invalidateQueries({
			queryKey: COMMENT_QUERY_KEYS.ENTITY_COMMENTS(entityType, entityId),
		});
		queryClient.invalidateQueries({
			queryKey: commentPublicGetListQueryKey({
				path: { entityType, entityId },
			}),
		});
	};

	const createMutation = useMutation({
		...commentPublicCreateMutation(),
		onSuccess: () => {
			toast.success(COMMENT_ACTION_MESSAGES.CREATE_SUCCESS);
			invalidateComments();
			setReplyingToId(null);
		},
		onError: () => {
			toast.error(COMMENT_ACTION_MESSAGES.CREATE_ERROR);
		},
	});

	const updateMutation = useMutation({
		...commentPublicUpdateMutation(),
		onSuccess: () => {
			toast.success(COMMENT_ACTION_MESSAGES.UPDATE_SUCCESS);
			invalidateComments();
			setEditingId(null);
		},
		onError: () => {
			toast.error(COMMENT_ACTION_MESSAGES.UPDATE_ERROR);
		},
	});

	const deleteMutation = useMutation({
		...commentPublicDeleteMutation(),
		onSuccess: () => {
			toast.success(COMMENT_ACTION_MESSAGES.DELETE_SUCCESS);
			invalidateComments();
		},
		onError: () => {
			toast.error(COMMENT_ACTION_MESSAGES.DELETE_ERROR);
		},
	});

	const comments = commentsResponse?.items ?? [];

	if (!isAuthenticated) {
		return null;
	}

	const handleCreateSubmit = async (data: InlineCommentFormData) => {
		await createMutation.mutateAsync({
			path: { entityType, entityId },
			body: {
				text: data.text,
				idempotencyToken: crypto.randomUUID(),
			},
		});
	};

	const handleReplySubmit = async (
		parentComment: CommentNode,
		data: InlineCommentFormData,
	) => {
		await createMutation.mutateAsync({
			path: { entityType, entityId },
			body: {
				text: data.text,
				repliedCommentId: parentComment.id,
				idempotencyToken: crypto.randomUUID(),
			},
		});
	};

	const handleEditSubmit = async (
		comment: CommentNode,
		data: InlineCommentFormData,
	) => {
		if (!comment.id) {
			toast.error("Comment ID is missing");
			return;
		}
		await updateMutation.mutateAsync({
			path: { id: comment.id },
			body: { text: data.text },
		});
	};

	const handleReply = (commentNode: CommentNode) => {
		setEditingId(null);
		setReplyingToId(commentNode.id ?? null);
	};

	const handleEdit = (commentNode: CommentNode) => {
		setReplyingToId(null);
		setEditingId(commentNode.id ?? null);
	};

	const handleDelete = (commentId: string) => {
		deleteMutation.mutate({
			path: { id: commentId },
		});
	};

	const handleCancelReply = () => {
		setReplyingToId(null);
	};

	const handleCancelEdit = () => {
		setEditingId(null);
	};

	return (
		<div className="space-y-4">
			<h2 className="text-xl font-semibold">Comments</h2>

			<InlineCommentForm
				onSubmit={handleCreateSubmit}
				isLoading={createMutation.isPending && !replyingToId}
				mode="create"
			/>

			<CommentsList
				comments={comments}
				entityType={entityType}
				entityId={entityId}
				onReply={handleReply}
				onEdit={handleEdit}
				onDelete={handleDelete}
				onSubmitReply={handleReplySubmit}
				onSubmitEdit={handleEditSubmit}
				canEdit={false}
				canDelete={false}
				canReply={true}
				currentUserId={user?.sub}
				replyingToId={replyingToId}
				editingId={editingId}
				onCancelReply={handleCancelReply}
				onCancelEdit={handleCancelEdit}
				isSubmitting={createMutation.isPending || updateMutation.isPending}
				isLoading={isLoading}
			/>
		</div>
	);
}
