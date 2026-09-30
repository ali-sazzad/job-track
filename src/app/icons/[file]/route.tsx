import { brandIcon } from "@/lib/brand-icon";

// Generated at build time (required for the GitHub Pages static export).
// File names keep the .png extension so Pages serves them as image/png.
export const dynamic = "force-static";
export const dynamicParams = false;

const variants = {
  "icon-192.png": [192, 0],
  "icon-512.png": [512, 0],
  "icon-maskable-512.png": [512, 0.12],
} as const;

export function generateStaticParams() {
  return Object.keys(variants).map((file) => ({ file }));
}

export async function GET(_req: Request, ctx: RouteContext<"/icons/[file]">) {
  const { file } = await ctx.params;
  const variant = variants[file as keyof typeof variants];
  if (!variant) return new Response("Not found", { status: 404 });
  return brandIcon(variant[0], variant[1]);
}
