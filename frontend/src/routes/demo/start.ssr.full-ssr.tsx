import { createFileRoute } from "@tanstack/react-router";
import { Music } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { getPunkSongs } from "@/shared/data/demo.punk-songs";

type PunkSong = {
	id: number;
	name: string;
	artist: string;
};

export const Route = createFileRoute("/demo/start/ssr/full-ssr")({
	component: RouteComponent,
	loader: async () => await getPunkSongs(),
});

function RouteComponent() {
	const punkSongs = Route.useLoaderData();

	return (
		<div className="w-full bg-background">
			<div className="w-full px-6 py-8">
				<div className="flex items-center justify-center min-h-screen">
					<div className="w-full max-w-3xl bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
						<div className="flex items-center gap-2 mb-4">
							<Music className="h-5 w-5 text-purple-400" />
							<Badge variant="secondary">Full SSR Demo</Badge>
						</div>
						<h2 className="text-foreground text-3xl font-semibold mb-2">
							Punk Songs Collection
						</h2>
						<p className="text-muted-foreground mb-4">
							This page demonstrates full server-side rendering with data loaded
							on the server
						</p>
						<div className="space-y-3">
							{punkSongs.map((song: PunkSong) => (
								<div
									key={song.id}
									className="flex items-center justify-between bg-muted/50 border border-border rounded-lg p-4 hover:bg-muted/70 transition-colors"
								>
									<div>
										<span className="text-lg text-foreground font-medium">
											{song.name}
										</span>
										<span className="text-muted-foreground ml-2">
											- {song.artist}
										</span>
									</div>
									<Badge variant="outline" className="text-purple-400">
										Punk
									</Badge>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
