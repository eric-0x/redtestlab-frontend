// Minimal server-only wrapper used for build isolation tests.
export async function generateStaticParams() {
  // required for pages with `output: export` in next.config
  // provide at least one example slug so static export has something to generate
  return [{ slug: 'example-package' }]
}

export default function Page(props: any) {
  const slug = props?.params?.slug as string | undefined
  return (
    <html>
      <body>
        <div>Package page placeholder for slug: {slug}</div>
      </body>
    </html>
  )
}
