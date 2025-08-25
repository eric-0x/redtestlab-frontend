export function useToast() {
  return {
    toasts: [] as Array<{
      id: string
      title?: string
      description?: string
      action?: any
      [k: string]: any
    }>,
    add: (t: any) => {},
    remove: (id: string) => {},
    toast: (opts: any) => console.log('toast', opts),
  }
}
