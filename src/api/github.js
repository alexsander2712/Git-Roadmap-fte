
import { authRequest, segment } from "./http";

/**
 * GET /api/github/install
 * Solicita a URL de instalação do GitHub App.
 */
export function getInstallUrl() {
  return authRequest("/api/github/install");
}

/**
 * GET /api/github/repositories
 * Lista os repositórios acessíveis pela instalação.
 */
export function getRepositories() {
  return authRequest("/api/github/repositories");
}

/**
 * GET /api/github/repositories/:owner/:repo/branches
 */
export function getBranches(owner, repo) {
  return authRequest(
    `/api/github/repositories/${segment(owner)}/${segment(repo)}/branches`
  );
}

/**
 * GET /api/github/repositories/:owner/:repo/commits
 */
export function getCommits(owner, repo) {
  return authRequest(
    `/api/github/repositories/${segment(owner)}/${segment(repo)}/commits`
  );
}

/**
 * GET /api/github/repositories/:owner/:repo/commits/:sha
 */
export function getCommitDetails(owner, repo, sha) {
  return authRequest(
    `/api/github/repositories/${segment(owner)}/${segment(repo)}/commits/${segment(sha)}`
  );
}

/**
 * GET /api/graph/:owner/:repo
 */
export function getGraph(owner, repo) {
  return authRequest(
    `/api/graph/${segment(owner)}/${segment(repo)}`
  );
}

/**
 * GET /api/compare/:owner/:repo/commits/:base/:head
 */
export function compareCommits(owner, repo, base, head) {
  return authRequest(
    `/api/compare/${segment(owner)}/${segment(repo)}/commits/${segment(base)}/${segment(head)}`
  );
}
