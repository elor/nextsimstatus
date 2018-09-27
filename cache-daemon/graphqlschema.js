const {
  buildSchema
} = require("graphql");

module.exports = buildSchema(`
type Query {
  lastupdate: String
  cachestart: String
  nodes: [Node]
  jobs: [Job]
  users: [User]
  simpcs: [SimPC]
}

type Node {
  NodeName: String
  Arch: String
  CoresPerSocket: Int
  CPUAlloc: Int
  CPUErr: Int
  CPUTot: Int
  CPULoad: Float
  AvailableFeatures: String
  ActiveFeatures: String
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
  TmpDisk: Int
  Weight: Int
  Owner: String
  Partitions: String
  BootTime: String
  SlurmdStartTime: String
  CfgTRES: String
  AllocTRES: String
  CapWatts: String
  CurrentWatts: Int
  LowestJoules: String
  ConsumedJoules: String
  ExtSensorsJoules: String
  ExtSensorsWatts: String
  ExtSensorsTemp: String
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
}

type User {
  Name: String
}

type SimPC {
  datetime: String
  hostname: String
  load: [Float]
  mounts: [Mount]
  printers: [String]
  release: String
  uptime: Float
  users: [String]
}

type Mount {
  mount: String
  options: [String]
  source: String
  type: String
}
`);
