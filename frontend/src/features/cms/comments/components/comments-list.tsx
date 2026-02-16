import type { CommentWithDetailsDto } from "@/infrastructure/api/types.gen";
import { Button } from "@/shared/components/ui/button";
import { COMMENT_BUTTON_LABELS } from "../constants";
import { type CommentNode, useCommentsTree } from "../hooks/use-comments-tree";
import { CommentItem } from "./comment-item";
import type { InlineCommentFormData } from "./inline-comment-form";

interface CommentsListProps {
	comments: CommentWithDetailsDto[];
	entityType: string;
	entityId: string;
	onReply?: (comment: CommentNode) => void;
	onEdit?: (comment: CommentNode) => void;
	onDelete?: (commentId: string) => void;
	onSubmitReply?: (
		parentComment: CommentNode,
		data: InlineCommentFormData,
	) => Promise<void>;
	onSubmitEdit?: (
		comment: CommentNode,
		data: InlineCommentFormData,
	) => Promise<void>;
	canEdit?: boolean;
	canDelete?: boolean;
	canReply?: boolean;
	currentUserId?: string;
	replyingToId?: string | null;
	editingId?: string | null;
	onCancelReply?: () => void;
	onCancelEdit?: () => void;
	isSubmitting?: boolean;
	isLoading?: boolean;
	hasMore?: boolean;
	onLoadMore?: () => void;
}

export function CommentsList({
	comments,
	entityType: _entityType,
	entityId: _entityId,
	onReply,
	onEdit,
	onDelete,
	onSubmitReply,
	onSubmitEdit,
	canEdit = false,
	canDelete = false,
	canReply = true,
	currentUserId,
	replyingToId,
	editingId,
	onCancelReply,
	onCancelEdit,
	isSubmitting = false,
	isLoading = false,
	hasMore = false,
	onLoadMore,
}: CommentsListProps) {
	const commentTree = useCommentsTree(comments);

	if (isLoading && comments.length === 0) {
		return (
			<div className="text-center py-8">
				<p className="text-muted-foreground">Loading comments...</p>
			</div>
		);
	}

	if (!isLoading && commentTree.length === 0) {
		return (
			<div className="text-center py-8">
				<p className="text-muted-foreground">
					No comments yet. Be the first to comment!
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{commentTree.map((comment) => (
				<CommentItem
					key={comment.id}
					comment={comment}
					onReply={onReply}
					onEdit={onEdit}
					onDelete={onDelete}
					onSubmitReply={onSubmitReply}
					onSubmitEdit={onSubmitEdit}
					canEdit={canEdit}
					canDelete={canDelete}
					canReply={canReply}
					currentUserId={currentUserId}
					replyingToId={replyingToId}
					editingId={editingId}
					onCancelReply={onCancelReply}
					onCancelEdit={onCancelEdit}
					isSubmitting={isSubmitting}
				/>
			))}

			{hasMore && onLoadMore && (
				<div className="flex justify-center pt-4">
					<Button
						variant="outline"
						onClick={onLoadMore}
						disabled={isLoading}
						data-testid="btn-load-more-comments"
					>
						{isLoading ? "Loading..." : COMMENT_BUTTON_LABELS.LOAD_MORE}
					</Button>
				</div>
			)}
		</div>
	);
}
