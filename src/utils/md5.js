import crypto from 'crypto'

export default function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex')
}
