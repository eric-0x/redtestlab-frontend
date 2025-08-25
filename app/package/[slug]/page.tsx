import PackageDetailsClient from './PackageDetailsClient'

export async function generateStaticParams() {
  // required for pages with `output: export` in next.config
  return []
}

export default function Page(props: any) {
  const slug = props?.params?.slug as string | undefined
  return <PackageDetailsClient slug={slug} />
}
