import { getSupabaseAdmin } from '@/lib/server/supabase'
import { getOrgId } from '@/lib/server/org-id'
import type {
  FarmBackupV1,
  Worker,
  Farm,
  DailyRecord,
  AttendanceStatus,
  SalaryRuleHistory,
} from '@/lib/store'

const DEFAULT_FARMS: Farm[] = [
  { id: 'farm-a', name: 'Farm A', location: 'North Block', treeCount: 450 },
  { id: 'farm-b', name: 'Farm B', location: 'East Grove', treeCount: 320 },
  { id: 'farm-c', name: 'Farm C', location: 'South Field', treeCount: 580 },
  { id: 'farm-d', name: 'Farm D', location: 'West Palm', treeCount: 410 },
]

export async function loadFarmState(orgId = getOrgId()): Promise<FarmBackupV1> {
  const supabase = getSupabaseAdmin()

  const { count: workerCount } = await supabase
    .from('workers')
    .select('*', { count: 'exact', head: true })
    .eq('org_id', orgId)

  if (!workerCount) {
    const migrated = await migrateLegacyBackupIfPresent(orgId)
    if (migrated) return loadFarmState(orgId)
  }

  const [
    settingsRes,
    farmsRes,
    workersRes,
    workerFarmsRes,
    recordsRes,
    attendanceRes,
    musterRes,
    dayFarmRes,
    historyRes,
  ] = await Promise.all([
    supabase.from('org_settings').select('*').eq('org_id', orgId).maybeSingle(),
    supabase.from('farms').select('*').eq('org_id', orgId).order('name'),
    supabase.from('workers').select('*').eq('org_id', orgId).order('name'),
    supabase.from('worker_farm_assignments').select('*').eq('org_id', orgId),
    supabase.from('daily_records').select('*').eq('org_id', orgId),
    supabase.from('daily_attendance').select('*').eq('org_id', orgId),
    supabase.from('daily_muster').select('*').eq('org_id', orgId),
    supabase.from('daily_farm_assignments').select('*').eq('org_id', orgId),
    supabase
      .from('salary_rule_history')
      .select('*')
      .eq('org_id', orgId)
      .order('changed_at', { ascending: false })
      .limit(20),
  ])

  const settingsRow = settingsRes.data
  const farms =
    farmsRes.data?.map((f) => ({
      id: f.id,
      name: f.name,
      location: f.location ?? '',
      treeCount: f.tree_count ?? 0,
      imageUrl: f.image_url ?? undefined,
    })) ?? DEFAULT_FARMS

  const workerFarmMap = new Map<string, string[]>()
  for (const row of workerFarmsRes.data ?? []) {
    const list = workerFarmMap.get(row.worker_id) ?? []
    list.push(row.farm_id)
    workerFarmMap.set(row.worker_id, list)
  }

  const workers: Worker[] =
    workersRes.data?.map((w) => ({
      id: w.id,
      name: w.name,
      phone: w.phone ?? undefined,
      workerType: (w.worker_type as Worker['workerType']) ?? 'plucker',
      status: (w.status as Worker['status']) ?? 'active',
      joiningDate: w.joining_date ?? undefined,
      salaryCategory: w.salary_category ?? undefined,
      village: w.village ?? undefined,
      district: w.district ?? undefined,
      address: w.address ?? undefined,
      notes: w.notes ?? undefined,
      assignedFarmIds: workerFarmMap.get(w.id),
    })) ?? []

  const dailyRecords: DailyRecord[] =
    recordsRes.data?.map((r) => ({
      date: r.record_date,
      workerId: r.worker_id,
      treeCount: r.tree_count ?? 0,
      farmId: r.farm_id ?? undefined,
      notes: r.notes ?? undefined,
    })) ?? []

  const selectedWorkerIds: Record<string, string[]> = {}
  for (const row of musterRes.data ?? []) {
    const d = row.record_date
    if (!selectedWorkerIds[d]) selectedWorkerIds[d] = []
    selectedWorkerIds[d].push(row.worker_id)
  }

  const attendance: Record<string, Record<string, AttendanceStatus>> = {}
  for (const row of attendanceRes.data ?? []) {
    const d = row.record_date
    if (!attendance[d]) attendance[d] = {}
    attendance[d][row.worker_id] = row.status as AttendanceStatus
  }

  const farmAssignments: Record<string, Record<string, string[]>> = {}
  for (const row of dayFarmRes.data ?? []) {
    const d = row.record_date
    if (!farmAssignments[d]) farmAssignments[d] = {}
    const list = farmAssignments[d][row.worker_id] ?? []
    list.push(row.farm_id)
    farmAssignments[d][row.worker_id] = list
  }

  const salaryRuleHistory: SalaryRuleHistory[] =
    historyRes.data?.map((h) => ({
      id: h.id,
      ratePerTree: Number(h.rate_per_tree),
      pfPerTree: Number(h.pf_per_tree),
      effectiveDate: h.effective_date,
      changedAt: h.changed_at,
    })) ?? []

  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    workers,
    dailyRecords,
    selectedWorkerIds,
    farms: farms.length ? farms : DEFAULT_FARMS,
    attendance,
    farmAssignments,
    salaryRuleHistory,
    settings: {
      ratePerTree: Number(settingsRow?.rate_per_tree ?? 25),
      pfPerTree: Number(settingsRow?.pf_per_tree ?? 2),
    },
  }
}

export async function saveFarmState(
  data: FarmBackupV1,
  orgId = getOrgId()
): Promise<void> {
  const supabase = getSupabaseAdmin()

  await supabase.from('org_settings').upsert({
    org_id: orgId,
    rate_per_tree: data.settings.ratePerTree,
    pf_per_tree: data.settings.pfPerTree,
    updated_at: new Date().toISOString(),
  })

  const farmRows =
    data.farms?.length ? data.farms : DEFAULT_FARMS
  await supabase.from('farms').upsert(
    farmRows.map((f) => ({
      id: f.id,
      org_id: orgId,
      name: f.name,
      location: f.location,
      tree_count: f.treeCount,
      image_url: f.imageUrl ?? null,
      updated_at: new Date().toISOString(),
    }))
  )

  const workerIds = data.workers.map((w) => w.id)
  if (workerIds.length) {
    await supabase.from('workers').upsert(
      data.workers.map((w) => ({
        id: w.id,
        org_id: orgId,
        name: w.name,
        phone: w.phone ?? null,
        worker_type: w.workerType ?? 'plucker',
        status: w.status ?? 'active',
        joining_date: w.joiningDate ?? null,
        salary_category: w.salaryCategory ?? null,
        village: w.village ?? null,
        district: w.district ?? null,
        address: w.address ?? null,
        notes: w.notes ?? null,
        updated_at: new Date().toISOString(),
      }))
    )
  } else {
    await supabase.from('workers').delete().eq('org_id', orgId)
  }

  await supabase.from('worker_farm_assignments').delete().eq('org_id', orgId)
  const wfRows: { org_id: string; worker_id: string; farm_id: string }[] = []
  for (const w of data.workers) {
    for (const farmId of w.assignedFarmIds ?? []) {
      wfRows.push({ org_id: orgId, worker_id: w.id, farm_id: farmId })
    }
  }
  if (wfRows.length) {
    await supabase.from('worker_farm_assignments').insert(wfRows)
  }

  await supabase.from('daily_records').delete().eq('org_id', orgId)
  if (data.dailyRecords.length) {
    await supabase.from('daily_records').insert(
      data.dailyRecords.map((r) => ({
        org_id: orgId,
        worker_id: r.workerId,
        farm_id: r.farmId ?? null,
        record_date: r.date,
        tree_count: r.treeCount,
        notes: r.notes ?? null,
      }))
    )
  }

  await supabase.from('daily_muster').delete().eq('org_id', orgId)
  const musterRows: { org_id: string; worker_id: string; record_date: string }[] =
    []
  for (const [date, ids] of Object.entries(data.selectedWorkerIds)) {
    for (const workerId of ids) {
      musterRows.push({ org_id: orgId, worker_id: workerId, record_date: date })
    }
  }
  if (musterRows.length) {
    await supabase.from('daily_muster').insert(musterRows)
  }

  await supabase.from('daily_attendance').delete().eq('org_id', orgId)
  const attRows: {
    org_id: string
    worker_id: string
    record_date: string
    status: string
  }[] = []
  for (const [date, map] of Object.entries(data.attendance ?? {})) {
    for (const [workerId, status] of Object.entries(map)) {
      attRows.push({
        org_id: orgId,
        worker_id: workerId,
        record_date: date,
        status,
      })
    }
  }
  if (attRows.length) {
    await supabase.from('daily_attendance').insert(attRows)
  }

  await supabase.from('daily_farm_assignments').delete().eq('org_id', orgId)
  const assignRows: {
    org_id: string
    worker_id: string
    record_date: string
    farm_id: string
  }[] = []
  for (const [date, map] of Object.entries(data.farmAssignments ?? {})) {
    for (const [workerId, farmIds] of Object.entries(map)) {
      for (const farmId of farmIds) {
        assignRows.push({
          org_id: orgId,
          worker_id: workerId,
          record_date: date,
          farm_id: farmId,
        })
      }
    }
  }
  if (assignRows.length) {
    await supabase.from('daily_farm_assignments').insert(assignRows)
  }

  await supabase.from('salary_rule_history').delete().eq('org_id', orgId)
  if (data.salaryRuleHistory?.length) {
    await supabase.from('salary_rule_history').insert(
      data.salaryRuleHistory.map((h) => ({
        id: h.id,
        org_id: orgId,
        rate_per_tree: h.ratePerTree,
        pf_per_tree: h.pfPerTree,
        effective_date: h.effectiveDate,
        changed_at: h.changedAt,
      }))
    )
  }

  const { data: existingWorkers } = await supabase
    .from('workers')
    .select('id')
    .eq('org_id', orgId)
  const staleWorkerIds =
    existingWorkers
      ?.map((w) => w.id)
      .filter((id) => !workerIds.includes(id)) ?? []
  if (staleWorkerIds.length) {
    await supabase.from('workers').delete().in('id', staleWorkerIds)
  }

  const farmIds = farmRows.map((f) => f.id)
  const { data: existingFarms } = await supabase
    .from('farms')
    .select('id')
    .eq('org_id', orgId)
  const staleFarmIds =
    existingFarms?.map((f) => f.id).filter((id) => !farmIds.includes(id)) ?? []
  if (staleFarmIds.length) {
    await supabase.from('farms').delete().in('id', staleFarmIds)
  }
}

async function migrateLegacyBackupIfPresent(orgId: string): Promise<boolean> {
  const supabase = getSupabaseAdmin()
  const { data } = await supabase
    .from('farm_backups')
    .select('data')
    .eq('farm_id', orgId)
    .maybeSingle()

  if (!data?.data || typeof data.data !== 'object') return false

  const backup = data.data as FarmBackupV1
  if (!backup.workers?.length) return false

  await saveFarmState(
    {
      version: 1,
      updatedAt: backup.updatedAt ?? new Date().toISOString(),
      workers: backup.workers,
      dailyRecords: backup.dailyRecords ?? [],
      selectedWorkerIds: backup.selectedWorkerIds ?? {},
      settings: backup.settings ?? { ratePerTree: 25, pfPerTree: 2 },
      farms: backup.farms,
      attendance: backup.attendance,
      farmAssignments: backup.farmAssignments,
      salaryRuleHistory: backup.salaryRuleHistory,
    },
    orgId
  )
  return true
}
