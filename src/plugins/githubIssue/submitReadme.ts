import { Octokit } from '@octokit/core'
import { Base64 } from 'js-base64'

let OWNER = ''
let REPO = ''

interface Comment {
  id: number
  user: {
    id: number
  } | null
}

interface Context {
  issueNumber: number
  userInfo: {
    id: number
  }
  commentList: Array<Comment>
}

const context: Context = {
  issueNumber: 0,
  userInfo: {
    id: 0,
  },
  commentList: [],
}

interface SubmitReadmeInfo {
  content: string
  githubToken: string
  owner: string
  repo: string
}

export async function submitReadme({
  content,
  githubToken,
  owner,
  repo,
}: SubmitReadmeInfo) {
  OWNER = owner
  REPO = repo

  const octokit = new Octokit({ auth: githubToken })

  async function submitContent(content: string) {
    const info = await selfUserInfo()
    const oldContentInfo = await getRepoContent()
    let unwrappedInfo
    if (Array.isArray(oldContentInfo)) {
      unwrappedInfo = oldContentInfo[1]
    } else {
      unwrappedInfo = oldContentInfo
    }
    console.log('the old info', oldContentInfo)

    const { data } = await octokit.request(
      'PUT /repos/{owner}/{repo}/contents/{path}',
      {
        owner: OWNER,
        repo: REPO,
        path: 'test.js',
        message: 'create or update file + 1',
        sha: unwrappedInfo.data.sha,
        content: Base64.encode(content),
      }
    )
    console.log('readme', data, info, unwrappedInfo.data.sha)
  }

  async function selfUserInfo() {
    const { data } = await octokit.request('/user')
    return data
  }
  async function getRepoContent() {
    const old = await octokit.request(
      'GET /repos/{owner}/{repo}/contents/{path}',
      {
        owner: OWNER,
        repo: REPO,
        path: 'test.js',
      }
    )
    return old
  }
  submitContent(content)
}
