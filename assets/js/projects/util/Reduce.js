import lodash from 'lodash'

const reduceSum = (grouping, valueKey) => {
  return lodash.mapValues(grouping, (recordsInGroup) => recordsInGroup.reduce((accumulator, next) => accumulator += Number(next[valueKey]), 0))
}

const reduceCount = (grouping) => {
  return lodash.mapValues(grouping, (recordsInGroup) => recordsInGroup.length)
}

export { reduceSum, reduceCount }
