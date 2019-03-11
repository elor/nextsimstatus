import general from './items/general'
import slurm from './items/slurm'
import services from './items/services'
import modules from './items/modules'
import python from './items/python'
import simpc from './items/simpc'
import todo from './items/todo'

export default [
  ...general,
  ...simpc,
  ...services,
  ...slurm,
  ...modules,
  ...python,
  ...todo
]
