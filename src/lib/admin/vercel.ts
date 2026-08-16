export type VercelDeployment = {
  uid: string;
  url: string;
  state: string;
  created: number;
  target?: string | null;
};

export async function fetchVercelDeployments(limit = 8): Promise<{
  ok: boolean;
  error?: string;
  deployments: VercelDeployment[];
  projectId?: string;
  dashboardUrl: string;
}> {
  const token = process.env.VERCEL_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID;
  const dashboardUrl = teamId
    ? `https://vercel.com/${teamId}`
    : "https://vercel.com/dashboard";

  if (!token || !projectId) {
    return {
      ok: false,
      error:
        "Set VERCEL_TOKEN and VERCEL_PROJECT_ID for live deployment data.",
      deployments: [],
      dashboardUrl,
    };
  }

  const qs = new URLSearchParams({
    projectId,
    limit: String(limit),
  });
  if (teamId) qs.set("teamId", teamId);

  try {
    const res = await fetch(
      `https://api.vercel.com/v6/deployments?${qs.toString()}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 60 },
      },
    );
    if (!res.ok) {
      const text = await res.text();
      return {
        ok: false,
        error: `Vercel API ${res.status}: ${text.slice(0, 200)}`,
        deployments: [],
        projectId,
        dashboardUrl,
      };
    }
    const json = (await res.json()) as {
      deployments?: Array<{
        uid: string;
        url: string;
        state: string;
        created: number;
        target?: string | null;
      }>;
    };
    return {
      ok: true,
      deployments: (json.deployments ?? []).map((d) => ({
        uid: d.uid,
        url: d.url,
        state: d.state,
        created: d.created,
        target: d.target,
      })),
      projectId,
      dashboardUrl,
    };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Vercel fetch failed",
      deployments: [],
      projectId,
      dashboardUrl,
    };
  }
}
