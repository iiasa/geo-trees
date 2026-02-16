import { create } from "zustand";
import type { VoloCmsKitPublicCommentsCommentDto } from "@/infrastructure/api/types.gen";

interface CommentModerationState {
	selectedComment: VoloCmsKitPublicCommentsCommentDto | null;
	waitingCount: number;
	filterStatus: string;
}

interface CommentModerationActions {
	selectComment: (comment: VoloCmsKitPublicCommentsCommentDto) => void;
	clearSelection: () => void;
	setWaitingCount: (count: number) => void;
	setFilterStatus: (status: string) => void;
}

type CommentModerationStore = CommentModerationState & CommentModerationActions;

const initialState: CommentModerationState = {
	selectedComment: null,
	waitingCount: 0,
	filterStatus: "All",
};

export const useCommentModerationStore = create<CommentModerationStore>(
	(set) => ({
		// Initial state
		...initialState,

		// Actions
		selectComment: (comment: VoloCmsKitPublicCommentsCommentDto) =>
			set({ selectedComment: comment }),
		clearSelection: () => set({ selectedComment: null }),
		setWaitingCount: (count: number) => set({ waitingCount: count }),
		setFilterStatus: (status: string) => set({ filterStatus: status }),
	}),
);
