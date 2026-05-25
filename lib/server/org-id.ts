export function getOrgId(): string {
  const orgId = (process.env.COCONEST_FARM_ID ?? 'Kandhan Coconuts').trim()
  if (!orgId) throw new Error('Missing COCONEST_FARM_ID env var')
  return orgId
}
