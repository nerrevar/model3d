import {
  OAuthCredential,
  GoogleAuthProvider,
  GithubAuthProvider,
  UserCredential
} from 'firebase/auth'

export const getProvider =
  (providerName: string): GoogleAuthProvider | GithubAuthProvider => {
    switch (providerName) {
      case 'google': {
        const provider: GoogleAuthProvider = new GoogleAuthProvider()
        provider.addScope('profile')
        provider.addScope('email')
        return provider
      }
      case 'github': {
        const provider: GithubAuthProvider = new GithubAuthProvider()
        provider.setCustomParameters({
          allow_signup: 'false',
        })
        provider.addScope('read:user')
        provider.addScope('user:email')
        return provider
      }
      default: throw new Error('Invalid auth provider name!')
    }
  }

export const getCredentialStr =
  (userCredential: UserCredential, providerName: string) => {
    let credential: OAuthCredential = {} as OAuthCredential
    switch (providerName) {
      case 'google': {
        credential = GoogleAuthProvider
          .credentialFromResult(userCredential)!
        break
      }
      case 'github': {
        credential = GithubAuthProvider
          .credentialFromResult(userCredential)!
        break
      }
      default:
        throw new Error('Invalid auth provider name!')
    }
    return credential.toJSON()
  }

export const getCredentialFromStorage = (): OAuthCredential | null => {
  const providerName = localStorage.getItem('providerName')
  if (!providerName)
    return null
  const credential = JSON.parse(localStorage.getItem('authCredential') || '')
  if (!credential)
    return null

  switch (providerName) {
    case 'google':
      return GoogleAuthProvider.credential(
        credential.idToken,
        credential.accessToken
      )
    case 'github': return GithubAuthProvider.credential(credential.accessToken)
    default: return null
  }
}
