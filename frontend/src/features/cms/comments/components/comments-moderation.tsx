import { IconCheck, IconMessage, IconX } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import {
	commentAdminDeleteMutation,
	commentAdminGetListOptions,
	commentAdminGetListQueryKey,
	commentAdminGetWaitingCountOptions,
	commentAdminUpdateApprovalStatusMutation,
} from "../api-stubs";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select";
import {
	COMMENT_ACTION_MESSAGES,
	COMMENT_BUTTON_LABELS,
	COMMENT_DIALOG_TITLES,
	COMMENT_FILTER_OPTIONS,
} from "../constants";
import { useCommentModerationStore } from "../stores/comment-moderation-store";

export function CommentsModeration() {
	const [_sorting, _setSorting] = useState([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 20,
	});
	const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);

	const { filterStatus, setFilterStatus } = useCommentModerationStore();

	const queryOptions = {
		query: {
			MaxResultCount: pagination.pageSize,
			SkipCount: pagination.pageIndex * pagination.pageSize,
		},
	};
	const queryClient = useQueryClient();

	const {
		data: commentsResponse,
		isLoading,
		error,
		isError,
	} = useQuery(commentAdminGetListOptions(queryOptions));

	const { data: waitingCountData } = useQuery(
		commentAdminGetWaitingCountOptions({}),
	);

	const deleteCommentMutation = useMutation({
		...commentAdminDeleteMutation(),
	});

	const updateApprovalStatusMutation = useMutation({
		...commentAdminUpdateApprovalStatusMutation(),
	});

	const comments = commentsResponse?.items || [];
	const totalCount = commentsResponse?.totalCount || 0;
	const waitingCount =
		typeof waitingCountData === "number" ? waitingCountData : 0;

	// Filter comments by status
	const filteredComments =
		filterStatus === COMMENT_FILTER_OPTIONS.ALL
			? comments
			: comments.filter((_comment) => {
					// Note: ABP CMS Kit might not expose approval status directly in the DTO
					// This is a placeholder - adjust based on actual API response
					return true;
				});

	const handleApprove = async (commentId: string) => {
		try {
			await updateApprovalStatusMutation.mutateAsync({
				path: { id: commentId },
				body: {
					isApproved: true,
				},
			});
			queryClient.invalidateQueries({
				queryKey: commentAdminGetListQueryKey(queryOptions),
			});
			toast.success(COMMENT_ACTION_MESSAGES.APPROVE_SUCCESS);
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error
					? error.message
					: COMMENT_ACTION_MESSAGES.APPROVE_ERROR;
			toast.error(errorMessage);
		}
	};

	const handleReject = async (commentId: string) => {
		try {
			await updateApprovalStatusMutation.mutateAsync({
				path: { id: commentId },
				body: {
					isApproved: false,
				},
			});
			queryClient.invalidateQueries({
				queryKey: commentAdminGetListQueryKey(queryOptions),
			});
			toast.success(COMMENT_ACTION_MESSAGES.REJECT_SUCCESS);
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error
					? error.message
					: COMMENT_ACTION_MESSAGES.REJECT_ERROR;
			toast.error(errorMessage);
		}
	};

	const handleDelete = async (commentId: string) => {
		try {
			await deleteCommentMutation.mutateAsync({
				path: { id: commentId },
			});
			queryClient.invalidateQueries({
				queryKey: commentAdminGetListQueryKey(queryOptions),
			});
			toast.success(COMMENT_ACTION_MESSAGES.DELETE_SUCCESS);
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error
					? error.message
					: COMMENT_ACTION_MESSAGES.DELETE_ERROR;
			toast.error(errorMessage);
		}
	};

	const handleConfirmDelete = async () => {
		if (deleteCommentId) {
			await handleDelete(deleteCommentId);
		}
		setDeleteCommentId(null);
	};

	if (isError) {
		return (
			<Alert variant="destructive">
				<AlertDescription>
					Failed to load comments: {error?.message || "Unknown error"}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="space-y-4">
			<div className="mb-6">
				<h1 className="text-3xl font-bold tracking-tight mb-4">Comments</h1>
			</div>

			{/* Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-2">
					<IconMessage className="h-5 w-5" />
					<span className="text-sm text-muted-foreground">
						{totalCount} comments total
					</span>
					{waitingCount > 0 && (
						<Badge variant="destructive">{waitingCount} waiting</Badge>
					)}
				</div>
				<div className="flex gap-2">
					<Select value={filterStatus} onValueChange={setFilterStatus}>
						<SelectTrigger className="w-40">
							<SelectValue placeholder="Filter by status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={COMMENT_FILTER_OPTIONS.ALL}>
								{COMMENT_FILTER_OPTIONS.ALL}
							</SelectItem>
							<SelectItem value={COMMENT_FILTER_OPTIONS.APPROVED}>
								{COMMENT_FILTER_OPTIONS.APPROVED}
							</SelectItem>
							<SelectItem value={COMMENT_FILTER_OPTIONS.PENDING}>
								{COMMENT_FILTER_OPTIONS.PENDING}
							</SelectItem>
							<SelectItem value={COMMENT_FILTER_OPTIONS.REJECTED}>
								{COMMENT_FILTER_OPTIONS.REJECTED}
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Comments list */}
			{isLoading ? (
				<div className="text-center py-8">
					<p className="text-muted-foreground">Loading comments...</p>
				</div>
			) : filteredComments.length === 0 ? (
				<div className="text-center py-8">
					<p className="text-muted-foreground">No comments found.</p>
				</div>
			) : (
				<div className="space-y-4">
					{filteredComments.map((comment) => (
						<div
							key={comment.id}
							className="flex gap-3 p-4 rounded-lg border bg-card"
							data-testid="moderation-comment-item"
						>
							{/* Avatar */}
							<div className="flex-shrink-0">
								<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
									<span className="text-sm font-medium text-primary">
										{comment.author?.userName?.charAt(0).toUpperCase() || "U"}
									</span>
								</div>
							</div>

							{/* Content */}
							<div className="flex-1 min-w-0">
								<div className="flex items-start justify-between gap-2">
									<div className="flex-1">
										<div className="flex items-center gap-2">
											<span className="font-medium text-sm">
												{comment.author?.userName || "Anonymous"}
											</span>
											<span className="text-xs text-muted-foreground">
												{comment.creationTime
													? new Date(comment.creationTime).toLocaleDateString()
													: ""}
											</span>
										</div>
										<p className="mt-1 text-sm text-foreground whitespace-pre-wrap">
											{comment.text}
										</p>
										<div className="mt-2 flex gap-2 text-xs text-muted-foreground">
											<span>Entity: {comment.entityType}</span>
										</div>
									</div>

									{/* Actions */}
									<div className="flex gap-2">
										<Button
											size="sm"
											variant="outline"
											onClick={() => handleApprove(comment.id || "")}
											disabled={updateApprovalStatusMutation.isPending}
											data-testid="btn-approve-comment"
										>
											<IconCheck className="h-4 w-4 mr-1" />
											{COMMENT_BUTTON_LABELS.APPROVE}
										</Button>
										<Button
											size="sm"
											variant="outline"
											onClick={() => handleReject(comment.id || "")}
											disabled={updateApprovalStatusMutation.isPending}
											data-testid="btn-reject-comment"
										>
											<IconX className="h-4 w-4 mr-1" />
											{COMMENT_BUTTON_LABELS.REJECT}
										</Button>
										<Button
											size="sm"
											variant="destructive"
											onClick={() => setDeleteCommentId(comment.id || "")}
											disabled={deleteCommentMutation.isPending}
											data-testid="btn-delete-comment-mod"
										>
											{COMMENT_BUTTON_LABELS.DELETE}
										</Button>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Pagination */}
			{totalCount > pagination.pageSize && (
				<div className="flex justify-between items-center">
					<Button
						variant="outline"
						onClick={() =>
							setPagination((prev) => ({
								...prev,
								pageIndex: Math.max(0, prev.pageIndex - 1),
							}))
						}
						disabled={pagination.pageIndex === 0}
					>
						Previous
					</Button>
					<span className="text-sm text-muted-foreground">
						Page {pagination.pageIndex + 1} of{" "}
						{Math.ceil(totalCount / pagination.pageSize)}
					</span>
					<Button
						variant="outline"
						onClick={() =>
							setPagination((prev) => ({
								...prev,
								pageIndex: prev.pageIndex + 1,
							}))
						}
						disabled={
							(pagination.pageIndex + 1) * pagination.pageSize >= totalCount
						}
					>
						Next
					</Button>
				</div>
			)}

			{/* Delete confirmation dialog */}
			<AlertDialog
				open={!!deleteCommentId}
				onOpenChange={() => setDeleteCommentId(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{COMMENT_DIALOG_TITLES.DELETE}</AlertDialogTitle>
						<AlertDialogDescription>
							{COMMENT_DIALOG_TITLES.DELETE_CONFIRMATION}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleConfirmDelete}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
