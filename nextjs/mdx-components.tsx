import * as mdxComponents from '@nextjs/components/docs/mdx'
import { type MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents) {
  return {
    ...components,
    ...mdxComponents,
  }
}
