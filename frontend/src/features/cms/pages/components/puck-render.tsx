import { Render } from "@measured/puck";
import type { Data } from "@measured/puck";
import { puckConfig, defaultPuckData } from "../config/puck-config";
import { PUCK_EDITOR_CONSTANTS } from "../constants";

interface PuckRenderProps {
	content: string | null | undefined;
}

export function PuckRender({ content }: PuckRenderProps) {
	if (!content) {
		return (
			<div className="text-muted-foreground text-center py-8">
				<p>{PUCK_EDITOR_CONSTANTS.NO_CONTENT}</p>
			</div>
		);
	}

	let puckData: Data;

	try {
		const parsed = JSON.parse(content);
		if (parsed && typeof parsed === "object" && "content" in parsed) {
			puckData = parsed as Data;
		} else {
			puckData = defaultPuckData;
		}
	} catch {
		return (
			<div className="text-muted-foreground text-center py-8">
				<p>{PUCK_EDITOR_CONSTANTS.INVALID_CONTENT}</p>
			</div>
		);
	}

	return (
		<div className="puck-render" data-testid="puck-render">
			<Render config={puckConfig} data={puckData} />
		</div>
	);
}
