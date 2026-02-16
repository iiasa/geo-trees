import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DEMO_CONSTANTS } from "@/infrastructure/constants";

import { abpApplicationConfigurationGetOptions } from "@/infrastructure/api/@tanstack/react-query.gen";
import type { LanguageInfo } from "@/infrastructure/api/types.gen";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";

export const Route = createFileRoute("/demo/client")({
	component: ClientDemo,
});

function ClientDemo() {
	const {
		data: appConfigResponse,
		isLoading: appConfigLoading,
		error: appConfigError,
		isError: appConfigIsError,
	} = useQuery(abpApplicationConfigurationGetOptions());

	return (
		<div className="container mx-auto py-8">
			<div className="space-y-4">
				<Card>
					<CardHeader>
						<CardTitle>{DEMO_CONSTANTS.CLIENT.APP_CONFIG.TITLE}</CardTitle>
						<CardDescription>
							{DEMO_CONSTANTS.CLIENT.APP_CONFIG.DESCRIPTION}
						</CardDescription>
					</CardHeader>
					<CardContent>
						{appConfigLoading && (
							<div className="flex items-center justify-center space-x-2 py-8">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
								<span>{DEMO_CONSTANTS.CLIENT.APP_CONFIG.LOADING}</span>
							</div>
						)}

						{appConfigIsError && (
							<div className="text-destructive py-4">
								{appConfigError?.error?.message ||
									DEMO_CONSTANTS.CLIENT.APP_CONFIG.ERROR}
							</div>
						)}

						{appConfigResponse && (
							<div className="space-y-6">
								{appConfigResponse.currentUser && (
									<div>
										<h3 className="font-semibold mb-2">
											{DEMO_CONSTANTS.CLIENT.APP_CONFIG.SECTIONS.CURRENT_USER}
										</h3>
										<div className="rounded-md border p-4 bg-muted/50">
											<div className="space-y-1 text-sm">
												<p>
													<strong>Authenticated:</strong>{" "}
													{appConfigResponse.currentUser.isAuthenticated
														? "Yes"
														: "No"}
												</p>
												{appConfigResponse.currentUser.userName && (
													<p>
														<strong>Username:</strong>{" "}
														{appConfigResponse.currentUser.userName}
													</p>
												)}
												{appConfigResponse.currentUser.name && (
													<p>
														<strong>Name:</strong>{" "}
														{appConfigResponse.currentUser.name}
													</p>
												)}
												{appConfigResponse.currentUser.email && (
													<p>
														<strong>Email:</strong>{" "}
														{appConfigResponse.currentUser.email}
													</p>
												)}
												{appConfigResponse.currentUser.id && (
													<p>
														<strong>ID:</strong>{" "}
														{appConfigResponse.currentUser.id}
													</p>
												)}
											</div>
										</div>
									</div>
								)}

								{appConfigResponse.multiTenancy && (
									<div>
										<h3 className="font-semibold mb-2">
											{DEMO_CONSTANTS.CLIENT.APP_CONFIG.SECTIONS.MULTI_TENANCY}
										</h3>
										<div className="rounded-md border p-4 bg-muted/50">
											<div className="space-y-1 text-sm">
												<p>
													<strong>Enabled:</strong>{" "}
													{appConfigResponse.multiTenancy.isEnabled
														? "Yes"
														: "No"}
												</p>
											</div>
										</div>
									</div>
								)}

								{appConfigResponse.currentTenant && (
									<div>
										<h3 className="font-semibold mb-2">
											{DEMO_CONSTANTS.CLIENT.APP_CONFIG.SECTIONS.CURRENT_TENANT}
										</h3>
										<div className="rounded-md border p-4 bg-muted/50">
											<div className="space-y-1 text-sm">
												{appConfigResponse.currentTenant.id && (
													<p>
														<strong>ID:</strong>{" "}
														{appConfigResponse.currentTenant.id}
													</p>
												)}
												{appConfigResponse.currentTenant.name && (
													<p>
														<strong>Name:</strong>{" "}
														{appConfigResponse.currentTenant.name}
													</p>
												)}
												<p>
													<strong>Available:</strong>{" "}
													{appConfigResponse.currentTenant.isAvailable
														? "Yes"
														: "No"}
												</p>
											</div>
										</div>
									</div>
								)}

								{appConfigResponse.auth && (
									<div>
										<h3 className="font-semibold mb-2">
											{DEMO_CONSTANTS.CLIENT.APP_CONFIG.SECTIONS.AUTH}
										</h3>
										<div className="rounded-md border p-4 bg-muted/50">
											{appConfigResponse.auth.grantedPolicies && (
												<div className="space-y-1 text-sm">
													<p className="mb-2">
														<strong>Granted Policies:</strong>
													</p>
													<div className="max-h-48 overflow-y-auto">
														{Object.entries(
															appConfigResponse.auth.grantedPolicies,
														).map(([policy, granted]) => (
															<div
																key={policy}
																className="flex items-center gap-2 py-1"
															>
																<span
																	className={
																		granted
																			? "text-primary"
																			: "text-destructive"
																	}
																>
																	{granted ? "✓" : "✗"}
																</span>
																<span className="font-mono text-xs">
																	{policy}
																</span>
															</div>
														))}
													</div>
												</div>
											)}
										</div>
									</div>
								)}

								{appConfigResponse.features && (
									<div>
										<h3 className="font-semibold mb-2">
											{DEMO_CONSTANTS.CLIENT.APP_CONFIG.SECTIONS.FEATURES}
										</h3>
										<div className="rounded-md border p-4 bg-muted/50">
											{appConfigResponse.features.values && (
												<div className="space-y-1 text-sm">
													{Object.entries(
														appConfigResponse.features.values,
													).map(([key, value]) => (
														<p key={key}>
															<strong>{key}:</strong> {String(value ?? "N/A")}
														</p>
													))}
												</div>
											)}
										</div>
									</div>
								)}

								{appConfigResponse.globalFeatures && (
									<div>
										<h3 className="font-semibold mb-2">
											{
												DEMO_CONSTANTS.CLIENT.APP_CONFIG.SECTIONS
													.GLOBAL_FEATURES
											}
										</h3>
										<div className="rounded-md border p-4 bg-muted/50">
											{appConfigResponse.globalFeatures.enabledFeatures && (
												<div className="space-y-1 text-sm">
													<p className="mb-2">
														<strong>Enabled Features:</strong>
													</p>
													<div className="flex flex-wrap gap-2">
														{appConfigResponse.globalFeatures.enabledFeatures.map(
															(feature: string) => (
																<span
																	key={feature}
																	className="px-2 py-1 bg-primary/10 text-primary rounded text-xs"
																>
																	{feature}
																</span>
															),
														)}
													</div>
												</div>
											)}
										</div>
									</div>
								)}

								{appConfigResponse.timing && (
									<div>
										<h3 className="font-semibold mb-2">
											{DEMO_CONSTANTS.CLIENT.APP_CONFIG.SECTIONS.TIMING}
										</h3>
										<div className="rounded-md border p-4 bg-muted/50">
											<div className="space-y-1 text-sm">
												{appConfigResponse.timing.timeZone && (
													<>
														{appConfigResponse.timing.timeZone.iana
															?.timeZoneName && (
															<p>
																<strong>IANA Time Zone:</strong>{" "}
																{
																	appConfigResponse.timing.timeZone.iana
																		.timeZoneName
																}
															</p>
														)}
														{appConfigResponse.timing.timeZone.windows
															?.timeZoneId && (
															<p>
																<strong>Windows Time Zone ID:</strong>{" "}
																{
																	appConfigResponse.timing.timeZone.windows
																		.timeZoneId
																}
															</p>
														)}
													</>
												)}
											</div>
										</div>
									</div>
								)}

								{appConfigResponse.clock && (
									<div>
										<h3 className="font-semibold mb-2">
											{DEMO_CONSTANTS.CLIENT.APP_CONFIG.SECTIONS.CLOCK}
										</h3>
										<div className="rounded-md border p-4 bg-muted/50">
											<div className="space-y-1 text-sm">
												{appConfigResponse.clock.kind && (
													<p>
														<strong>Kind:</strong>{" "}
														{appConfigResponse.clock.kind}
													</p>
												)}
											</div>
										</div>
									</div>
								)}

								{appConfigResponse.setting && (
									<div>
										<h3 className="font-semibold mb-2">
											{DEMO_CONSTANTS.CLIENT.APP_CONFIG.SECTIONS.SETTINGS}
										</h3>
										<div className="rounded-md border p-4 bg-muted/50">
											{appConfigResponse.setting.values && (
												<div className="space-y-1 text-sm max-h-48 overflow-y-auto">
													{Object.entries(appConfigResponse.setting.values).map(
														([key, value]) => (
															<p key={key}>
																<strong>{key}:</strong> {String(value ?? "N/A")}
															</p>
														),
													)}
												</div>
											)}
										</div>
									</div>
								)}

								{appConfigResponse.localization && (
									<div>
										<h3 className="font-semibold mb-2">
											{DEMO_CONSTANTS.CLIENT.APP_CONFIG.SECTIONS.LOCALIZATION}
										</h3>
										<div className="rounded-md border p-4 bg-muted/50">
											<div className="space-y-2 text-sm">
												{appConfigResponse.localization.currentCulture && (
													<div>
														<p>
															<strong>Current Culture:</strong>{" "}
															{appConfigResponse.localization.currentCulture
																.displayName || "N/A"}
															{appConfigResponse.localization.currentCulture
																.twoLetterIsoLanguageName && (
																<>
																	{" "}
																	(
																	{
																		appConfigResponse.localization
																			.currentCulture.twoLetterIsoLanguageName
																	}
																	)
																</>
															)}
														</p>
													</div>
												)}
												{appConfigResponse.localization.defaultResourceName && (
													<p>
														<strong>Default Resource:</strong>{" "}
														{appConfigResponse.localization.defaultResourceName}
													</p>
												)}
												{appConfigResponse.localization.languages && (
													<div>
														<p className="mb-2">
															<strong>Available Languages:</strong>
														</p>
														<div className="flex flex-wrap gap-2">
															{appConfigResponse.localization.languages.map(
																(lang: LanguageInfo) => (
																	<span
																		key={lang.cultureName}
																		className="px-2 py-1 bg-secondary rounded text-xs"
																	>
																		{lang.displayName} ({lang.cultureName})
																	</span>
																),
															)}
														</div>
													</div>
												)}
											</div>
										</div>
									</div>
								)}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
