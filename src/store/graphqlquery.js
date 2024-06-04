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
    user {
      user
      filesystem
      kbytes
      quota
      limit
      files
      grace
    }
    group {
      group
      filesystem
      kbytes
      quota
      limit
      files
      grace
    }
    project {
      project
      filesystem
      kbytes
      quota
      limit
      files
      grace
    }
    df {
      filesystem
      kbytes
      used
      available
      use_percent
      mounted
    }
  }
}
`
