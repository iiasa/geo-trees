/**
 * Local type definitions for CMS Kit comments.
 *
 * These types were previously generated from the backend OpenAPI spec
 * (`@/infrastructure/api/types.gen`), but the comment endpoints have been
 * removed from the spec. The types are kept here so that the existing
 * comment UI components continue to compile. Once the comment APIs are
 * re-introduced to the backend, regenerate the API client and replace
 * these local types with the generated ones.
 */

export interface CmsKitCommentAuthorDto {
	id?: string;
	userName?: string | null;
	name?: string | null;
	surname?: string | null;
}

export interface VoloCmsKitPublicCommentsCommentDto {
	id?: string;
	entityType?: string | null;
	entityId?: string | null;
	text?: string | null;
	repliedCommentId?: string | null;
	creatorId?: string;
	creationTime?: string;
	author?: CmsKitCommentAuthorDto;
}

export interface CommentWithDetailsDto {
	id?: string;
	entityType?: string | null;
	entityId?: string | null;
	text?: string | null;
	repliedCommentId?: string | null;
	creatorId?: string;
	creationTime?: string;
	author?: CmsKitCommentAuthorDto;
	replies?: VoloCmsKitPublicCommentsCommentDto[] | null;
}

export interface CommentSettingsDto {
	commentRequireApprovement?: boolean;
}
