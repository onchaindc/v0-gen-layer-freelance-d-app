import toast from "react-hot-toast"

export const showToast = {
  loading: (message: string) => toast.loading(message),
  success: (title: string, description?: string) =>
    toast.success(description ? `${title} — ${description}` : title),
  error: (title: string, description?: string) =>
    toast.error(description ? `${title} — ${description}` : title),
  dismiss: (id?: string) => toast.dismiss(id),
}

export const getTxExplorerUrl = (txHash: string) =>
  `https://explorer.genlayer.com/tx/${txHash}`
