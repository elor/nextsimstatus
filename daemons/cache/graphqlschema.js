const {
  buildSchema
} = require('graphql')

module.exports = buildSchema(`
type Query {
  lastupdate: String
  cachestart: String
  nodes: [Node]
  jobs: [Job]
  users: [User]
  simpcs: [SimPC]
  racks: [Rack]
  quotas: Quota
}

type Node {
  NodeName: String
  Arch: String
  CoresPerSocket: Int
  CPUAlloc: Int
  CPUErr: Int
  CPUTot: Int
  CPULoad: Float
  Gres: String
  NodeAddr: String
  NodeHostName: String
  Version: String
  OS: String
  RealMemory: Int
  AllocMem: Int
  FreeMem: Int
  Sockets: Int
  Boards: Int
  State: String
  ThreadsPerCore: Int
  Weight: Int
  Partitions: String
  BootTime: String
  SlurmdStartTime: String
  CfgTRES: String
  AllocTRES: String
}

type Job {
  NodeList: String
  JobName: String
  EndTime: String
  NumTasks: Int
  JobState: String
  SubmitTime: String
  NumNodes: String
  UserId: String
  JobId: Int
  Reason: String
  NumCPUs: Int
  WorkDir: String
  Gres: String
  Partition: String
  Dependency: String
  Command: String
  ArrayJobId: Int
  ArrayTaskId: String
  EligibleTime: String
  TimeLimit: String
  StartTime: String
  BatchHost: String
  Licenses: String
  RunTime: String
  ExitCode: String
  Features: String
}

type User {
  Name: String
}

type SimPC {
  datetime: String
  hostname: String
  load: [Float]
  mounts: [Mount]
  mac: String,
  printers: [String]
  release: String
  uptime: Float
  users: [String]
  vpn: Boolean
  rebootrequired: Boolean
  updates: Int
  cores: Int
  utmp: [Utmp]
}

type Utmp {
  addr0: Int
  addr1: Int
  addr2: Int
  addr3: Int
  exit0: Int
  exit1: Int
  host: String
  id: String
  line: String
  pid: Int
  sec: Int
  session: Int
  time: String
  type: Int
  usec: Int
  user: String
}

type Mount {
  mount: String
  options: [String]
  source: String
  type: String
}

type Rack {
  error: String
  name: String
  shortname: String
  cooling_capacity: Float
  fan_running: Boolean
  fan_speed: Float
  return_air: Float
  return_water: Float
  supply_air: Float
  supply_water: Float
  valve_position: Float
  valve_position_redundant: Float
  water_flow: Float
}

type Quota {
  user: [UserQuota]
  group: [GroupQuota]
  project: [ProjectQuota]
  df: [DiskFree]
}

type UserQuota {
  user: String
  filesystem: String
  kbytes: String
  quota: String
  limit: String
  files: String
  grace: String
}

type GroupQuota {
  group: String
  filesystem: String
  kbytes: String
  quota: String
  limit: String
  files: String
  grace: String
}

type ProjectQuota {
  project: String
  filesystem: String
  kbytes: String
  quota: String
  limit: String
  files: String
  grace: String
}

type DiskFree {
  filesystem: String
  kbytes: String
  used: String
  available: String
  use_percent: String
  mounted: String
}

type Usernames {
  user: String
  fullname: String
}
`)
