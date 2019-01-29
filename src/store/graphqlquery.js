export default `
{
  nodes {
    NodeName
    CPUAlloc
    CPUErr
    CPUTot
    CPULoad
    Gres
    RealMemory
    FreeMem
    State
    Partitions
    BootTime
    SlurmdStartTime
  }

  jobs {
    NodeList
    JobName
    EndTime
    NumTasks
    JobState
    SubmitTime
    NumNodes
    UserId
    JobId
    Reason
    NumCPUs
    WorkDir
    Gres
    Partition
    Dependency
    Command
    ArrayJobId
    ArrayTaskId
    EligibleTime
    TimeLimit
    StartTime
    BatchHost
    Licenses
    RunTime
  }

  simpcs {
    datetime
    hostname
    load
    mounts {
      mount
    }
    printers
    release
    uptime
    users
    vpn
  }
}
`
