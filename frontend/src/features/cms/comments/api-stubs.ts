/**
 * Stub query options and mutation configs for CMS Kit comment endpoints.
 *
 * The comment endpoints have been removed from the backend OpenAPI spec,
 * so the auto-generated client no longer exports them. These stubs allow
 * the existing comment UI to compile and degrade gracefully (queries will
 * stay disabled / never fire, mutations will reject immediately).
 *
 * Once the backend re-introduces comment endpoints, regenerate the API
 * client and replace these stubs with the real generated exports.
 */

import { queryOptions, type UseMutationOptions } from "@tanstack/react-query";
import type { CommentWithDetailsDto } from "./types";

// ---------------------------------------------------------------------------
// Admin – query options
// ---------------------------------------------------------------------------

export const commentAdminGetListQueryKey = (options: unknown) => [
	"commentAdminGetList",
	options,
];

export const commentAdminGetListOptions = (_options: {
	query?: Record<string, unknown>;
}) =>
	queryOptions({
		queryKey: commentAdminGetListQueryKey(_options),
		queryFn: () =>
			Promise.resolve({
				items: [] as CommentWithDetailsDto[],
				totalCount: 0,
			}),
		enabled: false,
	});

export const commentAdminGetWaitingCountOptions = (_options: object) =>
	queryOptions({
		queryKey: ["commentAdminGetWaitingCount", _options],
		queryFn: () => Promise.resolve(0),
		enabled: false,
	});

// ---------------------------------------------------------------------------
// Admin – mutations
// ---------------------------------------------------------------------------

export const commentAdminDeleteMutation = (): UseMutationOptions<
	unknown,
	Error,
	{ path: { id: string } }
> => ({
	mutationFn: () =>
		Promise.reject(new Error("Comment admin delete endpoint is not available")),
});

export const commentAdminUpdateApprovalStatusMutation = (): UseMutationOptions<
	unknown,
	Error,
	{ path: { id: string }; body: { isApproved: boolean } }
> => ({
	mutationFn: () =>
		Promise.reject(
			new Error(
				"Comment admin update-approval-status endpoint is not available",
			),
		),
});

// ---------------------------------------------------------------------------
// Public – query options
// ---------------------------------------------------------------------------

export const commentPublicGetListQueryKey = (options: unknown) => [
	"commentPublicGetList",
	options,
];

export const commentPublicGetListOptions = (_options: {
	path: { entityType: string; entityId: string };
}) =>
	queryOptions({
		queryKey: commentPublicGetListQueryKey(_options),
		queryFn: () =>
			Promise.resolve({
				items: [] as CommentWithDetailsDto[],
				totalCount: 0,
			}),
		enabled: false,
	});

// ---------------------------------------------------------------------------
// Public – mutations
// ---------------------------------------------------------------------------

export const commentPublicCreateMutation = (): UseMutationOptions<
	unknown,
	Error,
	{
		path: { entityType: string; entityId: string };
		body: {
			text: string;
			repliedCommentId?: string;
			idempotencyToken?: string;
		};
	}
> => ({
	mutationFn: () =>
		Promise.reject(
			new Error("Comment public create endpoint is not available"),
		),
});

export const commentPublicUpdateMutation = (): UseMutationOptions<
	unknown,
	Error,
	{ path: { id: string }; body: { text: string } }
> => ({
	mutationFn: () =>
		Promise.reject(
			new Error("Comment public update endpoint is not available"),
		),
});

export const commentPublicDeleteMutation = (): UseMutationOptions<
	unknown,
	Error,
	{ path: { id: string } }
> => ({
	mutationFn: () =>
		Promise.reject(
			new Error("Comment public delete endpoint is not available"),
		),
});

// ---------------------------------------------------------------------------
// Admin – settings (SDK-style function)
// ---------------------------------------------------------------------------

export const commentAdminUpdateSettings = async (_options: {
	body: { commentRequireApprovement?: boolean };
	throwOnError?: boolean;
}) => {
	throw new Error("Comment admin update-settings endpoint is not available");
};
