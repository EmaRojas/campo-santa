import Dexie from 'dexie'

const db = new Dexie('CampoDB')

db.version(1).stores({
  lotes: '++id, nombre'
})

export default db
