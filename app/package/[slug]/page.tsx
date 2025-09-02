import PackageDetailsClient from "./PackageDetailsClient"

// Minimal server-only wrapper used for build isolation tests.
export async function generateStaticParams() {
  // required for pages with `output: export` in next.config
  // provide at least one example slug so static export has something to generate
  return [{ slug: 'example-package' }]
}

export default async function Page(props: any) {
  const params = await props?.params
  const slug = params?.slug as string | undefined
  return <PackageDetailsClient slug={slug} />
}
