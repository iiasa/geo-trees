import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, Loader2 } from "lucide-react";
import { useAuthCombined as useAuth } from "@/features/auth/hooks/use-auth";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select";
import {
	getApiAppPlotAvailableCountriesOptions,
	getApiAppPlotAvailableVersionsOptions,
} from "@/infrastructure/api/@tanstack/react-query.gen";

const ACKNOWLEDGMENT_TEXT =
	"This study was made possible by use of data of GEO-TREES, accessed through the data.geo-trees.org portal. We acknowledge the work of the many field workers and technicians involved in the acquisition, curation, and maintenance of the data";

export function DownloadPanel() {
	const { user, isAuthenticated, login } = useAuth();

	const [name, setName] = useState(user?.name ?? "");
	const [email, setEmail] = useState(user?.email ?? "");
	const [country, setCountry] = useState("");
	const [version, setVersion] = useState("");
	const [format, setFormat] = useState("");
	const [purpose, setPurpose] = useState("");
	const [acknowledged, setAcknowledged] = useState(false);
	const [isDownloading, setIsDownloading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { data: countries } = useQuery({
		...getApiAppPlotAvailableCountriesOptions(),
		enabled: isAuthenticated,
	});

	const { data: versions } = useQuery({
		...getApiAppPlotAvailableVersionsOptions(),
		enabled: isAuthenticated,
	});

	const isValid =
		name.trim() &&
		email.trim() &&
		country &&
		version &&
		format &&
		purpose.trim().length >= 10 &&
		acknowledged;

	const handleDownload = async () => {
		if (!isValid) return;
		setIsDownloading(true);
		setError(null);

		const params = new URLSearchParams({
			format,
			purpose,
			email,
			name,
			country,
			version,
		});

		try {
			const response = await fetch(
				`/api/proxy/api/app/plot/download?${params.toString()}`,
			);

			if (!response.ok) {
				throw new Error("Download failed");
			}

			const contentDisposition = response.headers.get("Content-Disposition");
			let filename = "geotree-download";
			if (contentDisposition) {
				const match = contentDisposition.match(
					/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
				);
				if (match?.[1]) {
					filename = match[1].replace(/['"]/g, "");
				}
			}
			if (!filename.includes(".")) {
				filename = `${filename}.zip`;
			}

			const blob = await response.blob();
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Download failed");
		} finally {
			setIsDownloading(false);
		}
	};

	if (!isAuthenticated) {
		return (
			<div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 border border-gray-200 shadow-lg w-72">
				<h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
					<Download className="size-4" />
					Download Data
				</h3>
				<p className="text-sm text-gray-600 mb-4">
					Please log in to access the download functionality.
				</p>
				<Button className="w-full" size="sm" onClick={login}>
					Login
				</Button>
			</div>
		);
	}

	return (
		<div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 border border-gray-200 shadow-lg w-72">
			<h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
				<Download className="size-4" />
				Download Data
			</h3>
			<div className="space-y-3">
				<div>
					<Label className="text-xs">Name</Label>
					<Input
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="h-8 text-xs"
					/>
				</div>
				<div>
					<Label className="text-xs">Email</Label>
					<Input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="h-8 text-xs"
					/>
				</div>
				<div>
					<Label className="text-xs">Country</Label>
					<Select value={country} onValueChange={setCountry}>
						<SelectTrigger className="h-8 text-xs">
							<SelectValue placeholder="Select a country" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Countries</SelectItem>
							{countries?.map((c) => (
								<SelectItem key={c} value={c}>
									{c}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div>
					<Label className="text-xs">Version</Label>
					<Select value={version} onValueChange={setVersion}>
						<SelectTrigger className="h-8 text-xs">
							<SelectValue placeholder="Select a version" />
						</SelectTrigger>
						<SelectContent>
							{versions?.map((v) => (
								<SelectItem key={v} value={String(v)}>
									{v}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div>
					<Label className="text-xs">Format</Label>
					<Select value={format} onValueChange={setFormat}>
						<SelectTrigger className="h-8 text-xs">
							<SelectValue placeholder="Select a format" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="csv">CSV (ZIP)</SelectItem>
							<SelectItem value="geojson">GeoJSON (ZIP)</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div>
					<Label className="text-xs">Purpose of Download</Label>
					<textarea
						className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-xs focus-visible:border-primary focus-visible:ring-primary/50 focus-visible:ring-[3px] outline-none resize-none"
						rows={3}
						value={purpose}
						onChange={(e) => setPurpose(e.target.value)}
					/>
					{purpose.length > 0 && purpose.length < 10 && (
						<p className="text-xs text-red-500 mt-0.5">
							Must be at least 10 characters
						</p>
					)}
				</div>
				<div className="flex items-start gap-2">
					<Checkbox
						id="acknowledgment"
						checked={acknowledged}
						onCheckedChange={(v) => setAcknowledged(v === true)}
						className="mt-0.5"
					/>
					<label
						htmlFor="acknowledgment"
						className="text-xs text-gray-600 leading-relaxed cursor-pointer"
					>
						{ACKNOWLEDGMENT_TEXT}
					</label>
				</div>
				{error && <p className="text-xs text-red-500">{error}</p>}
				<Button
					className="w-full"
					size="sm"
					disabled={!isValid || isDownloading}
					onClick={handleDownload}
				>
					{isDownloading ? (
						<>
							<Loader2 className="size-4 animate-spin mr-1" />
							Downloading...
						</>
					) : (
						"Download"
					)}
				</Button>
			</div>
		</div>
	);
}
