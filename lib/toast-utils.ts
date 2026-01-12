import { toast } from "sonner"

export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, { description })
  },
  error: (message: string, description?: string) => {
    toast.error(message, { description })
  },
  loading: (message: string) => {
    return toast.loading(message)
  },
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: Error) => string)
    },
  ) => {
    return toast.promise(promise, messages)
  },
}

export const getTxExplorerUrl = (txHash: string, chainId = 61999) => {
  const baseUrl = "https://explorer-asimov.genlayer.com"
  return `${baseUrl}/tx/${txHash}`
}
