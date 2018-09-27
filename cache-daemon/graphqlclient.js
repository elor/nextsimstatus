const {
  request
} = require("graphql-request");

const querySchema = `
{
  lastupdate,
  cachestart,
  nodes {
    NodeName
    CPUTot
    CPUAlloc
    CPULoad
    BootTime
    RealMemory
    AllocMem
    FreeMem
    Partitions
    State
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
  users {
    Name
  }
  simpcs {
    datetime
    hostname
    load
    mounts {
      mount
      options
      source
      type
    }
    printers
    release
    uptime
    users
  }
}
`;

function query() {
  request("http://localhost:8080/graphql", querySchema).then(response => {
    console.log(response);
  });
}

setInterval(query, 1000);
