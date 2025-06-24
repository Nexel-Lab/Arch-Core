/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import jwtDefaultConfig from './jwtDefaultConfig'

export interface JwtConfig {
  loginEndpoint: string
  registerEndpoint: string
  refreshEndpoint: string
  logoutEndpoint: string
  tokenType: string
  storageTokenKeyName: string
  storageRefreshTokenKeyName: string
}

interface TokenResponse {
  accessToken: string
  refreshToken: string
}

type Subscriber = (accessToken: string) => void

export default class JwtService {
  public jwtConfig: JwtConfig
  private isAlreadyFetchingAccessToken = false
  private subscribers: Subscriber[] = []

  constructor(jwtOverrideConfig?: Partial<JwtConfig>) {
    this.jwtConfig = { ...jwtDefaultConfig, ...jwtOverrideConfig }

    axios.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const accessToken = this.getToken()
        if (accessToken && config.headers) {
          config.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error),
    )

    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const { config, response } = error
        const originalRequest = config

        if (response && response.status === 401) {
          if (!this.isAlreadyFetchingAccessToken) {
            this.isAlreadyFetchingAccessToken = true

            try {
              const res = await this.refreshToken()
              const { accessToken, refreshToken } = res.data as TokenResponse

              this.setToken(accessToken)
              this.setRefreshToken(refreshToken)
              this.onAccessTokenFetched(accessToken)
            } catch (err) {
              return Promise.reject(err)
            } finally {
              this.isAlreadyFetchingAccessToken = false
            }
          }

          return new Promise<AxiosResponse>((resolve) => {
            this.addSubscriber((accessToken: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`
              }
              resolve(axios(originalRequest))
            })
          })
        }

        return Promise.reject(error)
      },
    )
  }

  private onAccessTokenFetched(accessToken: string): void {
    // biome-ignore lint/complexity/noForEach: <no explanation>
    this.subscribers.forEach((callback) => callback(accessToken))
    this.subscribers = []
  }

  private addSubscriber(callback: Subscriber): void {
    this.subscribers.push(callback)
  }

  getToken(): string | null {
    return localStorage.getItem(this.jwtConfig.storageTokenKeyName)
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.jwtConfig.storageRefreshTokenKeyName)
  }

  setToken(value: string): void {
    localStorage.setItem(this.jwtConfig.storageTokenKeyName, value)
  }

  setRefreshToken(value: string): void {
    localStorage.setItem(this.jwtConfig.storageRefreshTokenKeyName, value)
  }

  login<T = unknown>(data: T): Promise<AxiosResponse> {
    return axios.post(this.jwtConfig.loginEndpoint, data)
  }

  register<T = unknown>(data: T): Promise<AxiosResponse> {
    return axios.post(this.jwtConfig.registerEndpoint, data)
  }

  refreshToken(): Promise<AxiosResponse<TokenResponse>> {
    return axios.post(this.jwtConfig.refreshEndpoint, {
      refreshToken: this.getRefreshToken(),
    })
  }
}
