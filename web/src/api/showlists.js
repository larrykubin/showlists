import { create } from 'apisauce'

export default showlistsApi = create({
  baseURL: 'https://api.github.com',
  headers: { Accept: 'application/vnd.github.v3+json' },
})

