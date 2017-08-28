const ExcelUtil = require('xlsx')
const os = require('os')
const fs = require('fs')

const homeDir = os.homedir()
const workbook = ExcelUtil.readFile(`${homeDir}/Downloads/DCWThe Project DatabaseV3.xlsm`)
const sheetNames = workbook.SheetNames

const MAIN_SHEET_NAME = 'MASTER'
const mainSheetAsJson = ExcelUtil.utils.sheet_to_json(workbook.Sheets[MAIN_SHEET_NAME])
const cleanedJson = cleanRecords(mainSheetAsJson)
const cleanedSheet = ExcelUtil.utils.json_to_sheet(cleanedJson)
const sheetAsCSV = ExcelUtil.utils.sheet_to_csv(cleanedSheet, { FS: "\t" })
debugger;
fs.writeFileSync('cleanProjects.tsv', sheetAsCSV)

function cleanRecords(records) {
  return records.map(cleanRecord)
}

function cleanRecord(record, index) {
  let cleanedRecord = {}
  // Add an ID to each record
  cleanedRecord['data_id'] = index
  Object.keys(record).forEach((key) => {
    let value = record[key]
    cleanedRecord[cleanString(key)] = cleanString(value)
  })

  return cleanedRecord
}

function cleanString(string) {
  return escapeQuotes(trimWhiteSpace(removeNewLines(string)))
}

function removeNewLines(string) {
  return string.replace(/[\n\r]/g, '')
}

function trimWhiteSpace(string) {
  return string.trim()
}

function escapeQuotes(string) {
  return string.replace(/"/g, '\\"')
}
