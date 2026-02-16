import { create } from "zustand";
import type { VoloCmsKitPublicCommentsCommentDto } from "@/infrastructure/api/types.gen";
import {
	type BaseFormStore,
	createFormStoreActions,
	createInitialFormState,
} from "@/shared/stores/base-store";

interface CommentFormActions {
	setLoading: (loading: boolean) => void;
	openCreateForm: (entityType: string, entityId: string) => void;
	openReplyForm: (
		comment: VoloCmsKitPublicCommentsCommentDto,
		entityType: string,
		entityId: string,
	) => void;
	openEditForm: (comment: VoloCmsKitPublicCommentsCommentDto) => void;
	closeForm: () => void;
}

type CommentFormStore = BaseFormStore<VoloCmsKitPublicCommentsCommentDto> & {
	comment: VoloCmsKitPublicCommentsCommentDto | null;
	parentCommentId: string | null;
	entityType: string | null;
	entityId: string | null;
	open: boolean;
	mode: "create" | "edit" | "reply";
} & CommentFormActions;

const initialState = {
	...createInitialFormState<VoloCmsKitPublicCommentsCommentDto>(),
	comment: null,
	parentCommentId: null,
	entityType: null,
	entityId: null,
	open: false,
	mode: "create" as const,
};

export const useCommentFormStore = create<CommentFormStore>((set, _get) => ({
	// Initial state
	...initialState,

	// Base form actions
	...createFormStoreActions<VoloCmsKitPublicCommentsCommentDto>(),

	// Comment-specific actions
	setLoading: (loading: boolean) => set({ isLoading: loading }),
	openCreateForm: (entityType: string, entityId: string) =>
		set({
			comment: null,
			parentCommentId: null,
			entityType,
			entityId,
			open: true,
			mode: "create",
		}),
	openReplyForm: (
		comment: VoloCmsKitPublicCommentsCommentDto,
		entityType: string,
		entityId: string,
	) =>
		set({
			comment: null,
			parentCommentId: comment.id || null,
			entityType,
			entityId,
			open: true,
			mode: "reply",
		}),
	openEditForm: (comment: VoloCmsKitPublicCommentsCommentDto) =>
		set({
			comment,
			parentCommentId: null,
			entityType: comment.entityType || null,
			entityId: comment.entityId || null,
			open: true,
			mode: "edit",
		}),
	closeForm: () =>
		set({
			comment: null,
			parentCommentId: null,
			entityType: null,
			entityId: null,
			open: false,
			mode: "create",
		}),
}));
