export default function usercores (jobs) {
  let users = {}

  jobs.forEach(job => {
    if (users[job.UserName]) {
      users[job.UserName] += Number(job.NumCPUs)
    } else {
      users[job.UserName] = Number(job.NumCPUs)
    }
  })

  return Object.keys(users)
    .map(name => ({
      name,
      cpus: users[name]
    }))
    .sort((a, b) => b.cpus - a.cpus)
}
