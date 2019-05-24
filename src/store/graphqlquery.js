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
    ExitCode
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
    updates
    printers
    release
    uptime
    users
    cores
    vpn
    rebootrequired
    utmp {
      user
      time
      line
      host
      pid
    }
  }
}
`
