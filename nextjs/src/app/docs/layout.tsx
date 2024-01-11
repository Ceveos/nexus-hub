import glob from 'fast-glob'

import { Providers } from '@/app/docs/providers'
import { Layout } from '@/components/docs/Layout'

import { type Metadata } from 'next'
import { type Section } from '@/components/docs/SectionProvider'

export const metadata: Metadata = {
  title: {
    template: '%s - Protocol API Reference',
    default: 'Protocol API Reference',
  },
}

function getDirectoryPath(filePath: string): string {
  const basePath = '/docs';
  const pathComponents = filePath.split('/');

  // Remove the last component (page.mdx)
  pathComponents.pop();

  // Join the components back with the base path
  return basePath + (pathComponents.length > 0 ? '/' + pathComponents.join('/') : '');
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pages = await glob('**/*.mdx', { cwd: 'src/app/docs' })
  const allSectionsEntries = (await Promise.all(
    pages.map(async (filename) => [
      getDirectoryPath(filename),
      (await import(`./${filename}`)).sections,
    ]),
  )) as Array<[string, Array<Section>]>
  const allSections = Object.fromEntries(allSectionsEntries)

  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="flex min-h-full bg-white antialiased dark:bg-zinc-900">
        <Providers>
          <div className="w-full">
            <Layout allSections={allSections}>{children}</Layout>
          </div>
        </Providers>
      </body>
    </html>
  )
}
