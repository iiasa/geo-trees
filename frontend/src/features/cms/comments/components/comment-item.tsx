import {
	IconDots,
	IconMessage,
	IconPencil,
	IconTrash,
} from "@tabler/icons-react";
import { Button } from "@/shared/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { COMMENT_BUTTON_LABELS } from "../constants";
import type { CommentNode } from "../hooks/use-comments-tree";
import {
	InlineCommentForm,
	type InlineCommentFormData,
} from "./inline-comment-form";

interface CommentItemProps {
	comment: CommentNode;
	depth?: number;
	maxDepth?: number;
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
}

export function CommentItem({
	comment,
	depth = 0,
	maxDepth = 3,
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
}: CommentItemProps) {
	const isOwner = currentUserId && comment.author?.id === currentUserId;
	const canEditThis = canEdit || isOwner;
	const canDeleteThis = canDelete || isOwner;
	const isReplying = replyingToId === comment.id;
	const isEditing = editingId === comment.id;

	const formattedDate = comment.creationTime
		? new Date(comment.creationTime).toLocaleDateString("en-US", {
				year: "numeric",
				month: "short",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			})
		: "";

	const canReplyAtThisLevel = canReply && depth === 0;
	const hasActions = canEditThis || canDeleteThis || canReplyAtThisLevel;

	const handleSubmitReply = async (data: InlineCommentFormData) => {
		if (onSubmitReply) {
			await onSubmitReply(comment, data);
		}
	};

	const handleSubmitEdit = async (data: InlineCommentFormData) => {
		if (onSubmitEdit) {
			await onSubmitEdit(comment, data);
		}
	};

	return (
		<div className="space-y-3">
			<div
				className={`flex gap-3 p-4 rounded-lg border bg-card ${
					depth > 0 ? "ml-8" : ""
				}`}
				data-testid="comment-item"
			>
				{/* Avatar placeholder */}
				<div className="flex-shrink-0">
					<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
						<span className="text-sm font-medium text-primary">
							{comment.author?.userName?.charAt(0).toUpperCase() || "U"}
						</span>
					</div>
				</div>

				{/* Comment content */}
				<div className="flex-1 min-w-0">
					<div className="flex items-start justify-between gap-2">
						<div className="flex-1">
							<div className="flex items-center gap-2">
								<span className="font-medium text-sm">
									{comment.author?.userName || "Anonymous"}
								</span>
								<span className="text-xs text-muted-foreground">
									{formattedDate}
								</span>
							</div>
							{isEditing ? (
								<div className="mt-2">
									<InlineCommentForm
										comment={comment}
										onSubmit={handleSubmitEdit}
										onCancel={onCancelEdit}
										isLoading={isSubmitting}
										mode="edit"
										autoFocus
									/>
								</div>
							) : (
								<p className="mt-1 text-sm text-foreground whitespace-pre-wrap break-words">
									{comment.text}
								</p>
							)}
						</div>

						{/* Actions menu */}
						{hasActions && !isEditing && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										className="h-8 w-8 p-0"
										data-testid="btn-comment-actions"
									>
										<IconDots className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									{canReplyAtThisLevel && onReply && (
										<DropdownMenuItem
											onClick={() => onReply(comment)}
											data-testid="btn-reply-comment"
										>
											<IconMessage className="mr-2 h-4 w-4" />
											{COMMENT_BUTTON_LABELS.REPLY}
										</DropdownMenuItem>
									)}
									{canEditThis && onEdit && (
										<>
											{canReplyAtThisLevel && <DropdownMenuSeparator />}
											<DropdownMenuItem
												onClick={() => onEdit(comment)}
												data-testid="btn-edit-comment"
											>
												<IconPencil className="mr-2 h-4 w-4" />
												{COMMENT_BUTTON_LABELS.EDIT}
											</DropdownMenuItem>
										</>
									)}
									{canDeleteThis && onDelete && (
										<>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												onClick={() => onDelete(comment.id || "")}
												className="text-destructive focus:text-destructive"
												data-testid="btn-delete-comment"
											>
												<IconTrash className="mr-2 h-4 w-4" />
												{COMMENT_BUTTON_LABELS.DELETE}
											</DropdownMenuItem>
										</>
									)}
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</div>
				</div>
			</div>

			{/* Inline reply form */}
			{isReplying && (
				<div className={depth > 0 ? "ml-8" : ""}>
					<InlineCommentForm
						onSubmit={handleSubmitReply}
						onCancel={onCancelReply}
						isLoading={isSubmitting}
						mode="reply"
						autoFocus
					/>
				</div>
			)}

			{/* Render nested replies */}
			{comment.children && comment.children.length > 0 && depth < maxDepth && (
				<div className="space-y-3">
					{comment.children.map((child) => (
						<CommentItem
							key={child.id}
							comment={child}
							depth={depth + 1}
							maxDepth={maxDepth}
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
				</div>
			)}
		</div>
	);
}
