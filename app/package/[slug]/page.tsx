import PackageDetailsClient from './PackageDetailsClient'

export async function generateStaticParams() {
  // required for pages with `output: export` in next.config
  return []
}

export default function Page({ params }: { params: { slug: string } }) {
  return <PackageDetailsClient slug={params.slug} />
}
