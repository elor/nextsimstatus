export default function usercores(jobs) {
  const users = {}

  jobs.forEach(job => {
    users[job.UserName] = (users[job.UserName] || 0) + Number(job.NumCPUs)
  })

  return Object.keys(users)
    .map(name => ({
      name,
      cpus: users[name]
    }))
    .sort((a, b) => b.cpus - a.cpus)
}
