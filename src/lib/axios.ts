import type {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig} from 'axios'
import axios from 'axios'
import type {IBaseResponse, IErrorResponse} from '@/types/common'

// Environment variables for Next.js
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api/v1'
const ENV = process.env.NODE_ENV || 'development'

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token to requests (client-side only)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    // Add cache-busting for GET requests
    if (config.method?.toLowerCase() === 'get') {
      config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
      config.headers['Pragma'] = 'no-cache'
      config.headers['Expires'] = '0'

      // Add timestamp to prevent caching
      if (!config.params) {
        config.params = {}
      }
      config.params._t = Date.now()
    }

    // Log requests in development
    if (ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params,
        headers: config.headers,
      })
    }

    return config
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse<IBaseResponse>) => {
    // Log responses in development
    if (ENV === 'development') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      })
    }

    return response
  },
  (error: AxiosError<IErrorResponse>) => {
    const { response, request } = error

    // Log errors in development
    if (ENV === 'development') {
      console.error('❌ API Error:', {
        status: response?.status,
        message: response?.data?.message || error.message,
        url: request?.responseURL,
        data: response?.data,
      })
    }

    // Handle authentication errors (client-side only)
    if (response && response.status === 401 && typeof window !== 'undefined') {
      // Clear token
      localStorage.removeItem('token')

      // You can add your auth logout logic here
      // For now, just redirect to login
      window.location.href = '/login'
    }

    // Handle server errors
    if (response && response.status >= 500) {
      console.error('Server Error:', response.data)
    }

    return Promise.reject(error)
  }
)

// API wrapper functions
export const apiService = {
  // GET request
  get: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<IBaseResponse<T>> => {
    const response = await api.get<IBaseResponse<T>>(url, config)
    return response.data
  },

  // POST request
  post: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<IBaseResponse<T>> => {
    const response = await api.post<IBaseResponse<T>>(url, data, config)
    return response.data
  },

  // PUT request
  put: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<IBaseResponse<T>> => {
    const response = await api.put<IBaseResponse<T>>(url, data, config)
    return response.data
  },

  // PATCH request
  patch: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<IBaseResponse<T>> => {
    const response = await api.patch<IBaseResponse<T>>(url, data, config)
    return response.data
  },

  // DELETE request
  delete: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<IBaseResponse<T>> => {
    const response = await api.delete<IBaseResponse<T>>(url, config)
    return response.data
  },

  // Upload file (client-side only)
  upload: async <T = any>(url: string, file: File, config?: AxiosRequestConfig): Promise<IBaseResponse<T>> => {
    if (typeof window === 'undefined') {
      throw new Error('Upload is only available on client-side')
    }

    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post<IBaseResponse<T>>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Download file (client-side only)
  download: async (url: string, filename?: string, config?: AxiosRequestConfig): Promise<void> => {
    if (typeof window === 'undefined') {
      throw new Error('Download is only available on client-side')
    }

    const response = await api.get(url, {
      ...config,
      responseType: 'blob',
    })

    const blob = new Blob([response.data])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  },
}

// Export the axios instance for advanced usage
export { api }

// Export types
export type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError }
