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
    mac
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

  racks {
    error
    name
    shortname
    cooling_capacity
    fan_running
    fan_speed
    return_air
    return_water
    supply_air
    supply_water
    valve_position
    valve_position_redundant
    water_flow
  }

  quotas {
    name
    id
    bytes
    files
    bytes_hard_quota
    files_hard_quota
  }
}
`
